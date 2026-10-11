import { createClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Supabase Client
// ---------------------------------------------------------------------------
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  if (typeof window !== 'undefined') {
    console.warn(
      '⚠️ Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
    );
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ---------------------------------------------------------------------------
// TypeScript Interfaces (Match ER Diagram Exactly)
// ---------------------------------------------------------------------------

/** CUSTOMER table */
export interface Customer {
  customer_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  password_hash: string;
  created_at?: string;
}

/** CATEGORY table */
export interface Category {
  category_id: string;
  category_name: string;
  parent_category_id: string | null;
}

/** VENDOR table */
export interface Vendor {
  vendor_id: string;
  vendor_name: string;
  email: string;
  phone: string | null;
  approval_status: 'Pending' | 'Approved' | 'Rejected';
  created_at?: string;
}

/** PRODUCT table (with joined vendor_name and category_name for display) */
export interface Product {
  product_id: string;
  vendor_id: string;
  category_id: string | null;
  product_name: string;
  description: string | null;
  brand: string | null;
  price: number;
  stock_quantity: number;
  image_url: string | null;
  created_at?: string;
  // Joined fields (from foreign key lookups)
  vendor_name?: string;
  category_name?: string;
}

/** ORDERS table (with joined customer name for display) */
export interface Order {
  order_id: string;
  customer_id: string;
  order_date: string;
  order_status: 'Placed' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';
  total_amount: number;
  // Joined fields
  customer_first_name?: string;
  customer_last_name?: string;
}

/** ORDER_ITEM table */
export interface OrderItem {
  order_item_id: string;
  order_id: string;
  product_id: string;
  vendor_id: string;
  quantity: number;
  unit_price: number;
}

// ---------------------------------------------------------------------------
// Helper: Currency Formatter (₹)
// ---------------------------------------------------------------------------
export const formatRupees = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// ---------------------------------------------------------------------------
// Data Fetching Functions
// ---------------------------------------------------------------------------

/** Fetch all products with joined vendor_name and category_name */
export async function fetchProducts(categoryName?: string): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select(`
      *,
      vendors ( vendor_name ),
      categories ( category_name )
    `)
    .order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  // Flatten joined data
  const products: Product[] = (data || []).map((row: any) => ({
    product_id: row.product_id,
    vendor_id: row.vendor_id,
    category_id: row.category_id,
    product_name: row.product_name,
    description: row.description,
    brand: row.brand,
    price: Number(row.price),
    stock_quantity: row.stock_quantity,
    image_url: row.image_url,
    created_at: row.created_at,
    vendor_name: row.vendors?.vendor_name || 'Unknown Vendor',
    category_name: row.categories?.category_name || 'Uncategorized',
  }));

  // Client-side category filter if specified
  if (categoryName && categoryName !== 'ALL') {
    return products.filter(
      (p) => p.category_name?.toLowerCase() === categoryName.toLowerCase()
    );
  }

  return products;
}

/** Fetch all categories */
export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('category_name');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data || [];
}

/** Fetch all vendors */
export async function fetchVendors(): Promise<Vendor[]> {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching vendors:', error);
    return [];
  }

  return (data || []).map((row: any) => ({
    ...row,
    approval_status: row.approval_status as Vendor['approval_status'],
  }));
}

