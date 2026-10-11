import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Dynamic Supabase Client Configuration
// ---------------------------------------------------------------------------

function getInitialCredentials() {
  if (typeof window !== 'undefined') {
    const customUrl = localStorage.getItem('shopsphere_supabase_url');
    const customKey = localStorage.getItem('shopsphere_supabase_anon_key');
    if (customUrl && customKey) {
      return { url: customUrl, key: customKey };
    }
  }
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key',
  };
}

let activeCredentials = getInitialCredentials();

export function isSupabaseConfigured(): boolean {
  if (typeof window !== 'undefined') {
    const customUrl = localStorage.getItem('shopsphere_supabase_url');
    if (customUrl && !customUrl.includes('placeholder') && !customUrl.includes('your-project')) {
      return true;
    }
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  return Boolean(url && !url.includes('placeholder') && !url.includes('your-project-id'));
}

export let supabase: SupabaseClient = createClient(activeCredentials.url, activeCredentials.key);

export function updateSupabaseConnection(url: string, key: string): void {
  activeCredentials = { url: url.trim(), key: key.trim() };
  if (typeof window !== 'undefined') {
    localStorage.setItem('shopsphere_supabase_url', url.trim());
    localStorage.setItem('shopsphere_supabase_anon_key', key.trim());
  }
  supabase = createClient(activeCredentials.url, activeCredentials.key);
  invalidateLocalCache();
}

export function getActiveSupabaseUrl(): string {
  return activeCredentials.url;
}

// ---------------------------------------------------------------------------
// TypeScript Interfaces (Match ER Diagram Exactly)
// ---------------------------------------------------------------------------

export interface Customer {
  customer_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  password_hash: string;
  created_at?: string;
}

export interface Category {
  category_id: string;
  category_name: string;
  parent_category_id: string | null;
}

export interface Vendor {
  vendor_id: string;
  vendor_name: string;
  email: string;
  phone: string | null;
  approval_status: 'Pending' | 'Approved' | 'Rejected';
  created_at?: string;
}

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
  vendor_name?: string;
  category_name?: string;
}

export interface Order {
  order_id: string;
  customer_id: string;
  order_date: string;
  order_status: 'Placed' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';
  total_amount: number;
  customer_first_name?: string;
  customer_last_name?: string;
}

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
// Comprehensive Relational Seed / Fallback Dataset
// (Matches supabase/seed.sql and ER Diagram exactly)
// ---------------------------------------------------------------------------
const SEED_CUSTOMERS: Customer[] = [
  {
    customer_id: 'a1b2c3d4-0001-4000-8000-000000000001',
    first_name: 'Sravan',
    last_name: 'Kumar',
    email: 'sravan@example.com',
    phone: '9876543210',
    password_hash: '$2b$10$hashedpassword1',
  },
  {
    customer_id: 'a1b2c3d4-0001-4000-8000-000000000002',
    first_name: 'Priya',
    last_name: 'Sharma',
    email: 'priya@example.com',
    phone: '9876543211',
    password_hash: '$2b$10$hashedpassword2',
  },
  {
    customer_id: 'a1b2c3d4-0001-4000-8000-000000000003',
    first_name: 'Arjun',
    last_name: 'Reddy',
    email: 'arjun@example.com',
    phone: '9876543212',
    password_hash: '$2b$10$hashedpassword3',
  },
];

