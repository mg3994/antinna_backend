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
    // Valid base64 web safe header: {"alg":"RS256","typ":"JWT","kid":"mock-kid"}
    const headerB64 = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im1vY2sta2lkIn0';
    // Valid base64 web safe payload: {"iss":"https://securetoken.google.com/mock-project-id","aud":"mock-project-id","exp":9999999999,"sub":"mock_firebase_user_123"}
    const payloadB64 = 'eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vbW9jay1wcm9qZWN0LWlkIiwiYXVkIjoibW9jay1wcm9qZWN0LWlkIiwiZXhwIjo5OTk5OTk5OTk5LCJzdWIiOiJtb2NrX2ZpcmViYXNlX3VzZXJfMTIzIn0';
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
