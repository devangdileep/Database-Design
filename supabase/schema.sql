-- ============================================================================
-- SHOPSPHERE - SUPABASE RDBMS SCHEMA (Matches ER Diagram Exactly)
-- ============================================================================
-- Tables: CUSTOMER, VENDOR, CATEGORY, PRODUCT, ORDERS, ORDER_ITEM
-- Run this in your Supabase SQL Editor to create all tables.
-- ============================================================================

-- 1. CUSTOMER TABLE
-- Relationship: 1 Customer → M Orders (PLACES)
CREATE TABLE IF NOT EXISTS customers (
    customer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CATEGORY TABLE (Self-Referencing for Parent-Child Hierarchy)
-- Relationship: 1 Category → M Products (CLASSIFIES)
CREATE TABLE IF NOT EXISTS categories (
    category_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_name VARCHAR(255) NOT NULL,
    parent_category_id UUID REFERENCES categories(category_id) ON DELETE SET NULL
);

-- 3. VENDOR TABLE
-- Relationship: 1 Vendor → M Products (LISTS)
CREATE TABLE IF NOT EXISTS vendors (
    vendor_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    approval_status VARCHAR(20) DEFAULT 'Pending'
        CHECK (approval_status IN ('Pending', 'Approved', 'Rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRODUCT TABLE
-- Relationships:
--   M Products → 1 Vendor (LISTS)
--   M Products → 1 Category (CLASSIFIES)
--   1 Product → M Order Items (APPEARS IN)
CREATE TABLE IF NOT EXISTS products (
    product_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendors(vendor_id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(category_id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    brand VARCHAR(100),
    price NUMERIC(10, 2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ORDERS TABLE
-- Relationships:
--   M Orders → 1 Customer (PLACES)
--   1 Order → M Order Items (CONTAINS)
CREATE TABLE IF NOT EXISTS orders (
    order_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(customer_id) ON DELETE RESTRICT,
    order_date TIMESTAMPTZ DEFAULT NOW(),
    order_status VARCHAR(20) DEFAULT 'Placed'
        CHECK (order_status IN ('Placed', 'Packed', 'Shipped', 'Delivered', 'Cancelled')),
    total_amount NUMERIC(10, 2) NOT NULL
);

-- 6. ORDER_ITEM TABLE
-- Relationships:
--   M Order Items → 1 Order (CONTAINS)
--   M Order Items → 1 Product (APPEARS IN)
--   M Order Items → 1 Vendor (FULFILLS)
CREATE TABLE IF NOT EXISTS order_items (
    order_item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(product_id) ON DELETE RESTRICT,
    vendor_id UUID NOT NULL REFERENCES vendors(vendor_id) ON DELETE RESTRICT,
    quantity INT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL
);

-- ============================================================================
-- INDEXES for Performance
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_products_vendor ON products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);

-- ============================================================================
-- ROW LEVEL SECURITY (Supabase requires RLS to be enabled)
-- ============================================================================

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for demo purposes (restrict in production)
CREATE POLICY "Allow all access to customers" ON customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to categories" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to vendors" ON vendors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to orders" ON orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to order_items" ON order_items FOR ALL USING (true) WITH CHECK (true);