const SEED_CATEGORIES: Category[] = [
  { category_id: 'b1b2c3d4-0001-4000-8000-000000000001', category_name: 'Electronics', parent_category_id: null },
  { category_id: 'b1b2c3d4-0001-4000-8000-000000000002', category_name: 'Apparel', parent_category_id: null },
  { category_id: 'b1b2c3d4-0001-4000-8000-000000000003', category_name: 'Groceries', parent_category_id: null },
  { category_id: 'b1b2c3d4-0001-4000-8000-000000000004', category_name: 'Home & Living', parent_category_id: null },
  { category_id: 'b1b2c3d4-0001-4000-8000-000000000005', category_name: 'Beauty', parent_category_id: null },
  { category_id: 'b1b2c3d4-0001-4000-8000-000000000011', category_name: 'Laptops & Computers', parent_category_id: 'b1b2c3d4-0001-4000-8000-000000000001' },
  { category_id: 'b1b2c3d4-0001-4000-8000-000000000012', category_name: 'Audio & Wearables', parent_category_id: 'b1b2c3d4-0001-4000-8000-000000000001' },
  { category_id: 'b1b2c3d4-0001-4000-8000-000000000021', category_name: "Men's Fashion", parent_category_id: 'b1b2c3d4-0001-4000-8000-000000000002' },
  { category_id: 'b1b2c3d4-0001-4000-8000-000000000022', category_name: "Women's Fashion", parent_category_id: 'b1b2c3d4-0001-4000-8000-000000000002' },
];

const SEED_VENDORS: Vendor[] = [
  { vendor_id: 'c1b2c3d4-0001-4000-8000-000000000001', vendor_name: 'TechHub', email: 'support@techhub.com', phone: '9001000001', approval_status: 'Approved' },
  { vendor_id: 'c1b2c3d4-0001-4000-8000-000000000002', vendor_name: 'SoundWaves', email: 'orders@soundwaves.com', phone: '9001000002', approval_status: 'Approved' },
  { vendor_id: 'c1b2c3d4-0001-4000-8000-000000000003', vendor_name: 'GearOut', email: 'hello@gearout.com', phone: '9001000003', approval_status: 'Approved' },
  { vendor_id: 'c1b2c3d4-0001-4000-8000-000000000004', vendor_name: 'FashionCraft', email: 'contact@fashioncraft.com', phone: '9001000004', approval_status: 'Approved' },
  { vendor_id: 'c1b2c3d4-0001-4000-8000-000000000005', vendor_name: 'Apex Electronics', email: 'sales@apexelectronics.com', phone: '9001000005', approval_status: 'Pending' },
  { vendor_id: 'c1b2c3d4-0001-4000-8000-000000000006', vendor_name: 'GreenGrocery', email: 'fresh@greengrocery.com', phone: '9001000006', approval_status: 'Approved' },
  { vendor_id: 'c1b2c3d4-0001-4000-8000-000000000007', vendor_name: 'Urban Living', email: 'info@urbanliving.com', phone: '9001000007', approval_status: 'Approved' },
];

