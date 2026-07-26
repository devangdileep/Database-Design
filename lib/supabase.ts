import { createClient } from '@supabase/supabase-js';

// Supabase Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xyzcompany.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummykey';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Product Interface
export interface Product {
  id: string;
  title: string;
  category: string;
  rating: number;
  reviewsCount: number;
  isTopSeller: boolean;
  vendorName: string;
  vendorLogo?: string;
  price: number;
  originalPrice: number;
  stock: number;
  isLimited?: boolean;
  couponTag?: string;
  altVendor?: string;
  altPrice?: number;
  imageUrl: string;
}

export interface InventoryItem {
  id: string;
  productId: string;
  title: string;
  category: string;
  price: number;
  stock: number;
  threshold: number;
}

export interface Vendor {
  id: string;
  storeName: string;
  email: string;
  licenseId: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  rating: number;
}

export interface Order {
  id: string;
  customerName: string;
  amount: number;
  date: string;
  status: 'Placed' | 'Packed' | 'Shipped' | 'Delivered';
}

export interface Category {
  id: string;
  name: string;
  parentId: string | null;
}

// Helper currency formatter for Indian Rupees (₹)
export const formatRupees = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Initial Seed Data in Indian Rupees (₹)
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prd-1',
    title: 'PixelBook Pro 15',
    category: 'Electronics',
    rating: 4.7,
    reviewsCount: 120,
    isTopSeller: true,
    vendorName: 'TechHub',
    price: 74999,
    originalPrice: 89999,
    stock: 5,
    couponTag: 'COUPON: -10%',
    altVendor: 'gadgetry',
    altPrice: 76500,
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prd-2',
    title: 'Aura Headphones',
    category: 'Electronics',
    rating: 4.5,
    reviewsCount: 88,
    isTopSeller: true,
    vendorName: 'SoundWaves',
    price: 19999,
    originalPrice: 24999,
    stock: 3,
    isLimited: true,
    couponTag: 'COUPON: SAVE20',
    altVendor: 'AudioPro',
    altPrice: 20999,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prd-3',
    title: 'HydroFlask 32oz',
    category: 'Home & Living',
    rating: 4.8,
    reviewsCount: 210,
    isTopSeller: true,
    vendorName: 'GearOut',
    price: 3299,
    originalPrice: 3999,
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prd-4',
    title: 'EcoSmart TV 55"',
    category: 'Electronics',
    rating: 4.6,
    reviewsCount: 155,
    isTopSeller: true,
    vendorName: 'Electronics',
    price: 54999,
    originalPrice: 69999,
    stock: 8,
    couponTag: 'COUPON: TVOFFER50',
    imageUrl: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prd-5',
    title: 'Pro Wireless Earbuds',
    category: 'Electronics',
    rating: 4.9,
    reviewsCount: 310,
    isTopSeller: false,
    vendorName: 'TechHub',
    price: 9999,
    originalPrice: 12999,
    stock: 22,
    couponTag: 'COUPON: EARBUD15',
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prd-6',
    title: 'Organic Cotton Hoodie',
    category: 'Apparel',
    rating: 4.4,
    reviewsCount: 64,
    isTopSeller: true,
    vendorName: 'FashionCraft',
    price: 4999,
    originalPrice: 6499,
    stock: 12,
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prd-7',
    title: 'Cold-Pressed Almond Milk',
    category: 'Groceries',
    rating: 4.9,
    reviewsCount: 42,
    isTopSeller: false,
    vendorName: 'GreenGrocery',
    price: 499,
    originalPrice: 650,
    stock: 45,
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prd-8',
    title: 'Ergonomic Desk Lamp',
    category: 'Home & Living',
    rating: 4.7,
    reviewsCount: 95,
    isTopSeller: true,
    vendorName: 'Urban Living',
    price: 3999,
    originalPrice: 4999,
    stock: 2,
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80',
  }
];

export const INITIAL_VENDORS: Vendor[] = [
  { id: 'v-1', storeName: 'TechHub', email: 'support@techhub.com', licenseId: 'LIC-8890-TX', status: 'Approved', rating: 4.8 },
  { id: 'v-2', storeName: 'SoundWaves', email: 'orders@soundwaves.com', licenseId: 'LIC-4412-CA', status: 'Approved', rating: 4.7 },
  { id: 'v-3', storeName: 'GearOut', email: 'hello@gearout.com', licenseId: 'LIC-9901-WA', status: 'Approved', rating: 4.9 },
  { id: 'v-4', storeName: 'FashionCraft', email: 'contact@fashioncraft.com', licenseId: 'LIC-1120-NY', status: 'Approved', rating: 4.5 },
  { id: 'v-5', storeName: 'Apex Electronics', email: 'sales@apexelectronics.com', licenseId: 'LIC-5541-IL', status: 'Pending', rating: 4.2 },
];

export const INITIAL_ORDERS: Order[] = [
  { id: 'ORD-9801', customerName: 'Sarah J.', amount: 98297, date: '2026-07-26 10:15', status: 'Shipped' },
  { id: 'ORD-9802', customerName: 'Alex M.', amount: 19999, date: '2026-07-26 11:30', status: 'Placed' },
  { id: 'ORD-9803', customerName: 'Sophia C.', amount: 3299, date: '2026-07-26 14:05', status: 'Packed' },
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Electronics', parentId: null },
  { id: 'cat-11', name: 'Laptops & Computers', parentId: 'cat-1' },
  { id: 'cat-12', name: 'Audio & Wearables', parentId: 'cat-1' },
  { id: 'cat-2', name: 'Apparel', parentId: null },
  { id: 'cat-21', name: "Men's Fashion", parentId: 'cat-2' },
  { id: 'cat-22', name: "Women's Fashion", parentId: 'cat-2' },
  { id: 'cat-3', name: 'Groceries', parentId: null },
  { id: 'cat-4', name: 'Home & Living', parentId: null },
  { id: 'cat-5', name: 'Beauty', parentId: null },
  { id: 'cat-6', name: 'Offers', parentId: null },
];
