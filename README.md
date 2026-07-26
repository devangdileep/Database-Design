# ShopSphere - Relational Database Management System

ShopSphere is a robust Multi-Vendor Online Shopping Platform and Relational Database Management System designed as a comprehensive academic project for the **23CSE202 DATABASE MANAGEMENT SYSTEMS** course. Built for **Group C15** at the Amrita School of Computing, Amritapuri Campus.

## 🚀 Features & Capabilities

- **Customer Storefront:** Browse a multi-vendor product catalog, use autocomplete search, and apply multi-criteria filters (category, price in ₹, rating, vendor name, in-stock status).
- **Vendor Dashboard:** Real-time inventory monitoring, automated low-stock trigger alerts (`stock_quantity <= low_stock_threshold`), and order fulfillment state tracking.
- **Platform Admin Portal:** Dedicated space for approving vendor registrations, managing the category taxonomy hierarchy tree, and viewing real-time database trigger event logs.
- **Atomic Checkout & Cart:** Multi-vendor cart engine, automatic coupon eligibility validation, and ACID-compliant transaction simulation.
- **Premium UI/UX:** Mobile-first, responsive dark glassmorphism aesthetic (`backdrop-filter: blur(20px)`), smooth micro-animations, and fluid layout via CSS Grid/Flexbox.

## 🛠️ Technology Stack

- **Frontend:** Next.js 14, React 18, TailwindCSS, Framer Motion, Lucide Icons
- **Backend / Database:** Supabase, PostgreSQL
- **Language:** TypeScript
- **Design System:** Dark Mode Glassmorphism with electric blue and purple gradients

## 👥 Team Members (Group C15)

1. SRAVAN N N (`AM.SC.U4CSE25251`)
2. HARITH BHUVAN S (`AM.SC.U4CSE25222`)
3. DEVANG DILEEP (`AM.SC.U4CSE25213`)
4. JASIMKHAN J L (`AM.SC.U4CSE25233`)

## ⚙️ Quick Start

To run this project locally on your machine:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Access the application:**
   Open [http://localhost:3000](http://localhost:3000) or [http://localhost:3001](http://localhost:3001) in your browser.

## 📄 Documentation

The **UI Design Document** detailing functional/non-functional requirements, AI tools usage, and project structure is available in the repository as `ShopSphere_UI_Design_Document.pdf`.

## 📜 License
This project was developed for academic purposes at Amrita School of Computing. All rights reserved.
