-- ============================================================================
-- SHOPSPHERE - SEED DATA
-- Run this AFTER schema.sql to populate sample data.
-- ============================================================================

-- 1. CUSTOMERS
INSERT INTO customers (customer_id, first_name, last_name, email, phone, password_hash) VALUES
('a1b2c3d4-0001-4000-8000-000000000001', 'Sravan', 'Kumar', 'sravan@example.com', '9876543210', '$2b$10$hashedpassword1'),
('a1b2c3d4-0001-4000-8000-000000000002', 'Priya', 'Sharma', 'priya@example.com', '9876543211', '$2b$10$hashedpassword2'),
('a1b2c3d4-0001-4000-8000-000000000003', 'Arjun', 'Reddy', 'arjun@example.com', '9876543212', '$2b$10$hashedpassword3');

-- 2. CATEGORIES (Parent categories first, then children)
INSERT INTO categories (category_id, category_name, parent_category_id) VALUES
('b1b2c3d4-0001-4000-8000-000000000001', 'Electronics', NULL),
('b1b2c3d4-0001-4000-8000-000000000002', 'Apparel', NULL),
('b1b2c3d4-0001-4000-8000-000000000003', 'Groceries', NULL),
('b1b2c3d4-0001-4000-8000-000000000004', 'Home & Living', NULL),
('b1b2c3d4-0001-4000-8000-000000000005', 'Beauty', NULL),
-- Sub-categories
('b1b2c3d4-0001-4000-8000-000000000011', 'Laptops & Computers', 'b1b2c3d4-0001-4000-8000-000000000001'),
('b1b2c3d4-0001-4000-8000-000000000012', 'Audio & Wearables', 'b1b2c3d4-0001-4000-8000-000000000001'),
('b1b2c3d4-0001-4000-8000-000000000021', 'Men''s Fashion', 'b1b2c3d4-0001-4000-8000-000000000002'),
('b1b2c3d4-0001-4000-8000-000000000022', 'Women''s Fashion', 'b1b2c3d4-0001-4000-8000-000000000002');

-- 3. VENDORS
INSERT INTO vendors (vendor_id, vendor_name, email, phone, approval_status) VALUES
('c1b2c3d4-0001-4000-8000-000000000001', 'TechHub', 'support@techhub.com', '9001000001', 'Approved'),
('c1b2c3d4-0001-4000-8000-000000000002', 'SoundWaves', 'orders@soundwaves.com', '9001000002', 'Approved'),
('c1b2c3d4-0001-4000-8000-000000000003', 'GearOut', 'hello@gearout.com', '9001000003', 'Approved'),
('c1b2c3d4-0001-4000-8000-000000000004', 'FashionCraft', 'contact@fashioncraft.com', '9001000004', 'Approved'),
('c1b2c3d4-0001-4000-8000-000000000005', 'Apex Electronics', 'sales@apexelectronics.com', '9001000005', 'Pending'),
('c1b2c3d4-0001-4000-8000-000000000006', 'GreenGrocery', 'fresh@greengrocery.com', '9001000006', 'Approved'),
('c1b2c3d4-0001-4000-8000-000000000007', 'Urban Living', 'info@urbanliving.com', '9001000007', 'Approved');