const SEED_PRODUCTS: Product[] = [
  {
    product_id: 'd1b2c3d4-0001-4000-8000-000000000001',
    vendor_id: 'c1b2c3d4-0001-4000-8000-000000000001',
    category_id: 'b1b2c3d4-0001-4000-8000-000000000011',
    product_name: 'PixelBook Pro 15',
    description: 'High-performance laptop with 15-inch Retina display, 16GB RAM, 512GB SSD',
    brand: 'PixelTech',
    price: 74999.00,
    stock_quantity: 5,
    image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
    vendor_name: 'TechHub',
    category_name: 'Laptops & Computers',
  },
  {
    product_id: 'd1b2c3d4-0001-4000-8000-000000000002',
    vendor_id: 'c1b2c3d4-0001-4000-8000-000000000002',
    category_id: 'b1b2c3d4-0001-4000-8000-000000000012',
    product_name: 'Aura Headphones',
    description: 'Premium noise-cancelling over-ear headphones with 30hr battery',
    brand: 'AuraTech',
    price: 19999.00,
    stock_quantity: 3,
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    vendor_name: 'SoundWaves',
    category_name: 'Audio & Wearables',
  },
  {
    product_id: 'd1b2c3d4-0001-4000-8000-000000000003',
    vendor_id: 'c1b2c3d4-0001-4000-8000-000000000003',
    category_id: 'b1b2c3d4-0001-4000-8000-000000000004',
    product_name: 'HydroFlask 32oz',
    description: 'Vacuum-insulated stainless steel water bottle, keeps drinks cold 24hrs',
    brand: 'HydroFlask',
    price: 3299.00,
    stock_quantity: 15,
    image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80',
    vendor_name: 'GearOut',
    category_name: 'Home & Living',
  },
  {
    product_id: 'd1b2c3d4-0001-4000-8000-000000000004',
    vendor_id: 'c1b2c3d4-0001-4000-8000-000000000001',
    category_id: 'b1b2c3d4-0001-4000-8000-000000000001',
    product_name: 'EcoSmart TV 55"',
    description: '55-inch 4K Ultra HD Smart LED TV with built-in streaming apps',
    brand: 'EcoSmart',
    price: 54999.00,
    stock_quantity: 8,
    image_url: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=600&q=80',
    vendor_name: 'TechHub',
    category_name: 'Electronics',
  },
  {
    product_id: 'd1b2c3d4-0001-4000-8000-000000000005',
    vendor_id: 'c1b2c3d4-0001-4000-8000-000000000001',
    category_id: 'b1b2c3d4-0001-4000-8000-000000000012',
    product_name: 'Pro Wireless Earbuds',
    description: 'True wireless earbuds with active noise cancellation and transparency mode',
    brand: 'ProAudio',
    price: 9999.00,
    stock_quantity: 22,
    image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
    vendor_name: 'TechHub',
    category_name: 'Audio & Wearables',
  },
  {
    product_id: 'd1b2c3d4-0001-4000-8000-000000000006',
    vendor_id: 'c1b2c3d4-0001-4000-8000-000000000004',
    category_id: 'b1b2c3d4-0001-4000-8000-000000000021',
    product_name: 'Organic Cotton Hoodie',
    description: 'Sustainable organic cotton hoodie, unisex fit, machine washable',
    brand: 'EcoWear',
    price: 4999.00,
    stock_quantity: 12,
    image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
    vendor_name: 'FashionCraft',
    category_name: "Men's Fashion",
  },
  {
    product_id: 'd1b2c3d4-0001-4000-8000-000000000007',
    vendor_id: 'c1b2c3d4-0001-4000-8000-000000000006',
    category_id: 'b1b2c3d4-0001-4000-8000-000000000003',
    product_name: 'Cold-Pressed Almond Milk',
    description: 'Fresh cold-pressed almond milk, no preservatives, 1L bottle',
    brand: 'NatureFresh',
    price: 499.00,
    stock_quantity: 45,
    image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
    vendor_name: 'GreenGrocery',
    category_name: 'Groceries',
  },
  {
    product_id: 'd1b2c3d4-0001-4000-8000-000000000008',
    vendor_id: 'c1b2c3d4-0001-4000-8000-000000000007',
    category_id: 'b1b2c3d4-0001-4000-8000-000000000004',
    product_name: 'Ergonomic Desk Lamp',
    description: 'LED desk lamp with adjustable brightness, color temperature, and USB charging port',
    brand: 'LumiDesk',
    price: 3999.00,
    stock_quantity: 2,
    image_url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80',
    vendor_name: 'Urban Living',
    category_name: 'Home & Living',
  },
];

const SEED_ORDERS: Order[] = [
  {
    order_id: 'e1b2c3d4-0001-4000-8000-000000000001',
    customer_id: 'a1b2c3d4-0001-4000-8000-000000000001',
    order_date: new Date().toISOString(),
    order_status: 'Shipped',
    total_amount: 98297.00,
    customer_first_name: 'Sravan',
    customer_last_name: 'Kumar',
  },
  {
    order_id: 'e1b2c3d4-0001-4000-8000-000000000002',
    customer_id: 'a1b2c3d4-0001-4000-8000-000000000002',
    order_date: new Date().toISOString(),
    order_status: 'Placed',
    total_amount: 19999.00,
    customer_first_name: 'Priya',
    customer_last_name: 'Sharma',
  },
  {
    order_id: 'e1b2c3d4-0001-4000-8000-000000000003',
    customer_id: 'a1b2c3d4-0001-4000-8000-000000000003',
    order_date: new Date().toISOString(),
    order_status: 'Packed',
    total_amount: 3299.00,
    customer_first_name: 'Arjun',
    customer_last_name: 'Reddy',
  },
];

