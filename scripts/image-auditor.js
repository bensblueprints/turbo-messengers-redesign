const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function auditImages(url) {
  console.log(`\n🔍 Starting Image Audit for: ${url}\n`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle' });

  // Extract all images with context
  const images = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img')).map(img => {
      const rect = img.getBoundingClientRect();
      const parent = img.closest('section, article, div[class*="card"], div[class*="hero"], figure, div[class*="gallery"]');

      // Get surrounding text context
      const nearbyHeading = parent?.querySelector('h1, h2, h3, h4, h5')?.textContent?.trim();
      const nearbyParagraph = parent?.querySelector('p')?.textContent?.trim()?.slice(0, 200);
      const figcaption = img.closest('figure')?.querySelector('figcaption')?.textContent?.trim();

      // Get title attribute from parent or nearby elements
      const titleElement = parent?.querySelector('[class*="title"]');
      const titleText = titleElement?.textContent?.trim();

      return {
        src: img.src,
        alt: img.alt,
        title: img.title || titleText,
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        nearbyHeading,
        nearbyParagraph,
        figcaption,
        parentClass: parent?.className?.slice(0, 100),
        isVisible: rect.width > 50 && rect.height > 50,
        isDecorative: img.alt === '' || img.role === 'presentation',
        isLogo: img.src.includes('logo') || img.alt?.toLowerCase().includes('logo'),
        position: { top: Math.round(rect.top), left: Math.round(rect.left) }
      };
    }).filter(img => img.isVisible && !img.isDecorative && !img.isLogo);
  });

  console.log(`📷 Found ${images.length} content images\n`);

  // Take screenshots of each image
  const screenshotDir = path.join(__dirname, '../image-audit-screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  // Take full page screenshot
  await page.screenshot({
    path: path.join(screenshotDir, 'full-page.png'),
    fullPage: true
  });
  console.log('📸 Saved full page screenshot\n');

  const report = {
    url,
    date: new Date().toISOString(),
    totalImages: images.length,
    images: []
  };

  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    console.log(`\n--- Image ${i + 1}/${images.length} ---`);
    console.log(`Source: ${img.src}`);
    console.log(`Alt: "${img.alt || '(none)'}"`);
    console.log(`Title: "${img.title || '(none)'}"`);
    console.log(`Nearby Heading: "${img.nearbyHeading || '(none)'}"`);
    console.log(`Nearby Text: "${img.nearbyParagraph?.slice(0, 100) || '(none)'}..."`);
    console.log(`Dimensions: ${img.width}x${img.height}`);

    // Try to take a screenshot of this specific image
    try {
      const imgElement = await page.$(`img[src="${img.src}"]`);
      if (imgElement) {
        const filename = `image-${i + 1}-${path.basename(img.src).replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        await imgElement.screenshot({
          path: path.join(screenshotDir, `${filename}.png`)
        });
        console.log(`📸 Saved screenshot: ${filename}.png`);
      }
    } catch (e) {
      console.log(`⚠️ Could not screenshot image: ${e.message}`);
    }

    // Determine expected content based on context
    let expectedContent = '';
    if (img.nearbyHeading) {
      expectedContent = `Image should relate to: "${img.nearbyHeading}"`;
    } else if (img.alt) {
      expectedContent = `Image should show: "${img.alt}"`;
    } else if (img.nearbyParagraph) {
      expectedContent = `Image should relate to: "${img.nearbyParagraph.slice(0, 100)}..."`;
    }

    console.log(`Expected: ${expectedContent || '(unable to determine from context)'}`);

    report.images.push({
      index: i + 1,
      src: img.src,
      localPath: path.basename(img.src),
      alt: img.alt,
      title: img.title,
      nearbyHeading: img.nearbyHeading,
      nearbyParagraph: img.nearbyParagraph?.slice(0, 200),
      dimensions: `${img.width}x${img.height}`,
      expectedContent,
      needsReview: true // Will be updated after visual analysis
    });
  }

  // Save report
  const reportPath = path.join(screenshotDir, 'audit-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📝 Report saved to: ${reportPath}`);

  await browser.close();

  console.log('\n✅ Image audit complete!');
  console.log(`Screenshots saved to: ${screenshotDir}`);

  return report;
}

// Run audit
const url = process.argv[2] || 'https://turbo-messengers-redesign.netlify.app';
auditImages(url).catch(console.error);
