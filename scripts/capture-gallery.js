const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function captureGallery(url) {
  console.log(`\n📷 Capturing gallery images from: ${url}\n`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  await page.goto(url, { waitUntil: 'networkidle' });

  const screenshotDir = path.join(__dirname, '../image-audit-screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  // Scroll down to load lazy images
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(2000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1000);

  // Take full page screenshot with larger viewport
  await page.screenshot({
    path: path.join(screenshotDir, 'full-page-hd.png'),
    fullPage: true
  });
  console.log('📸 Saved HD full page screenshot');

  // Get all image sources and download them for analysis
  const images = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img')).map(img => ({
      src: img.src,
      alt: img.alt,
      width: img.naturalWidth,
      height: img.naturalHeight
    })).filter(img => !img.src.includes('logo') && img.width > 100);
  });

  console.log(`\n📷 Found ${images.length} content images:\n`);
  images.forEach((img, i) => {
    console.log(`${i + 1}. ${img.alt || '(no alt)'}`);
    console.log(`   ${img.src}`);
    console.log(`   ${img.width}x${img.height}\n`);
  });

  // Screenshot individual images by scrolling to each
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    try {
      const imgElement = await page.$(`img[src="${img.src}"]`);
      if (imgElement) {
        await imgElement.scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);

        const filename = `img-${i + 1}-${(img.alt || 'unnamed').replace(/[^a-zA-Z0-9]/g, '-').slice(0, 30)}.png`;
        await imgElement.screenshot({
          path: path.join(screenshotDir, filename)
        });
        console.log(`📸 Captured: ${filename}`);
      }
    } catch (e) {
      console.log(`⚠️ Could not capture image ${i + 1}: ${e.message}`);
    }
  }

  await browser.close();
  console.log('\n✅ Gallery capture complete!');
}

captureGallery('https://turbo-messengers-redesign.netlify.app').catch(console.error);
