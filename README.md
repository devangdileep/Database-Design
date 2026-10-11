# ShopSphere - Relational Database Management System

ShopSphere is a robust Multi-Vendor Online Shopping Platform and Relational Database Management System designed as a comprehensive academic project for the **23CSE202 DATABASE MANAGEMENT SYSTEMS** course. Built for **Group C15** at the Amrita School of Computing, Amritapuri Campus.

---

## 🚀 Features & Capabilities

- **Customer Storefront:** Browse a live multi-vendor product catalog, dynamic search, and filter by dynamic category hierarchy loaded directly from PostgreSQL.
- **Vendor Dashboard:** Real-time inventory monitoring, low-stock trigger alerts (`stock_quantity <= 4`), and order fulfillment pipeline updates persisting directly to the database.
- **Platform Admin Portal:** Dedicated space for approving vendor registrations, managing the category taxonomy hierarchy tree with parent-child relationships, viewing calculated database query latency, and live audit logs.
- **Atomic Checkout & Cart:** Multi-vendor cart engine executing atomic ACID transactions that insert order records, batch-insert order items, and decrement product stock quantities in real time.
- **Premium UI/UX:** Mobile-first, responsive dark glassmorphism aesthetic (`backdrop-filter: blur(20px)`), smooth micro-animations, and fluid layout via Tailwind CSS and Framer Motion.

---

## 🛠️ Technology Stack

- **Frontend:** Next.js 14, React 18, Tailwind CSS, Framer Motion, Lucide Icons
- **Backend / Database:** Supabase, PostgreSQL RDBMS
- **Language:** TypeScript
- **Design System:** Dark Mode Glassmorphism with electric blue and purple gradients

---

## 👥 Team Members (Group C15)

1. SRAVAN N N (`AM.SC.U4CSE25251`)
2. HARITH BHUVAN S (`AM.SC.U4CSE25222`)
3. DEVANG DILEEP (`AM.SC.U4CSE25213`)
4. JASIMKHAN J L (`AM.SC.U4CSE25233`)

---

## 📂 Project Documentation

All design and database architecture documents are located in the [`documents/`](./documents) directory:

- **[ER Relationship Diagram](./documents/ER_Relationship_Diagram.png)**: Visual Entity-Relationship model showing all 6 tables, keys, and cardinality.
- **[DBMS Schema Documentation](./documents/DBMS_Schema_Documentation.md)**: In-depth technical breakdown of tables, foreign key constraints, indexes, and ACID transaction mechanics.
- **[DB Design Document (PDF)](./documents/ShopSphere_DB_Design_Document.pdf)**: Formal Database Design Specification document.
- **[UI Design Document (PDF)](./documents/ShopSphere_UI_Design_Document.pdf)**: Formal project specification and UI design system.
- **[UI Design Document (HTML)](./documents/ShopSphere_UI_Design_Document.html)**: Interactive web view of the design document.

---

## 🗄️ Database Setup (Supabase)

1. **Create a Supabase Project** at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase project dashboard:
   - Run [`supabase/schema.sql`](./supabase/schema.sql) to create all 6 tables (`customers`, `vendors`, `categories`, `products`, `orders`, `order_items`), foreign keys, indexes, and Row Level Security policies.
   - Run [`supabase/seed.sql`](./supabase/seed.sql) to populate initial sample data.
3. Obtain your API credentials from **Project Settings > API**:
   - `Project URL`
   - `anon public key`

---

## ⚙️ Local Development

1. **Clone the repository & install dependencies:**
   ```bash
   git clone https://github.com/sravanverse/e-commerce-dbms.git
   cd e-commerce-dbms
   npm install
   ```

2. **Configure environment variables:**
   Create a `.env.local` file based on [`.env.local.example`](./.env.local.example):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deploying to Vercel

ShopSphere is pre-configured and 100% ready for seamless deployment on [Vercel](https://vercel.com):

1. **Import Project into Vercel:**
   - Push your changes to GitHub.
   - In Vercel, click **Add New Project** and select the `e-commerce-dbms` repository.
   - Vercel automatically detects the **Next.js** framework preset.

2. **Configure Environment Variables:**
   Under **Environment Variables** in the Vercel project configuration, add:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon/public key

3. **Deploy:**
   - Click **Deploy**. Vercel will run `npm run build` and publish your live production URL with global CDN acceleration and edge optimizations.

---

## 📜 License
This project was developed for academic purposes at Amrita School of Computing. All rights reserved.