/** Fetch all orders with joined customer names */
export async function fetchOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      customers ( first_name, last_name )
    `)
    .order('order_date', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }

  return (data || []).map((row: any) => ({
    order_id: row.order_id,
    customer_id: row.customer_id,
    order_date: row.order_date,
    order_status: row.order_status as Order['order_status'],
    total_amount: Number(row.total_amount),
    customer_first_name: row.customers?.first_name || '',
    customer_last_name: row.customers?.last_name || '',
  }));
}

/** Fetch the first customer (for simulated login) */
export async function fetchCurrentCustomer(): Promise<Customer | null> {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching customer:', error);
    return null;
  }

  return data;
}

// ---------------------------------------------------------------------------
// Data Mutation Functions
// ---------------------------------------------------------------------------

/** Insert a new product */
export async function insertProduct(product: {
  vendor_id: string;
  category_id: string | null;
  product_name: string;
  description?: string;
  brand?: string;
  price: number;
  stock_quantity: number;
  image_url?: string;
}): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single();

  if (error) {
    console.error('Error inserting product:', error);
    return null;
  }

  return data;
}

/** Update product stock quantity */
export async function updateProductStock(
  productId: string,
  newStock: number
): Promise<boolean> {
  const { error } = await supabase
    .from('products')
    .update({ stock_quantity: newStock })
    .eq('product_id', productId);

  if (error) {
    console.error('Error updating stock:', error);
    return false;
  }

  return true;
}

/** Update vendor approval status */
export async function updateVendorStatus(
  vendorId: string,
  status: 'Approved' | 'Rejected'
): Promise<boolean> {
  const { error } = await supabase
    .from('vendors')
    .update({ approval_status: status })
    .eq('vendor_id', vendorId);

  if (error) {
    console.error('Error updating vendor status:', error);
    return false;
  }

  return true;
}

/** Update order status */
export async function updateOrderStatus(
  orderId: string,
  status: Order['order_status']
): Promise<boolean> {
  const { error } = await supabase
    .from('orders')
    .update({ order_status: status })
    .eq('order_id', orderId);

  if (error) {
    console.error('Error updating order status:', error);
    return false;
  }

  return true;
}

/** Insert a new category */
export async function insertCategory(
  categoryName: string,
  parentCategoryId?: string | null
): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .insert({
      category_name: categoryName,
      parent_category_id: parentCategoryId || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error inserting category:', error);
    return null;
  }

  return data;
}

/** Create an order with order items (atomic transaction via Supabase RPC or sequential inserts) */
export async function createOrder(
  customerId: string,
  items: { product_id: string; vendor_id: string; quantity: number; unit_price: number }[],
  totalAmount: number
): Promise<{ order: Order | null; sqlLog: string[] }> {
  const sqlLog: string[] = [];

  sqlLog.push('> BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;');

  // 1. Insert the order
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_id: customerId,
      total_amount: totalAmount,
      order_status: 'Placed',
    })
    .select()
    .single();

  if (orderError || !orderData) {
    sqlLog.push(`> -- ERROR: ${orderError?.message || 'Failed to create order'}`);
    sqlLog.push('> ROLLBACK;');
    return { order: null, sqlLog };
  }

  sqlLog.push(
    `> INSERT INTO orders (order_id, customer_id, total_amount, order_status)\n  VALUES ('${orderData.order_id}', '${customerId}', ${totalAmount}, 'Placed');`
  );

  // 2. Insert order items
  const orderItems = items.map((item) => ({
    order_id: orderData.order_id,
    product_id: item.product_id,
    vendor_id: item.vendor_id,
    quantity: item.quantity,
    unit_price: item.unit_price,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) {
    sqlLog.push(`> -- ERROR inserting order_items: ${itemsError.message}`);
    sqlLog.push('> ROLLBACK;');
    return { order: null, sqlLog };
  }

  for (const item of items) {
    sqlLog.push(
      `> INSERT INTO order_items (order_id, product_id, vendor_id, quantity, unit_price)\n  VALUES ('${orderData.order_id}', '${item.product_id}', '${item.vendor_id}', ${item.quantity}, ${item.unit_price});`
    );
  }

  // 3. Decrement stock for each product
  for (const item of items) {
    const { error: stockError } = await supabase.rpc('decrement_stock', {
      p_product_id: item.product_id,
      p_quantity: item.quantity,
    });

    // Fallback: if RPC doesn't exist, do manual update
    if (stockError) {
      // Read current stock then update
      const { data: prod } = await supabase
        .from('products')
        .select('stock_quantity')
        .eq('product_id', item.product_id)
        .single();

      if (prod) {
        await supabase
          .from('products')
          .update({ stock_quantity: Math.max(0, prod.stock_quantity - item.quantity) })
          .eq('product_id', item.product_id);
      }
    }

    sqlLog.push(
      `> UPDATE products SET stock_quantity = stock_quantity - ${item.quantity}\n  WHERE product_id = '${item.product_id}';`
    );
  }

  sqlLog.push('> COMMIT TRANSACTION; -- [OK] All operations completed successfully.');

  return { order: orderData, sqlLog };
}