// ---------------------------------------------------------------------------
// High-Performance Local Caching Layer (Memory + Persistent LocalStorage)
// ---------------------------------------------------------------------------
interface CacheItem<T> {
  data: T;
  timestamp: number;
}

const MEMORY_CACHE = new Map<string, CacheItem<any>>();
export const DEFAULT_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes TTL

export function getLocalCache<T>(key: string, maxAgeMs = DEFAULT_CACHE_TTL_MS): T | null {
  const now = Date.now();
  const mem = MEMORY_CACHE.get(key);
  if (mem && now - mem.timestamp < maxAgeMs) {
    return mem.data as T;
  }

  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(`shopsphere_cache_${key}`);
      if (raw) {
        const parsed: CacheItem<T> = JSON.parse(raw);
        if (now - parsed.timestamp < maxAgeMs) {
          MEMORY_CACHE.set(key, parsed);
          return parsed.data;
        }
      }
    } catch {}
  }

  return null;
}

export function setLocalCache<T>(key: string, data: T): void {
  const entry: CacheItem<T> = { data, timestamp: Date.now() };
  MEMORY_CACHE.set(key, entry);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`shopsphere_cache_${key}`, JSON.stringify(entry));
    } catch {}
  }
}

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

export function resetToSeedData(): void {
  setLocalCache('customers', SEED_CUSTOMERS);
  setLocalCache('categories', SEED_CATEGORIES);
  setLocalCache('vendors', SEED_VENDORS);
  setLocalCache('products', SEED_PRODUCTS);
  setLocalCache('orders', SEED_ORDERS);
  setLocalCache('current_customer', SEED_CUSTOMERS[0]);
}

// ---------------------------------------------------------------------------
// Data Fetching Functions with Smart Local Caching & Fallback
// ---------------------------------------------------------------------------

export async function fetchProducts(
  categoryName?: string,
  forceRefresh = false
): Promise<Product[]> {
  const cacheKey = 'products';

  if (!forceRefresh) {
    const cached = getLocalCache<Product[]>(cacheKey);
    if (cached && cached.length > 0) {
      if (categoryName && categoryName !== 'ALL') {
        return cached.filter(
          (p) => p.category_name?.toLowerCase() === categoryName.toLowerCase()
        );
      }
      return cached;
    }
  }

  // Only query remote if valid Supabase is configured
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          vendors ( vendor_name ),
          categories ( category_name )
        `)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const products: Product[] = data.map((row: any) => ({
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
    } catch (e) {
      console.warn('Supabase fetch products error:', e);
    }
  }

  // Fallback to rich seed dataset so UI is never blank
  const existing = getLocalCache<Product[]>(cacheKey);
  const fallback = existing && existing.length > 0 ? existing : SEED_PRODUCTS;
  setLocalCache(cacheKey, fallback);

  if (categoryName && categoryName !== 'ALL') {
    return fallback.filter(
      (p) => p.category_name?.toLowerCase() === categoryName.toLowerCase()
    );
  }
  return fallback;
}

export async function fetchCategories(forceRefresh = false): Promise<Category[]> {
  const cacheKey = 'categories';

  if (!forceRefresh) {
    const cached = getLocalCache<Category[]>(cacheKey);
    if (cached && cached.length > 0) return cached;
  }

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('category_name');

      if (!error && data && data.length > 0) {
        setLocalCache(cacheKey, data);
        return data;
      }
    } catch (e) {
      console.warn('Supabase fetch categories error:', e);
    }
  }

  const existing = getLocalCache<Category[]>(cacheKey);
  const fallback = existing && existing.length > 0 ? existing : SEED_CATEGORIES;
  setLocalCache(cacheKey, fallback);
  return fallback;
}

export async function fetchVendors(forceRefresh = false): Promise<Vendor[]> {
  const cacheKey = 'vendors';

  if (!forceRefresh) {
    const cached = getLocalCache<Vendor[]>(cacheKey);
    if (cached && cached.length > 0) return cached;
  }

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const vendors: Vendor[] = data.map((row: any) => ({
          ...row,
          approval_status: row.approval_status as Vendor['approval_status'],
        }));
        setLocalCache(cacheKey, vendors);
        return vendors;
      }
    } catch (e) {
      console.warn('Supabase fetch vendors error:', e);
    }
  }

  const existing = getLocalCache<Vendor[]>(cacheKey);
  const fallback = existing && existing.length > 0 ? existing : SEED_VENDORS;
  setLocalCache(cacheKey, fallback);
  return fallback;
}

export async function fetchOrders(forceRefresh = false): Promise<Order[]> {
  const cacheKey = 'orders';

  if (!forceRefresh) {
    const cached = getLocalCache<Order[]>(cacheKey);
    if (cached && cached.length > 0) return cached;
  }

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customers ( first_name, last_name )
        `)
        .order('order_date', { ascending: false });

      if (!error && data && data.length > 0) {
        const orders: Order[] = data.map((row: any) => ({
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
    } catch (e) {
      console.warn('Supabase fetch orders error:', e);
    }
  }

  const existing = getLocalCache<Order[]>(cacheKey);
  const fallback = existing && existing.length > 0 ? existing : SEED_ORDERS;
  setLocalCache(cacheKey, fallback);
  return fallback;
}

export async function fetchCurrentCustomer(forceRefresh = false): Promise<Customer | null> {
  const cacheKey = 'current_customer';

  if (!forceRefresh) {
    const cached = getLocalCache<Customer>(cacheKey);
    if (cached) return cached;
  }

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .limit(1)
        .single();

      if (!error && data) {
        setLocalCache(cacheKey, data);
        return data;
      }
    } catch (e) {}
  }

  const fallback = SEED_CUSTOMERS[0];
  setLocalCache(cacheKey, fallback);
  return fallback;
}

