const puppeteer = require('puppeteer');
const path = require('path');

async function generatePDF() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  const filePath = path.resolve(__dirname, 'ShopSphere_UI_Design_Document_Filled.html');
  await page.goto(`file://${filePath}`, { waitUntil: 'networkidle0' });
  
  await page.pdf({
    path: 'ShopSphere_UI_Design_Document_Exact.pdf',
    format: 'A4',
    printBackground: true,
    margin: {
      top: '0px',
      bottom: '0px',
      left: '0px',
      right: '0px'
    }
  });

  await browser.close();
  console.log('PDF Generated Successfully: ShopSphere_UI_Design_Document_Exact.pdf');
}

generatePDF().catch(console.error);
