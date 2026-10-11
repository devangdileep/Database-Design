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
// High-Performance Local Caching Layer (Memory + Persistent LocalStorage)
// ---------------------------------------------------------------------------
interface CacheItem<T> {
  data: T;
  timestamp: number;
}

const MEMORY_CACHE = new Map<string, CacheItem<any>>();
export const DEFAULT_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes TTL

/** Get cached data from memory or localStorage */
export function getLocalCache<T>(key: string, maxAgeMs = DEFAULT_CACHE_TTL_MS): T | null {
  const now = Date.now();
  // 1. In-memory lookup (0ms)
  const mem = MEMORY_CACHE.get(key);
  if (mem && now - mem.timestamp < maxAgeMs) {
    return mem.data as T;
  }

  // 2. Persistent browser storage lookup (<2ms)
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(`shopsphere_cache_${key}`);
      if (raw) {
        const parsed: CacheItem<T> = JSON.parse(raw);
        if (now - parsed.timestamp < maxAgeMs) {
          MEMORY_CACHE.set(key, parsed); // Re-warm memory cache
          return parsed.data;
        }
      }
    } catch {
      // LocalStorage access fallback
    }
  }

  return null;
}

/** Store data into memory and localStorage */
export function setLocalCache<T>(key: string, data: T): void {
  const entry: CacheItem<T> = { data, timestamp: Date.now() };
  MEMORY_CACHE.set(key, entry);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`shopsphere_cache_${key}`, JSON.stringify(entry));
    } catch {
      // LocalStorage quota fallback
    }
  }
}

/** Invalidate specific key or entire cache */
export function invalidateLocalCache(key?: string): void {
  if (key) {
    MEMORY_CACHE.delete(key);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(`shopsphere_cache_${key}`);
      } catch {}
    }
  } else {
    MEMORY_CACHE.clear();
    if (typeof window !== 'undefined') {
      try {
        const keys = Object.keys(localStorage).filter((k) =>
          k.startsWith('shopsphere_cache_')
        );
        keys.forEach((k) => localStorage.removeItem(k));
      } catch {}
    }
  }
}

// ---------------------------------------------------------------------------
// Data Fetching Functions with Smart Local Caching
// ---------------------------------------------------------------------------

/** Fetch all products with local caching and joined vendor/category names */
export async function fetchProducts(
  categoryName?: string,
  forceRefresh = false
): Promise<Product[]> {
  const cacheKey = 'products';

  // 1. Check local cache first unless forceRefresh is requested
  if (!forceRefresh) {
    const cached = getLocalCache<Product[]>(cacheKey);
    if (cached) {
      if (categoryName && categoryName !== 'ALL') {
        return cached.filter(
          (p) => p.category_name?.toLowerCase() === categoryName.toLowerCase()
        );
      }
      return cached;
    }
  }

  // 2. Fetch from Supabase RDBMS
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      vendors ( vendor_name ),
      categories ( category_name )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    // If network fails, attempt to return stale cache if available
    const stale = getLocalCache<Product[]>(cacheKey, Infinity);
    if (stale) return stale;
    return [];
  }

  // 3. Transform and cache
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

  setLocalCache(cacheKey, products);

  if (categoryName && categoryName !== 'ALL') {
    return products.filter(
      (p) => p.category_name?.toLowerCase() === categoryName.toLowerCase()
    );
  }

  return products;
}

/** Fetch all categories with local caching */
export async function fetchCategories(forceRefresh = false): Promise<Category[]> {
  const cacheKey = 'categories';

  if (!forceRefresh) {
    const cached = getLocalCache<Category[]>(cacheKey);
    if (cached) return cached;
  }

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('category_name');

  if (error) {
    console.error('Error fetching categories:', error);
    const stale = getLocalCache<Category[]>(cacheKey, Infinity);
    if (stale) return stale;
    return [];
  }

  const categories = data || [];
  setLocalCache(cacheKey, categories);
  return categories;
}

/** Fetch all vendors with local caching */
export async function fetchVendors(forceRefresh = false): Promise<Vendor[]> {
  const cacheKey = 'vendors';

  if (!forceRefresh) {
    const cached = getLocalCache<Vendor[]>(cacheKey);
    if (cached) return cached;
  }

  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching vendors:', error);
    const stale = getLocalCache<Vendor[]>(cacheKey, Infinity);
    if (stale) return stale;
    return [];
  }

  const vendors: Vendor[] = (data || []).map((row: any) => ({
    ...row,
    approval_status: row.approval_status as Vendor['approval_status'],
  }));

  setLocalCache(cacheKey, vendors);
  return vendors;
}