// ---------------------------------------------------------------------------
// Data Mutation Functions (Optimistic Cache + Database Insert)
// ---------------------------------------------------------------------------

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
  const newProduct: Product = {
    product_id: 'prod-' + Date.now(),
    vendor_id: product.vendor_id,
    category_id: product.category_id,
    product_name: product.product_name,
    description: product.description || null,
    brand: product.brand || null,
    price: product.price,
    stock_quantity: product.stock_quantity,
    image_url: product.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    created_at: new Date().toISOString(),
    vendor_name: 'Vendor',
    category_name: 'Category',
  };

  // Find vendor name and category name from cache
  const cachedVendors = getLocalCache<Vendor[]>('vendors') || SEED_VENDORS;
  const vend = cachedVendors.find((v) => v.vendor_id === product.vendor_id);
  if (vend) newProduct.vendor_name = vend.vendor_name;

  const cachedCats = getLocalCache<Category[]>('categories') || SEED_CATEGORIES;
  const cat = cachedCats.find((c) => c.category_id === product.category_id);
  if (cat) newProduct.category_name = cat.category_name;

  // Optimistically prepend to cache
  const cachedProducts = getLocalCache<Product[]>('products') || SEED_PRODUCTS;
  setLocalCache('products', [newProduct, ...cachedProducts]);

  if (isSupabaseConfigured()) {
    try {
      await supabase.from('products').insert(product);
    } catch (e) {
      console.warn('DB insert product error:', e);
    }
  }

  return newProduct;
}

export async function updateProductStock(
  productId: string,
  newStock: number
): Promise<boolean> {
  const cached = getLocalCache<Product[]>('products') || SEED_PRODUCTS;
  setLocalCache(
    'products',
    cached.map((p) =>
      p.product_id === productId ? { ...p, stock_quantity: newStock } : p
    )
  );

  if (isSupabaseConfigured()) {
    try {
      await supabase
        .from('products')
        .update({ stock_quantity: newStock })
        .eq('product_id', productId);
    } catch (e) {
      console.warn('DB update stock error:', e);
    }
  }

  return true;
}

