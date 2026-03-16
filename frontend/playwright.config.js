// playwright.config.js
module.exports = {
   testDir: './e2e',
   timeout: 30000,
   retries: 2,
   use: {
      headless: true,
      viewport: { width: 1280, height: 720 },
      ignoreHTTPSErrors: true,
      video: 'retain-on-failure',
      screenshot: 'only-on-failure',
   },
   projects: [
      {
         name: 'chromium',
         use: { browserName: 'chromium' },
      },
   ],
};