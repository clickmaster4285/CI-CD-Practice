const { test, expect } = require('@playwright/test');

test.describe('Production Crash Detection', () => {
   test.beforeEach(async ({ page }) => {
      // Navigate to the app
      await page.goto('http://localhost:3000');
   });

   test('should detect missing environment variable', async ({ page }) => {
      // Check if API key is present in UI
      const apiKeyStatus = await page.textContent('text=/API Key status:/');
      expect(apiKeyStatus).toContain('✅ Present');
   });

   test('should detect browser API crashes', async ({ page }) => {
      // Listen for page errors
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));

      // Check if page crashes
      await page.waitForTimeout(2000); // Give time for useEffect to run

      expect(errors.length).toBe(0);
   });

   test('should detect infinite loops', async ({ page }) => {
      // Set a timeout to detect infinite loops
      test.setTimeout(10000);

      // Click on recursive crash button
      await page.click('button:has-text("Crash Recursive")');

      // Wait to see if page becomes unresponsive
      await page.waitForTimeout(2000);

      // Check if page is still responding
      const title = await page.title();
      expect(title).toBeDefined();
   });

   test('should detect memory leaks', async ({ page }) => {
      // Monitor memory usage
      const memoryUsage = await page.evaluate(() => {
         return performance.memory?.usedJSHeapSize;
      });

      // Click memory leak button
      await page.click('button:has-text("Start Memory Leak")');

      // Wait and check if memory increases dramatically
      await page.waitForTimeout(3000);

      const newMemoryUsage = await page.evaluate(() => {
         return performance.memory?.usedJSHeapSize;
      });

      // Memory shouldn't increase more than 100MB in 3 seconds
      if (memoryUsage && newMemoryUsage) {
         const increase = newMemoryUsage - memoryUsage;
         expect(increase).toBeLessThan(100 * 1024 * 1024);
      }
   });

   test('should detect API call failures', async ({ page }) => {
      // Click the API call button
      await page.click('button:has-text("Call API")');

      // Check for error messages in console
      const consoleErrors = [];
      page.on('console', msg => {
         if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
         }
      });

      // Wait for API call to complete/fail
      await page.waitForTimeout(2000);

      expect(consoleErrors.length).toBe(0);
   });

   test('should detect click-induced crashes', async ({ page }) => {
      // Click the dangerous button multiple times
      const button = page.locator('button:has-text("Click")');

      for (let i = 0; i < 5; i++) {
         await button.click();
         await page.waitForTimeout(500);

         // Check if page is still responsive
         const buttonText = await button.textContent();
         expect(buttonText).toContain(`Click ${i + 1}`);
      }
   });
});