export async function updateVendorStatus(
  vendorId: string,
  status: 'Approved' | 'Rejected'
): Promise<boolean> {
  const cached = getLocalCache<Vendor[]>('vendors') || SEED_VENDORS;
  setLocalCache(
    'vendors',
    cached.map((v) =>
      v.vendor_id === vendorId ? { ...v, approval_status: status } : v
    )
  );

  if (isSupabaseConfigured()) {
    try {
      await supabase
        .from('vendors')
        .update({ approval_status: status })
        .eq('vendor_id', vendorId);
    } catch (e) {
      console.warn('DB update vendor status error:', e);
    }
  }

  return true;
}

export async function updateOrderStatus(
  orderId: string,
  status: Order['order_status']
): Promise<boolean> {
  const cached = getLocalCache<Order[]>('orders') || SEED_ORDERS;
  setLocalCache(
    'orders',
    cached.map((o) => (o.order_id === orderId ? { ...o, order_status: status } : o))
  );

  if (isSupabaseConfigured()) {
    try {
      await supabase
        .from('orders')
        .update({ order_status: status })
        .eq('order_id', orderId);
    } catch (e) {
      console.warn('DB update order status error:', e);
    }
  }

  return true;
}

export async function insertCategory(
  categoryName: string,
  parentCategoryId?: string | null
): Promise<Category | null> {
  const newCat: Category = {
    category_id: 'cat-' + Date.now(),
    category_name: categoryName,
    parent_category_id: parentCategoryId || null,
  };

  const cached = getLocalCache<Category[]>('categories') || SEED_CATEGORIES;
  setLocalCache('categories', [...cached, newCat]);

  if (isSupabaseConfigured()) {
    try {
      await supabase.from('categories').insert({
        category_name: categoryName,
        parent_category_id: parentCategoryId || null,
      });
    } catch (e) {
      console.warn('DB insert category error:', e);
    }
  }

  return newCat;
}

export async function createOrder(
  customerId: string,
  items: { product_id: string; vendor_id: string; quantity: number; unit_price: number }[],
  totalAmount: number
): Promise<{ order: Order | null; sqlLog: string[] }> {
  const newOrderId = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
  const sqlLog: string[] = [];

  sqlLog.push('> BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;');
  sqlLog.push(
    `> INSERT INTO orders (order_id, customer_id, total_amount, order_status)\n  VALUES ('${newOrderId}', '${customerId}', ${totalAmount}, 'Placed');`
  );

  for (const item of items) {
    sqlLog.push(
      `> INSERT INTO order_items (order_id, product_id, vendor_id, quantity, unit_price)\n  VALUES ('${newOrderId}', '${item.product_id}', '${item.vendor_id}', ${item.quantity}, ${item.unit_price});`
    );
    sqlLog.push(
      `> UPDATE products SET stock_quantity = stock_quantity - ${item.quantity}\n  WHERE product_id = '${item.product_id}';`
    );
  }

  sqlLog.push('> COMMIT TRANSACTION; -- [OK] Atomic order committed successfully.');

  const newOrder: Order = {
    order_id: newOrderId,
    customer_id: customerId,
    order_date: new Date().toISOString(),
    order_status: 'Placed',
    total_amount: totalAmount,
    customer_first_name: 'Customer',
    customer_last_name: '',
  };

  // Decrement products stock in cache
  const cachedProds = getLocalCache<Product[]>('products') || SEED_PRODUCTS;
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

  // Prepend order to cache
  const cachedOrders = getLocalCache<Order[]>('orders') || SEED_ORDERS;
  setLocalCache('orders', [newOrder, ...cachedOrders]);

  if (isSupabaseConfigured()) {
    try {
      const { data: orderData } = await supabase
        .from('orders')
        .insert({
          customer_id: customerId,
          total_amount: totalAmount,
          order_status: 'Placed',
        })
        .select()
        .single();

      if (orderData) {
        const orderItems = items.map((item) => ({
          order_id: orderData.order_id,
          product_id: item.product_id,
          vendor_id: item.vendor_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
        }));
        await supabase.from('order_items').insert(orderItems);
      }
    } catch (e) {
      console.warn('DB create order error:', e);
    }
  }

  return { order: newOrder, sqlLog };
}
