import { BackendSchemaExtractor } from '../json/extractor';
import { ValidationError } from '../exceptions/validation_error';
import { StringUtils } from '../utils/strings';

export class OrderVerificationHandler {
  /**
   * Performs deep backend validation of a client's Order payload against live Blogger post JSON-LD.
   * Throws a ValidationError if any discrepancy is found.
   */
  public static verifyOrder(order: any): void {
    const errors: Record<string, string[]> = {};
    const items = BackendSchemaExtractor.getArray(order.orderedItem);

    if (items.length === 0) {
      throw new ValidationError('The shopping cart is empty.', { order: ['No ordered items found'] });
    }

    items.forEach((item: any, idx: number) => {
      const itemKey = item.itemKey || `item_${idx}`;
      const baseProduct = item.orderedItem;
      const url = baseProduct?.url;

      if (!url) {
        errors[itemKey] = ['Missing product URL for verification.'];
        return;
      }

      try {
        // 1. Fetch live Blogger post content
        const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
        if (response.getResponseCode() !== 200) {
          errors[itemKey] = [`Could not fetch authentic Blogger page at ${url}`];
          return;
        }

        const html = response.getContentText();

        // 2. Extract live schema from HTML (supports both script tag and raw text JSON)
        const authenticSchema = BackendSchemaExtractor.extractJsonLd<any>(html);
        if (!authenticSchema) {
          errors[itemKey] = [`Failed to extract valid Schema.org JSON-LD from ${url}`];
          return;
        }

        // 3. Find matching variant / base product
        const selectedVariants = baseProduct._selectedVariants || {};
        const matchedAuthentic = BackendSchemaExtractor.findMatchingVariant(authenticSchema, selectedVariants);

        if (!matchedAuthentic) {
          errors[itemKey] = ['No matching product or variant found in the authentic post.'];
          return;
        }

        // 4. Validate Price and Currency
        const authenticPriceInfo = BackendSchemaExtractor.extractPrice(matchedAuthentic.offers || matchedAuthentic);
        const clientPriceInfo = BackendSchemaExtractor.extractPrice(baseProduct.offers || baseProduct);

        if (clientPriceInfo.price !== authenticPriceInfo.price) {
          errors[`${itemKey}.price`] = [
            `Price discrepancy detected! Ordered: ${clientPriceInfo.currency} ${clientPriceInfo.price}, Authentic: ${authenticPriceInfo.currency} ${authenticPriceInfo.price}`
          ];
        }
        if (clientPriceInfo.currency !== authenticPriceInfo.currency) {
          errors[`${itemKey}.currency`] = [`Currency mismatch. Expected: ${authenticPriceInfo.currency}, Received: ${clientPriceInfo.currency}`];
        }

        // 5. Validate Availability
        const authenticAv = BackendSchemaExtractor.extractAvailability(matchedAuthentic.offers || matchedAuthentic);
        if (authenticAv === 'https://schema.org/OutOfStock' || authenticAv === 'https://schema.org/SoldOut') {
          errors[`${itemKey}.availability`] = ['Product is Out of Stock or Unavailable.'];
        }

        // 6. Validate Quantities against constraints
        const qty = Number(item.orderQuantity || 1);
        const { minValue, maxValue } = BackendSchemaExtractor.extractEligibleQuantity(matchedAuthentic);
        const inventoryLevel = BackendSchemaExtractor.extractInventoryLevel(matchedAuthentic.offers || matchedAuthentic);

        if (minValue !== null && qty < minValue) {
          errors[`${itemKey}.quantity`] = [`Order quantity ${qty} is less than required minimum of ${minValue}`];
        }

        const effectiveMax = (maxValue !== null && inventoryLevel !== null)
          ? Math.min(maxValue, inventoryLevel)
          : (maxValue || inventoryLevel);

        if (effectiveMax !== null && qty > effectiveMax) {
          errors[`${itemKey}.quantity`] = [`Order quantity ${qty} exceeds maximum available limit of ${effectiveMax}`];
        }

        // 7. Validate Add-Ons
        const addOns = BackendSchemaExtractor.getArray(item.addOns);
        const allAuthenticServices = BackendSchemaExtractor.findAllServices(authenticSchema);

        addOns.forEach((addon: any, addonIdx: number) => {
          const addonKey = `${itemKey}.addOns[${addonIdx}]`;
          const addonItem = addon.orderedItem;
          const normalizedAddonName = StringUtils.normalizeName(addonItem?.name || '');

          // Find addon in authentic services catalog of the parent product
          const matchedAuthenticAddon = allAuthenticServices.find(serviceOffer => {
            const innerItem = serviceOffer.itemOffered || serviceOffer;
            const name = BackendSchemaExtractor.getFirst(innerItem.name) || BackendSchemaExtractor.getFirst(serviceOffer.name);
            return StringUtils.normalizeName(name as string) === normalizedAddonName;
          });

          if (!matchedAuthenticAddon) {
            errors[addonKey] = [`Add-on "${addonItem?.name}" is not a valid accessory or service for this product.`];
            return;
          }

          // Validate Addon Price
          const authenticAddonPrice = BackendSchemaExtractor.extractPrice(matchedAuthenticAddon);
          const clientAddonPrice = BackendSchemaExtractor.extractPrice(addonItem.offers || addonItem);

          if (clientAddonPrice.price !== authenticAddonPrice.price) {
            errors[`${addonKey}.price`] = [
              `Price discrepancy on Addon! Ordered: ${clientAddonPrice.price}, Authentic: ${authenticAddonPrice.price}`
            ];
          }

          // Validate Addon Availability
          const authenticAddonAv = BackendSchemaExtractor.extractAvailability(matchedAuthenticAddon);
          if (authenticAddonAv === 'https://schema.org/OutOfStock' || authenticAddonAv === 'https://schema.org/SoldOut') {
            errors[`${addonKey}.availability`] = [`Addon "${addonItem?.name}" is Out of Stock.`];
          }

          // Validate Addon Quantities and parent ratios (using same scale from CartManager.ts)
          const addonQty = Number(addon.orderQuantity || 1);
          const { minValue: aMin, maxValue: aMax } = BackendSchemaExtractor.extractEligibleQuantity(matchedAuthenticAddon);
          const aInv = BackendSchemaExtractor.extractInventoryLevel(matchedAuthenticAddon.offers || matchedAuthenticAddon);

          // Scaled bounds according to parent ordered quantity
          const scaledMin = aMin !== null ? aMin * qty : null;
          const scaledMax = aMax !== null ? aMax * qty : null;
          const effectiveAddonMax = (scaledMax !== null && aInv !== null) ? Math.min(scaledMax, aInv) : (scaledMax || aInv);

          if (scaledMin !== null && addonQty < scaledMin) {
            errors[`${addonKey}.quantity`] = [`Addon quantity ${addonQty} is below minimum limit of ${scaledMin}`];
          }
          if (effectiveAddonMax !== null && addonQty > effectiveAddonMax) {
            errors[`${addonKey}.quantity`] = [`Addon quantity ${addonQty} exceeds maximum limit of ${effectiveAddonMax}`];
          }
        });

      } catch (err: any) {
        errors[itemKey] = [`Verification failed due to connection error: ${err.message || err}`];
      }
    });

    if (Object.keys(errors).length > 0) {
      throw new ValidationError('Order verification failed due to item discrepancies.', errors);
    }
  }
}
