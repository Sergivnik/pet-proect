const puppeteer = require('puppeteer');

const LAUNCH_OPTS = {
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
};

let sharedBrowser = null;
let launchPromise = null;

function clearIfSame(disconnectedBrowser) {
  if (sharedBrowser === disconnectedBrowser) {
    sharedBrowser = null;
  }
}

/**
 * Один процесс Chromium на весь Node-процесс. Закрывать только страницы после работы.
 */
async function getSharedBrowser(retryDepth = 0) {
  if (retryDepth > 5) {
    throw new Error('Не удалось поднять общий браузер Puppeteer');
  }
  if (sharedBrowser && sharedBrowser.isConnected()) {
    return sharedBrowser;
  }
  if (!launchPromise) {
    launchPromise = puppeteer
      .launch(LAUNCH_OPTS)
      .then(browser => {
        sharedBrowser = browser;
        browser.on('disconnected', () => clearIfSame(browser));
        return browser;
      })
      .finally(() => {
        launchPromise = null;
      });
  }
  const browser = await launchPromise;
  if (browser && browser.isConnected()) {
    return browser;
  }
  if (sharedBrowser && sharedBrowser.isConnected()) {
    return sharedBrowser;
  }
  return getSharedBrowser(retryDepth + 1);
}

async function closeSharedBrowser() {
  const b = sharedBrowser;
  sharedBrowser = null;
  if (!b) return;
  try {
    await b.close();
  } catch (e) {
    console.error('closeSharedBrowser:', e);
  }
}

function setupProcessHooks() {
  const shutdown = () => {
    void closeSharedBrowser();
  };
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
}

setupProcessHooks();

module.exports = { getSharedBrowser, closeSharedBrowser };
