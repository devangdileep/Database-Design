-- ============================================================================
-- SHOPSPHERE - SUPABASE RDBMS PRODUCTION SCHEMA & TRIGGER LOGIC
-- ============================================================================

-- 1. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS customers (
    customer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    shipping_address TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. VENDORS TABLE
CREATE TABLE IF NOT EXISTS vendors (
    vendor_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    license_id VARCHAR(100) UNIQUE NOT NULL,
    approval_status VARCHAR(50) DEFAULT 'Pending' CHECK (approval_status IN ('Pending', 'Approved', 'Rejected')),
    rating NUMERIC(3, 2) DEFAULT 5.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CATEGORIES TABLE (Parent-Child Hierarchy)
CREATE TABLE IF NOT EXISTS categories (
    category_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES categories(category_id) ON DELETE SET NULL,
    category_name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL
);

-- 4. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    product_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID REFERENCES vendors(vendor_id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(category_id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    base_price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    description TEXT,
    img_url TEXT,
    is_top_seller BOOLEAN DEFAULT false,
    coupon_tag VARCHAR(50),
    alt_vendor VARCHAR(100),
    alt_price NUMERIC(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. INVENTORY TABLE
CREATE TABLE IF NOT EXISTS inventory (
    inventory_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID UNIQUE REFERENCES products(product_id) ON DELETE CASCADE,
    stock_quantity INT NOT NULL DEFAULT 0,
    low_stock_threshold INT NOT NULL DEFAULT 5,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
    review_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(customer_id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(product_id) ON DELETE CASCADE,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. COUPONS TABLE
CREATE TABLE IF NOT EXISTS coupons (
    coupon_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_percent INT NOT NULL,
    min_order_val NUMERIC(10, 2) NOT NULL,
    expiry_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT true
);

-- 8. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    order_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(customer_id) ON DELETE RESTRICT,
    total_amount NUMERIC(10, 2) NOT NULL,
    order_status VARCHAR(50) DEFAULT 'Placed' CHECK (order_status IN ('Placed', 'Packed', 'Shipped', 'Delivered', 'Cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
    order_item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(product_id) ON DELETE RESTRICT,
    quantity INT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL
);

-- 10. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS payments (
    payment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID UNIQUE REFERENCES orders(order_id) ON DELETE CASCADE,
    payment_mode VARCHAR(50) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'Completed',
    transaction_time TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. SHIPMENTS TABLE
CREATE TABLE IF NOT EXISTS shipments (
    shipment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID UNIQUE REFERENCES orders(order_id) ON DELETE CASCADE,
    tracking_number VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'Processing',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- AUTOMATIC DBMS TRIGGERS
-- ============================================================================

-- Trigger Function: Low Stock Check
CREATE OR REPLACE FUNCTION check_low_stock_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.stock_quantity <= NEW.low_stock_threshold THEN
        RAISE NOTICE 'LOW STOCK ALERT: Product % has % units remaining.', NEW.product_id, NEW.stock_quantity;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_low_stock_check
AFTER UPDATE ON inventory
FOR EACH ROW
EXECUTE FUNCTION check_low_stock_trigger();
