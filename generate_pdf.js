const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');

async function createDocument() {
  const pdfDoc = await PDFDocument.create();
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Helper page adder
  let page = pdfDoc.addPage([595.28, 841.89]); // A4 Size
  const { width, height } = page.getSize();
  let y = height - 40;

  function addHeader() {
    page.drawText('Amrita School of Computing, Amritapuri Campus', { x: 50, y, size: 14, font: fontBold, color: rgb(0.06, 0.09, 0.16) });
    y -= 18;
    page.drawText('Department of Computer Science and Engineering', { x: 50, y, size: 11, font: fontBold, color: rgb(0.2, 0.25, 0.33) });
    y -= 16;
    page.drawText('23CSE202 DATABASE MANAGEMENT SYSTEMS • S3 B.Tech CSE', { x: 50, y, size: 10, font: fontBold, color: rgb(0.15, 0.38, 0.92) });
    y -= 14;
    page.drawLine({ start: { x: 50, y }, end: { x: width - 50, y }, thickness: 1.5, color: rgb(0.06, 0.09, 0.16) });
    y -= 25;
  }

  function checkPageBreak(needed = 30) {
    if (y - needed < 50) {
      page = pdfDoc.addPage([595.28, 841.89]);
      y = height - 40;
    }
  }

  // 1. Header
  addHeader();

  // 2. Document Title
  page.drawText('2. UI Design Document', { x: 50, y, size: 16, font: fontBold, color: rgb(0.06, 0.09, 0.16) });
  y -= 20;

  // Metadata Box
  page.drawText('Group No: C15', { x: 50, y, size: 10, font: fontBold, color: rgb(0.2, 0.25, 0.33) });
  y -= 15;
  page.drawText('Project Title: ShopSphere: A Relational Database Management System for a Multi-Vendor Online Shopping Platform', { x: 50, y, size: 9, font: fontBold, color: rgb(0.2, 0.25, 0.33) });
  y -= 20;

  // Team Table
  page.drawText('Team Members:', { x: 50, y, size: 10, font: fontBold, color: rgb(0.06, 0.09, 0.16) });
  y -= 15;

  const team = [
    { no: '1', roll: 'AM.SC.U4CSE25251', name: 'SRAVAN N N' },
    { no: '2', roll: 'AM.SC.U4CSE25222', name: 'HARITH BHUVAN S' },
    { no: '3', roll: 'AM.SC.U4CSE25213', name: 'DEVANG DILEEP' },
    { no: '4', roll: 'AM.SC.U4CSE25233', name: 'JASIMKHAN J L' }
  ];

  team.forEach((t) => {
    page.drawText(`${t.no}. ${t.name} (${t.roll})`, { x: 65, y, size: 9.5, font: fontRegular, color: rgb(0.2, 0.25, 0.33) });
    y -= 14;
  });

  y -= 15;

  // 2.1 Functional requirements
  page.drawText('2.1. Functional requirements:', { x: 50, y, size: 12, font: fontBold, color: rgb(0.15, 0.38, 0.92) });
  y -= 16;

  const funcs = [
    '1. Multi-Role Navigation: Role switching between Customer Storefront, Vendor Dashboard, Admin Portal, and Cart & Atomic Checkout.',
    '2. Product Catalogue & Search: Multi-vendor catalog search with autocomplete, category pills, and multi-criteria filters (category, price in INR, rating, vendor).',
    '3. Vendor Inventory & Order Fulfillment: Real-time inventory table with low-stock trigger alerts (stock <= threshold) and order fulfillment queue.',
    '4. Platform Admin & DDL Management: Vendor approval workflow (Pending/Approved/Rejected), category taxonomy hierarchy tree, and live DB trigger logs.',
    '5. Cart, Coupon Engine & Atomic DBMS Checkout: Multi-vendor cart, eligibility coupon validation (SAVE15, SAVE20), and ACID SQL transaction simulation.'
  ];

  funcs.forEach((f) => {
    checkPageBreak(25);
    page.drawText(f, { x: 60, y, size: 9, font: fontRegular, color: rgb(0.2, 0.25, 0.33) });
    y -= 16;
  });

  y -= 10;

  // 2.2 Non-functional requirements
  checkPageBreak(40);
  page.drawText('2.2. Non-functional requirements:', { x: 50, y, size: 12, font: fontBold, color: rgb(0.15, 0.38, 0.92) });
  y -= 16;

  const nonFuncs = [
    '1. Responsiveness & Layout: Mobile-first flexible CSS Grid & Flexbox layout with left vertical rail sidebar, top search capsule, and bottom dock.',
    '2. Design Aesthetic: Dark Glassmorphism (#070a12 canvas, #0b1120 cards, backdrop blur, electric blue/purple gradients, Inter & Outfit fonts).',
    '3. Reactivity & Micro-animations: Smooth Framer Motion card lift effects, button micro-feedback, and real-time trigger event logging.',
    '4. Query Performance & Efficiency: Sub-40ms database query response latency with zero main thread blocking.'
  ];

  nonFuncs.forEach((nf) => {
    checkPageBreak(25);
    page.drawText(nf, { x: 60, y, size: 9, font: fontRegular, color: rgb(0.2, 0.25, 0.33) });
    y -= 16;
  });

  y -= 10;

  // 2.3 List of AI tools used
  checkPageBreak(40);
  page.drawText('2.3. List of AI tools used for building UI:', { x: 50, y, size: 12, font: fontBold, color: rgb(0.15, 0.38, 0.92) });
  y -= 16;
  page.drawText('1. Antigravity AI (Google DeepMind) - Architectural design, Next.js SPA development, Supabase relational data modeling, and PDF build.', { x: 60, y, size: 9, font: fontRegular, color: rgb(0.2, 0.25, 0.33) });
  y -= 25;

  // 2.4 Prompt Table
  checkPageBreak(60);
  page.drawText('2.4. Prompt (if any):', { x: 50, y, size: 12, font: fontBold, color: rgb(0.15, 0.38, 0.92) });
  y -= 16;

  const prompts = [
    { no: '1', tool: 'Antigravity AI', prompt: 'Act as a Principal UI/UX Architect... Build a production-grade Web UI for ShopSphere RDBMS...' },
    { no: '2', tool: 'Antigravity AI', prompt: 'Migrate fully into Next.js with Supabase backend matching attached dark glassmorphism design...' },
    { no: '3', tool: 'Antigravity AI', prompt: 'Convert all product prices, total revenues, subtotal, and order breakdown figures into Indian Rupees (INR).' }
  ];

  prompts.forEach((p) => {
    checkPageBreak(20);
    page.drawText(`${p.no}. Tool: ${p.tool} | Prompt: ${p.prompt}`, { x: 60, y, size: 8.5, font: fontRegular, color: rgb(0.2, 0.25, 0.33) });
    y -= 15;
  });

  y -= 10;

  // 2.5 List of files
  checkPageBreak(60);
  page.drawText('2.5. List of files:', { x: 50, y, size: 12, font: fontBold, color: rgb(0.15, 0.38, 0.92) });
  y -= 16;

  const files = [
    '• app/layout.tsx (Next.js Root Layout wrapper)',
    '• app/page.tsx (ShopSphere Main SPA Page & State Controller)',
    '• app/globals.css (TailwindCSS Directives & Dark Glassmorphism Tokens)',
    '• components/Sidebar.tsx (Left Vertical Icon Rail Sidebar Component)',
    '• components/Header.tsx (Search Capsule Header & Role Switcher)',
    '• components/CategoryPills.tsx (Horizontal Category Selector Pills)',
    '• components/ProductCard.tsx (Multi-Vendor Product Card Component in INR)',
    '• components/RightDrawer.tsx (Recommended For You Side Drawer Component)',
    '• components/BottomDock.tsx (Floating Capsule Bottom Navigation Dock)',
    '• components/VendorDashboard.tsx (Vendor Sales, Inventory & Fulfillment)',
    '• components/AdminPortal.tsx (Admin Vendor Approval, Category Tree & Triggers)',
    '• components/AtomicCheckoutModal.tsx (Multi-Vendor Cart, Coupon & Atomic Checkout)',
    '• components/AddProductModal.tsx (New Product Creation Form Modal)',
    '• lib/supabase.ts (Supabase Client Layer & INR Relational Seed Data)',
    '• supabase/schema.sql (Supabase Production Relational DDL & Triggers Schema)'
  ];

  files.forEach((file) => {
    checkPageBreak(18);
    page.drawText(file, { x: 60, y, size: 8.5, font: fontRegular, color: rgb(0.2, 0.25, 0.33) });
    y -= 13;
  });

  y -= 10;

  // 2.6 UI Screenshot
  checkPageBreak(40);
  page.drawText('2.6. UI Screenshot:', { x: 50, y, size: 12, font: fontBold, color: rgb(0.15, 0.38, 0.92) });
  y -= 16;
  page.drawText('[ShopSphere Next.js Single Page Application Dark Glassmorphism Interface]', { x: 60, y, size: 9, font: fontBold, color: rgb(0.2, 0.25, 0.33) });
  y -= 14;
  page.drawText('Figure 2.1: Live Application running at http://localhost:3001 featuring Left Icon Rail, Capsule Search, 4-Column Product Grid in INR, and Floating Bottom Dock.', { x: 60, y, size: 8.5, font: fontRegular, color: rgb(0.4, 0.45, 0.55) });
  y -= 25;

  // 2.7 GitHub Link
  checkPageBreak(30);
  page.drawText('2.7. GitHub Link:', { x: 50, y, size: 12, font: fontBold, color: rgb(0.15, 0.38, 0.92) });
  y -= 16;
  page.drawText('GitHub Repository: https://github.com/Sravan-NN/ShopSphere-DBMS', { x: 60, y, size: 9.5, font: fontBold, color: rgb(0.12, 0.3, 0.85) });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('ShopSphere_UI_Design_Document.pdf', pdfBytes);
  console.log('PDF Document Generated Successfully: ShopSphere_UI_Design_Document.pdf');
}

createDocument();
