
const fs = require('node:fs');
const path = require('node:path');

const distDir = path.resolve(__dirname, '..', 'dist');
const indexHtmlPath = path.join(distDir, 'index.html');

try {
  if (fs.existsSync(indexHtmlPath)) {
    let htmlContent = fs.readFileSync(indexHtmlPath, 'utf8');
    // More robust replacement to handle potential variations in src attribute
    htmlContent = htmlContent.replace(
      /<script\s+(type="module"\s+)?src="\/index\.tsx"\s*(type="module")?\s*><\/script>/,
      '<script type="module" src="index.js"></script>'
    );
    fs.writeFileSync(indexHtmlPath, htmlContent);
    console.log('Successfully updated script tag in dist/index.html to point to index.js');
  } else {
    console.error('Error: dist/index.html not found. Ensure it was copied correctly before this script runs.');
    process.exit(1);
  }
} catch (error) {
  console.error('Error processing dist/index.html:', error);
  process.exit(1);
}
