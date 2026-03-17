// playwright.config.js
module.exports = {
   testDir: './e2e',
   timeout: 60000, // Increased timeout
   retries: 1, // Reduced retries since crashes are expected
   workers: 1, // Run tests serially to avoid interference
   use: {
      headless: true,
      viewport: { width: 1280, height: 720 },
      ignoreHTTPSErrors: true,
      video: 'on-first-retry',
      screenshot: 'only-on-failure',
      trace: 'retain-on-failure',
      launchOptions: {
         args: ['--disable-dev-shm-usage'] // Help with memory issues
      }
   },
   projects: [
      {
         name: 'chromium',
         use: {
            browserName: 'chromium',
            launchOptions: {
               args: [
                  '--disable-dev-shm-usage',
                  '--no-sandbox',
                  '--disable-setuid-sandbox'
               ]
            }
         },
      },
   ],
   reporter: [
      ['html', { outputFolder: 'playwright-report' }],
      ['json', { outputFile: 'test-results.json' }]
   ],
};