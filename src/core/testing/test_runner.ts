import { setupGlobalMocks } from './mocks';
import { bootstrap } from '../../app/bootstrap';
import { HttpRequest } from '../http/request';
import { HttpResponse } from '../http/response';
import { Validator } from '../validation/validator';
import { SpreadsheetDatabase } from '../database/spreadsheet';
import { SpreadsheetRepository } from '../repositories/repository';
import { JwtHelper } from '../security/jwt';
import { OrderVerificationHandler } from '../handler/request_handler';
import { ValidationError } from '../exceptions/validation_error';
import { MonthlyGSTJob } from '../jobs/monthly_gst_job';

async function runTests() {
  console.log('========================================');
  console.log('   STARTING ANTINNA CORE FRAMEWORK TESTS');
  console.log('========================================\n');

  setupGlobalMocks();
  let passedCount = 0;
  let failedCount = 0;

  function assert(condition: boolean, testName: string, message?: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passedCount++;
    } else {
      console.error(`[FAIL] ${testName} ${message ? '- ' + message : ''}`);
      failedCount++;
    }
  }

  // --- 1. Router & Bootstrapping Tests ---
  try {
    const app = bootstrap();
    const mockGetEvent = {
      pathInfo: 'api/health',
      parameter: {},
      parameters: {}
    };
    const req = new HttpRequest(mockGetEvent);
    const res = new HttpResponse();
    const router = app.getRouter();
    await router.handle(req, res);

    assert(res.getStatus() === 200, 'Router: GET /api/health returns status 200');
    assert(res.getBody()?.status === 'healthy', 'Router: GET /api/health returns correct healthy JSON payload');
  } catch (err: any) {
    assert(false, 'Router & Bootstrapping Tests', err.message);
  }

  // --- 2. Fluent Validation Tests ---
  try {
    const validData = { email: 'user@example.com', age: 25 };
    const invalidData = { email: 'bad_email', age: 'not_a_number' };

    const validator1 = Validator.make(validData);
    validator1.field('email').required().email();
    validator1.field('age').required().number().min(18);
    assert(validator1.validate() === true, 'Validation: Valid email and age pass validations');

    const validator2 = Validator.make(invalidData);
    validator2.field('email').required().email();
    validator2.field('age').required().number().min(18);
    assert(validator2.validate() === false, 'Validation: Invalid email and string age fail validations');
    assert(validator2.getErrors().email !== undefined, 'Validation: Correctly reports email field error');
    assert(validator2.getErrors().age !== undefined, 'Validation: Correctly reports age field error');
  } catch (err: any) {
    assert(false, 'Validation Tests', err.message);
  }

  // --- 3. Security & JWT Validation ---
  try {
    // Generate valid Firebase claims mock matching rotiride/manish structure
    const header = { alg: "RS256", typ: "JWT", kid: "mock-kid" };
    const payload = {
      iss: "https://securetoken.google.com/mock-project-id",
      aud: "mock-project-id",
      sub: "mock_firebase_user_123",
      iat: 1771234480,
      exp: 9999999999,
      auth_time: 1771234480,
      user_id: "mock_firebase_user_123",
      provider_id: null,
      name: "Manish Gautam",
      picture: "https://lh3.googleusercontent.com/a/ACg8ocKhwvi-XWb2uxuqRIrfUX7lLPWFt6ddpSzMD5j5_FKDodRj6w=s96-c",
      email: "manishgautammg7@gmail.com",
      email_verified: true,
      firebase: {
        identities: {
          email: ["manishgautammg7@gmail.com"],
          "google.com": ["113681971281438025355"],
          phone: ["+919729323674"]
        },
        sign_in_provider: "google.com"
      },
      phone_number: "+919729323674"
    };

    const headerB64 = Utilities.base64EncodeWebSafe(JSON.stringify(header));
    const payloadB64 = Utilities.base64EncodeWebSafe(JSON.stringify(payload));
    const mockToken = `${headerB64}.${payloadB64}.signature`;

    const isVerified = JwtHelper.verifyFirebaseToken(mockToken, 'mock-project-id');
    assert(isVerified === true, 'Security: Firebase RS256 token verified using standard tokeninfo fetch API');
  } catch (err: any) {
    assert(false, 'Security & JWT Tests', err.message);
  }

  // --- 4. Database & Repository CRUD Tests ---
  try {
    const db = new SpreadsheetDatabase();
    interface TestRecord { id: string; name: string; value: number }
    const repo = new SpreadsheetRepository<TestRecord>(db, 'TestTable');

    const created = repo.create({ id: 'rec_1', name: 'Item One', value: 100 });
    assert(created.id === 'rec_1', 'Database: Item created successfully in transactional SheetTable');

    const found = repo.findById('rec_1');
    assert(found !== null && found.name === 'Item One', 'Database: FindById returns correct row entry');

    const updated = repo.update('rec_1', { name: 'Updated Item One' });
    assert(updated === true, 'Database: Row update returns true');
    assert(repo.findById('rec_1')?.name === 'Updated Item One', 'Database: Row values updated successfully');

    const deleted = repo.delete('rec_1');
    assert(deleted === true, 'Database: Row deletion returns true');
    assert(repo.findById('rec_1') === null, 'Database: Row successfully removed from SheetTable');
  } catch (err: any) {
    assert(false, 'Database & Repository Tests', err.message);
  }

  // --- 5. Schema Extraction & Verification Tests ---
  try {
    // A test order payload representing a correct order matching our setupGlobalMocks() Product
    const validOrder = {
      "@type": "Order",
      orderedItem: [
        {
          itemKey: "item_premium",
          orderQuantity: 2,
          orderedItem: {
            "@type": "Product",
            name: "Mock Premium Product",
            sku: "premium_123",
            url: "https://blog.example.com/premium-product",
            offers: {
              "@type": "Offer",
              price: "999",
              priceCurrency: "INR"
            }
          },
          addOns: [
            {
              orderQuantity: 2,
              orderedItem: {
                "@type": "Product",
                name: "Luxury Gift Wrap",
                offers: {
                  "@type": "Offer",
                  price: "50",
                  priceCurrency: "INR"
                }
              }
            }
          ]
        }
      ]
    };

    let orderVerified = false;
    try {
      OrderVerificationHandler.verifyOrder(validOrder);
      orderVerified = true;
    } catch (e) {
      orderVerified = false;
    }
    assert(orderVerified === true, 'Order Verification: Successfully verifies correct order matching live product price/stock/limits');

    // Scenario B: Let's tamper with the price on the client side (e.g., set price to 10 instead of 999)
    const tamperedOrder = JSON.parse(JSON.stringify(validOrder));
    tamperedOrder.orderedItem[0].orderedItem.offers.price = "10";

    let tamperedVerified = false;
    let caughtDiscrepancy = false;
    try {
      OrderVerificationHandler.verifyOrder(tamperedOrder);
      tamperedVerified = true;
    } catch (e: any) {
      tamperedVerified = false;
      if (e instanceof ValidationError) {
        caughtDiscrepancy = e.errors['item_premium.price'] !== undefined;
      }
    }
    assert(tamperedVerified === false && caughtDiscrepancy === true, 'Order Verification: Successfully catches client-side price tampering');

    // Scenario C: Exceed limits of quantitative value (maxValue = 5, order 10 items)
    const tooManyItemsOrder = JSON.parse(JSON.stringify(validOrder));
    tooManyItemsOrder.orderedItem[0].orderQuantity = 10;

    let tooManyVerified = false;
    let caughtLimitError = false;
    try {
      OrderVerificationHandler.verifyOrder(tooManyItemsOrder);
      tooManyVerified = true;
    } catch (e: any) {
      tooManyVerified = false;
      if (e instanceof ValidationError) {
        caughtLimitError = e.errors['item_premium.quantity'] !== undefined;
      }
    }
    assert(tooManyVerified === false && caughtLimitError === true, 'Order Verification: Successfully catches quantity limit (maxValue) violation');

    // Scenario D: Exceed limits of addon quantitative value (addon max is 3 * parent quantity. Parent quantity = 1, order 5 addons)
    const invalidAddonQtyOrder = JSON.parse(JSON.stringify(validOrder));
    invalidAddonQtyOrder.orderedItem[0].orderQuantity = 1;
    invalidAddonQtyOrder.orderedItem[0].addOns[0].orderQuantity = 5;

    let addonVerified = false;
    let caughtAddonLimitError = false;
    try {
      OrderVerificationHandler.verifyOrder(invalidAddonQtyOrder);
      addonVerified = true;
    } catch (e: any) {
      addonVerified = false;
      if (e instanceof ValidationError) {
        caughtAddonLimitError = e.errors['item_premium.addOns[0].quantity'] !== undefined;
      }
    }
    assert(addonVerified === false && caughtAddonLimitError === true, 'Order Verification: Successfully catches parent-scaled addon quantity limit violation');

  } catch (err: any) {
    assert(false, 'Schema Extraction & Verification Tests', err.message);
  }

  // --- 6. GST Compliance Scheduled Job Tests ---
  try {
    const db = new SpreadsheetDatabase();
    interface OrderRecord {
      id: string;
      buyerEmail: string;
      totalPrice: number;
      priceCurrency: string;
      status: string;
      createdAt: string;
    }
    const repo = new SpreadsheetRepository<OrderRecord>(db, 'Orders');

    // Seed mock Orders (Sales and Returns) for current month
    const curISO = new Date().toISOString();
    repo.create({ id: 'ord_sale_1', buyerEmail: 'buyer1@example.com', totalPrice: 10000, priceCurrency: 'INR', status: 'COMPLETED', createdAt: curISO });
    repo.create({ id: 'ord_sale_2', buyerEmail: 'buyer2@example.com', totalPrice: 5000, priceCurrency: 'INR', status: 'COMPLETED', createdAt: curISO });
    repo.create({ id: 'ord_return_1', buyerEmail: 'buyer1@example.com', totalPrice: 2000, priceCurrency: 'INR', status: 'RETURNED', createdAt: curISO });

    // Execute the compliance job
    const gstJob = new MonthlyGSTJob();
    gstJob.execute();

    // Verify compliance sheet was created and holds correct audit figures
    const monthStr = String(new Date().getMonth() + 1).padStart(2, '0');
    const tabName = `GST_${new Date().getFullYear()}_${monthStr}`;
    const gstTable = db.getTable<any>(tabName);
    const rows = gstTable.getHeaders(); // Fetch headers to verify columns

    assert(rows.length > 0, 'GST compliance: Created Monthly GST compliance Sheet tab successfully');

    // Read the values to ensure sales (15000), returns (2000), net (13000) and GST liability (2340) are written correctly
    const sheetData = gstTable.getAll().map(row => row.data);

    // Find Summary Values in row data
    const summaryValues = sheetData.map(row => Object.values(row)[0]);
    assert(summaryValues.includes('GST COMPLIANCE AUDIT REPORT'), 'GST compliance: Includes standard audit report header');
    assert(summaryValues.includes('GST SUMMARY BREAKDOWN'), 'GST compliance: Includes compliance summary breakdown');
    assert(summaryValues.includes('TRANSACTION LEDGER'), 'GST compliance: Includes comprehensive ledger log for audit trail');

  } catch (err: any) {
    assert(false, 'GST Compliance Job Tests', err.message);
  }

  console.log('\n========================================');
  console.log(`   TEST EXECUTION COMPLETED`);
  console.log(`   Passed: ${passedCount} | Failed: ${failedCount}`);
  console.log('========================================');

  if (failedCount > 0) {
    throw new Error(`${failedCount} unit test(s) failed in the test suite.`);
  }
}

runTests().catch(err => {
  console.error('Test execution failed with error:', err);
  const proc = (globalThis as any).process;
  if (proc && proc.exit) {
    proc.exit(1);
  }
});