-- 4. PRODUCTS
INSERT INTO products (product_id, vendor_id, category_id, product_name, description, brand, price, stock_quantity, image_url) VALUES
('d1b2c3d4-0001-4000-8000-000000000001', 'c1b2c3d4-0001-4000-8000-000000000001', 'b1b2c3d4-0001-4000-8000-000000000011', 'PixelBook Pro 15', 'High-performance laptop with 15-inch Retina display, 16GB RAM, 512GB SSD', 'PixelTech', 74999.00, 5, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80'),
('d1b2c3d4-0001-4000-8000-000000000002', 'c1b2c3d4-0001-4000-8000-000000000002', 'b1b2c3d4-0001-4000-8000-000000000012', 'Aura Headphones', 'Premium noise-cancelling over-ear headphones with 30hr battery', 'AuraTech', 19999.00, 3, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'),
('d1b2c3d4-0001-4000-8000-000000000003', 'c1b2c3d4-0001-4000-8000-000000000003', 'b1b2c3d4-0001-4000-8000-000000000004', 'HydroFlask 32oz', 'Vacuum-insulated stainless steel water bottle, keeps drinks cold 24hrs', 'HydroFlask', 3299.00, 15, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80'),
('d1b2c3d4-0001-4000-8000-000000000004', 'c1b2c3d4-0001-4000-8000-000000000001', 'b1b2c3d4-0001-4000-8000-000000000001', 'EcoSmart TV 55"', '55-inch 4K Ultra HD Smart LED TV with built-in streaming apps', 'EcoSmart', 54999.00, 8, 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=600&q=80'),
('d1b2c3d4-0001-4000-8000-000000000005', 'c1b2c3d4-0001-4000-8000-000000000001', 'b1b2c3d4-0001-4000-8000-000000000012', 'Pro Wireless Earbuds', 'True wireless earbuds with active noise cancellation and transparency mode', 'ProAudio', 9999.00, 22, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80'),
('d1b2c3d4-0001-4000-8000-000000000006', 'c1b2c3d4-0001-4000-8000-000000000004', 'b1b2c3d4-0001-4000-8000-000000000021', 'Organic Cotton Hoodie', 'Sustainable organic cotton hoodie, unisex fit, machine washable', 'EcoWear', 4999.00, 12, 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80'),
('d1b2c3d4-0001-4000-8000-000000000007', 'c1b2c3d4-0001-4000-8000-000000000006', 'b1b2c3d4-0001-4000-8000-000000000003', 'Cold-Pressed Almond Milk', 'Fresh cold-pressed almond milk, no preservatives, 1L bottle', 'NatureFresh', 499.00, 45, 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80'),
('d1b2c3d4-0001-4000-8000-000000000008', 'c1b2c3d4-0001-4000-8000-000000000007', 'b1b2c3d4-0001-4000-8000-000000000004', 'Ergonomic Desk Lamp', 'LED desk lamp with adjustable brightness, color temperature, and USB charging port', 'LumiDesk', 3999.00, 2, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80');

-- 5. ORDERS
INSERT INTO orders (order_id, customer_id, order_date, order_status, total_amount) VALUES
('e1b2c3d4-0001-4000-8000-000000000001', 'a1b2c3d4-0001-4000-8000-000000000001', '2026-10-10 10:15:00+05:30', 'Shipped', 98297.00),
('e1b2c3d4-0001-4000-8000-000000000002', 'a1b2c3d4-0001-4000-8000-000000000002', '2026-10-10 11:30:00+05:30', 'Placed', 19999.00),
('e1b2c3d4-0001-4000-8000-000000000003', 'a1b2c3d4-0001-4000-8000-000000000003', '2026-10-10 14:05:00+05:30', 'Packed', 3299.00);

-- 6. ORDER_ITEMS
INSERT INTO order_items (order_item_id, order_id, product_id, vendor_id, quantity, unit_price) VALUES
('f1b2c3d4-0001-4000-8000-000000000001', 'e1b2c3d4-0001-4000-8000-000000000001', 'd1b2c3d4-0001-4000-8000-000000000001', 'c1b2c3d4-0001-4000-8000-000000000001', 1, 74999.00),
('f1b2c3d4-0001-4000-8000-000000000002', 'e1b2c3d4-0001-4000-8000-000000000001', 'd1b2c3d4-0001-4000-8000-000000000003', 'c1b2c3d4-0001-4000-8000-000000000003', 1, 3299.00),
('f1b2c3d4-0001-4000-8000-000000000003', 'e1b2c3d4-0001-4000-8000-000000000001', 'd1b2c3d4-0001-4000-8000-000000000002', 'c1b2c3d4-0001-4000-8000-000000000002', 1, 19999.00),
('f1b2c3d4-0001-4000-8000-000000000004', 'e1b2c3d4-0001-4000-8000-000000000002', 'd1b2c3d4-0001-4000-8000-000000000002', 'c1b2c3d4-0001-4000-8000-000000000002', 1, 19999.00),
('f1b2c3d4-0001-4000-8000-000000000005', 'e1b2c3d4-0001-4000-8000-000000000003', 'd1b2c3d4-0001-4000-8000-000000000003', 'c1b2c3d4-0001-4000-8000-000000000003', 1, 3299.00);
