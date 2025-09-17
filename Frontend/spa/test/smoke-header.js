const puppeteer = require('puppeteer');

// Usage: set E2E_EMAIL and E2E_PASSWORD env vars, and run: node smoke-header.test.js
;(async () => {
  const email = process.env.E2E_EMAIL
  const password = process.env.E2E_PASSWORD
  if (!email || !password) {
    console.error('E2E_EMAIL and E2E_PASSWORD must be set');
    process.exit(2)
  }

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await page.goto('https://localhost:7046/login', { waitUntil: 'networkidle2' });
    await page.type('#email', email);
    await page.type('#password', password);
    await Promise.all([
      page.click('button[type=submit]'),
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 })
    ]);

    // Check localStorage for token
    const token = await page.evaluate(() => localStorage.getItem('token'))
    if (!token) throw new Error('Token not found in localStorage after login')

    // Go to home and check header shows logout
    await page.goto('https://localhost:7046/', { waitUntil: 'networkidle2' })
    const logoutButton = await page.$x("//button[contains(., 'Logout')]")
    if (logoutButton.length === 0) throw new Error('Logout button not found in header')

    // Click logout and ensure token removed
    await logoutButton[0].click()
    await page.waitForTimeout(500)
    const tokenAfter = await page.evaluate(() => localStorage.getItem('token'))
    if (tokenAfter) throw new Error('Token still present after logout')

    console.log('E2E smoke header test passed')
    await browser.close();
    process.exit(0)
  } catch (err) {
    console.error('E2E failed:', err);
    await browser.close();
    process.exit(1)
  }
})()
