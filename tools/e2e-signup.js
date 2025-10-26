const { chromium } = require('playwright');

(async () => {
  const base = process.env.BASE_URL || 'http://localhost:3000';
  const email = `e2e+${Date.now()}@example.com`;
  const password = 'password1';
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    console.log('Visiting signup page...');
    await page.goto(`${base}/signup`, { waitUntil: 'networkidle' });

    console.log('Filling signup form (first time)...');
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await Promise.all([
      page.waitForNavigation({ url: '**/products', timeout: 8000 }).catch(() => null),
      page.click('button[type="submit"]')
    ]);

    const url = page.url();
    const firstSignupSuccess = url.includes('/products');
    console.log('First signup resulted in URL:', url);

    // attempt to sign up again with same email
    console.log('Attempting duplicate signup...');
    await page.goto(`${base}/signup`, { waitUntil: 'networkidle' });
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');

    // wait a moment for error to appear
    await page.waitForTimeout(500);
    const dupCount = await page.locator('text=This email is already registered').count();
    const dupAlt = await page.locator('text=This email is already registered. Please log in.').count();
    const duplicateDetected = dupCount + dupAlt > 0;

    console.log('Results:');
    console.log('  firstSignupSuccess=', firstSignupSuccess);
    console.log('  duplicateDetected=', duplicateDetected);

    if (firstSignupSuccess && duplicateDetected) {
      console.log('E2E: PASS - duplicate signup correctly blocked');
      process.exit(0);
    } else {
      console.error('E2E: FAIL - behavior unexpected');
      process.exit(2);
    }
  } catch (err) {
    console.error('E2E: ERROR', err);
    process.exit(3);
  } finally {
    if (browser) await browser.close();
  }
})();
