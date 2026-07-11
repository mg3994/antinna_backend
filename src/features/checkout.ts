import { HttpRequest } from '../core/http/request';
import { HttpResponse } from '../core/http/response';
import { AuthGuard } from '../core/auth/auth_guard';
import { OrderVerificationHandler } from '../core/handler/request_handler';
import { SpreadsheetDatabase } from '../core/database/spreadsheet';
import { SpreadsheetRepository } from '../core/repositories/repository';
import { EventBus } from '../core/events/event_bus';
import { AppsScriptGmail } from '../core/wrappers/gmail';
import { StatusCode } from '../core/constants/status_code';
import { AppConfig } from '../shared/config/config';

interface SavedOrder {
  id: string;
  buyerEmail: string;
  totalPrice: number;
  priceCurrency: string;
  status: string;
  createdAt: string;
  payload: string; // JSON-LD string
}

export class CheckoutFeature {
  private authGuard: AuthGuard;
  private db = new SpreadsheetDatabase();
  private orderRepo = new SpreadsheetRepository<SavedOrder>(this.db, 'Orders');
  private eventBus = new EventBus();
  private gmail = new AppsScriptGmail();

  constructor() {
    const firebaseProj = AppConfig.getFirebaseProjectId();
    this.authGuard = new AuthGuard(firebaseProj);

    // Subscribe default listeners
    this.eventBus.subscribe('OrderCompleted', (order: SavedOrder) => {
      console.log(`EventBus: Received OrderCompleted event for order [${order.id}].`);
    });
  }

  public handleCheckout(req: HttpRequest, res: HttpResponse): HttpResponse {
    // 1. Authenticate user session
    const isAuthed = this.authGuard.authenticate(req);
    if (!isAuthed) {
      return res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        status: StatusCode.UNAUTHORIZED,
        message: 'Unauthorized. Valid Firebase ID Token is required.',
        error: 'UNAUTHORIZED'
      });
    }

    // 2. Extract and Parse Order Payload
    const orderPayload = req.body.asJson();
    if (!orderPayload) {
      return res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        status: StatusCode.BAD_REQUEST,
        message: 'Missing or invalid order payload.',
        error: 'BAD_REQUEST'
      });
    }

    // 3. Deep validation of order against Blogger source of truth
    try {
      OrderVerificationHandler.verifyOrder(orderPayload);
    } catch (e: any) {
      // Return details of validation errors (e.g. price discrepancy, limits, etc.)
      return res.status(StatusCode.UNPROCESSABLE_ENTITY).json({
        success: false,
        status: StatusCode.UNPROCESSABLE_ENTITY,
        message: e.message || 'Order verification failed.',
        error: 'VALIDATION_FAILED',
        validationErrors: e.errors || {}
      });
    }

    // 4. Save verified order to Google Sheets
    const orderId = 'ORD_' + Utilities.getUuid().slice(0, 8).toUpperCase();
    const buyerEmail = (req as any).user?.email || 'buyer@example.com';
    const totalPrice = Number(orderPayload.totalPrice || 0);
    const priceCurrency = String(orderPayload.priceCurrency || 'INR');

    const saved: SavedOrder = {
      id: orderId,
      buyerEmail,
      totalPrice,
      priceCurrency,
      status: 'COMPLETED',
      createdAt: new Date().toISOString(),
      payload: JSON.stringify(orderPayload)
    };

    this.orderRepo.create(saved);

    // 5. Emit Event Bus notification
    this.eventBus.publish('OrderCompleted', saved);

    // 6. Email confirmation to user and admin
    try {
      const adminEmail = AppConfig.getAdminEmail();
      const subject = `Order Confirmed: ${orderId}`;
      const body = `
Dear Customer,

Thank you for your order! Your order has been verified and processed successfully.

Order Details:
----------------------------------------
Order ID: ${orderId}
Total Paid: ${priceCurrency} ${totalPrice}
Buyer: ${buyerEmail}
Date: ${saved.createdAt}
----------------------------------------

Best Regards,
Antinna E-Commerce Platform
      `.trim();

      // Email Buyer
      this.gmail.sendEmail(buyerEmail, subject, body);
      // Email Admin
      this.gmail.sendEmail(adminEmail, `[NEW ORDER] ${orderId}`, `A new verified order was recorded in Google Sheets.\n\n${body}`);
    } catch (err: any) {
      console.warn('CheckoutFeature: Email dispatch warning:', err.message || err);
    }

    return res.status(StatusCode.CREATED).json({
      success: true,
      status: StatusCode.CREATED,
      message: 'Order checked out and verified successfully!',
      data: {
        orderId,
        totalPrice,
        priceCurrency,
        createdAt: saved.createdAt
      }
    });
  }
}