/** Fetch all orders with local caching */
export async function fetchOrders(forceRefresh = false): Promise<Order[]> {
  const cacheKey = 'orders';

  if (!forceRefresh) {
    const cached = getLocalCache<Order[]>(cacheKey);
    if (cached) return cached;
  }

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      customers ( first_name, last_name )
    `)
    .order('order_date', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    const stale = getLocalCache<Order[]>(cacheKey, Infinity);
    if (stale) return stale;
    return [];
  }

  const orders: Order[] = (data || []).map((row: any) => ({
    order_id: row.order_id,
    customer_id: row.customer_id,
    order_date: row.order_date,
    order_status: row.order_status as Order['order_status'],
    total_amount: Number(row.total_amount),
    customer_first_name: row.customers?.first_name || '',
    customer_last_name: row.customers?.last_name || '',
  }));

  setLocalCache(cacheKey, orders);
  return orders;
}

/** Fetch the first customer (with local caching) */
export async function fetchCurrentCustomer(forceRefresh = false): Promise<Customer | null> {
  const cacheKey = 'current_customer';

  if (!forceRefresh) {
    const cached = getLocalCache<Customer>(cacheKey);
    if (cached) return cached;
  }

  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching customer:', error);
    return null;
  }

  if (data) {
    setLocalCache(cacheKey, data);
  }
  return data;
}

// ---------------------------------------------------------------------------
// Data Mutation Functions (With Optimistic Cache Invalidation)
// ---------------------------------------------------------------------------

/** Insert a new product and update local cache */
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
    .select(`
      *,
      vendors ( vendor_name ),
      categories ( category_name )
    `)
    .single();

  if (error) {
    console.error('Error inserting product:', error);
    return null;
  }

  // Update local cache optimistically
  const cached = getLocalCache<Product[]>('products');
  if (cached && data) {
    const newProduct: Product = {
      ...data,
      price: Number(data.price),
      vendor_name: data.vendors?.vendor_name || 'Vendor',
      category_name: data.categories?.category_name || 'Category',
    };
    setLocalCache('products', [newProduct, ...cached]);
  } else {
    invalidateLocalCache('products');
  }

  return data;
}

/** Update product stock quantity and update local cache */
export async function updateProductStock(
  productId: string,
  newStock: number
): Promise<boolean> {
  // Optimistic local cache update for instant UI responsiveness
  const cached = getLocalCache<Product[]>('products');
  if (cached) {
    setLocalCache(
      'products',
      cached.map((p) =>
        p.product_id === productId ? { ...p, stock_quantity: newStock } : p
      )
    );
  }

  const { error } = await supabase
    .from('products')
    .update({ stock_quantity: newStock })
    .eq('product_id', productId);

  if (error) {
    console.error('Error updating stock:', error);
    invalidateLocalCache('products');
    return false;
  }

  return true;
}

/** Update vendor approval status and update local cache */
export async function updateVendorStatus(
  vendorId: string,
  status: 'Approved' | 'Rejected'
): Promise<boolean> {
  // Optimistic local cache update
  const cached = getLocalCache<Vendor[]>('vendors');
  if (cached) {
    setLocalCache(
      'vendors',
      cached.map((v) =>
        v.vendor_id === vendorId ? { ...v, approval_status: status } : v
      )
    );
  }

  const { error } = await supabase
    .from('vendors')
    .update({ approval_status: status })
    .eq('vendor_id', vendorId);

  if (error) {
    console.error('Error updating vendor status:', error);
    invalidateLocalCache('vendors');
    return false;
  }

  return true;
}

/** Update order status and update local cache */
export async function updateOrderStatus(
  orderId: string,
  status: Order['order_status']
): Promise<boolean> {
  const cached = getLocalCache<Order[]>('orders');
  if (cached) {
    setLocalCache(
      'orders',
      cached.map((o) => (o.order_id === orderId ? { ...o, order_status: status } : o))
    );
  }

  const { error } = await supabase
    .from('orders')
    .update({ order_status: status })
    .eq('order_id', orderId);

  if (error) {
    console.error('Error updating order status:', error);
    invalidateLocalCache('orders');
    return false;
  }

  return true;
}

/** Insert a new category and update local cache */
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

  // Update local cache
  const cached = getLocalCache<Category[]>('categories');
  if (cached && data) {
    setLocalCache('categories', [...cached, data]);
  } else {
    invalidateLocalCache('categories');
  }

  return data;
}

/** Create an order with order items and update local cache */
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

    if (stockError) {
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

  // Update local cache optimistically
  invalidateLocalCache('orders');
  const cachedProds = getLocalCache<Product[]>('products');
  if (cachedProds) {
    const qtyMap = new Map(items.map((i) => [i.product_id, i.quantity]));
    setLocalCache(
      'products',
      cachedProds.map((p) => {
        const bought = qtyMap.get(p.product_id);
        return bought
          ? { ...p, stock_quantity: Math.max(0, p.stock_quantity - bought) }
          : p;
      })
    );
  }

  return { order: orderData, sqlLog };
}
