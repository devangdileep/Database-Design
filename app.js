/* ==========================================================================
   ShopSphere - RDBMS Single Page Application Logic
   ========================================================================== */

// --- RELATIONAL DATABASE SEED STORE (State Management) ---
const DB = {
  // Customer Table
  customers: [
    { customer_id: "CUST-101", name: "Alex Morgan", email: "alex.m@example.com", shipping_address: "742 Evergreen Terrace, Springfield, OR" },
    { customer_id: "CUST-102", name: "Sophia Chen", email: "sophia.c@tech.io", shipping_address: "100 Market St, San Francisco, CA" },
    { customer_id: "CUST-103", name: "Marcus Vance", email: "marcus.v@web.org", shipping_address: "12 Bleeker St, New York, NY" }
  ],

  // Vendor Table
  vendors: [
    { vendor_id: "VND-10", store_name: "TechHub", approval_status: "Approved", rating: 4.8, contact_email: "support@techhub.com", license_id: "LIC-8890-TX" },
    { vendor_id: "VND-12", store_name: "FashionCraft", approval_status: "Approved", rating: 4.6, contact_email: "orders@fashioncraft.com", license_id: "LIC-4412-CA" },
    { vendor_id: "VND-15", store_name: "GreenGrocery", approval_status: "Approved", rating: 4.9, contact_email: "hello@greengrocery.com", license_id: "LIC-9901-WA" },
    { vendor_id: "VND-20", store_name: "Apex Electronics", approval_status: "Pending", rating: 4.2, contact_email: "sales@apexelectronics.com", license_id: "LIC-1120-NY" },
    { vendor_id: "VND-25", store_name: "Urban Living Co", approval_status: "Pending", rating: 4.0, contact_email: "contact@urbanliving.com", license_id: "LIC-5541-IL" }
  ],

  // Category Table (Parent-Child Hierarchy)
  categories: [
    { category_id: "CAT-1", parent_id: null, category_name: "Electronics" },
    { category_id: "CAT-11", parent_id: "CAT-1", category_name: "Smartphones & Tablets" },
    { category_id: "CAT-12", parent_id: "CAT-1", category_name: "Laptops & Audio" },
    { category_id: "CAT-2", parent_id: null, category_name: "Apparel" },
    { category_id: "CAT-21", parent_id: "CAT-2", category_name: "Men's Wear" },
    { category_id: "CAT-22", parent_id: "CAT-2", category_name: "Women's Wear" },
    { category_id: "CAT-3", parent_id: null, category_name: "Groceries & Fresh" },
    { category_id: "CAT-4", parent_id: null, category_name: "Home Essentials" }
  ],

  // Product Table
  products: [
    { product_id: "PRD-101", vendor_id: "VND-10", category_id: "CAT-12", title: "ProBook X15 Laptop", base_price: 1299.99, description: "Ultra-sleek 15.6-inch laptop with 32GB RAM, 1TB SSD & M3 processor.", img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80" },
    { product_id: "PRD-102", vendor_id: "VND-10", category_id: "CAT-12", title: "SonicPulse ANC Headphones", base_price: 249.50, description: "Active noise canceling wireless over-ear headphones with 40-hour battery life.", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80" },
    { product_id: "PRD-103", vendor_id: "VND-10", category_id: "CAT-11", title: "AuraPad Pro 11", base_price: 799.00, description: "11-inch OLED display tablet with pressure-sensitive stylus support.", img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80" },
    { product_id: "PRD-104", vendor_id: "VND-12", category_id: "CAT-21", title: "Vintage Denim Jacket", base_price: 89.99, description: "Classic 100% organic cotton distressed denim jacket for all seasons.", img: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=600&q=80" },
    { product_id: "PRD-105", vendor_id: "VND-12", category_id: "CAT-22", title: "Silk Evening Gown", base_price: 195.00, description: "Elegant floor-length mulberry silk dress with subtle metallic sheen.", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80" },
    { product_id: "PRD-106", vendor_id: "VND-15", category_id: "CAT-3", title: "Organic Cold-Pressed Olive Oil", base_price: 24.50, description: "500ml extra virgin cold-pressed olive oil imported from Crete.", img: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80" },
    { product_id: "PRD-107", vendor_id: "VND-15", category_id: "CAT-3", title: "Artisanal Raw Honey Jar", base_price: 18.00, description: "100% pure unfiltered wildflower raw honey sourced from local apiaries.", img: "https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=600&q=80" },
    { product_id: "PRD-108", vendor_id: "VND-10", category_id: "CAT-4", title: "Smart Ergonomic Desk Lamp", base_price: 65.00, description: "Dimmable LED lamp with wireless phone charging base and color temp control.", img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80" }
  ],

  // Inventory Table (1-to-1 with Product)
  inventory: [
    { inventory_id: "INV-101", product_id: "PRD-101", stock_quantity: 14, low_stock_threshold: 5 },
    { inventory_id: "INV-102", product_id: "PRD-102", stock_quantity: 3, low_stock_threshold: 5 },
    { inventory_id: "INV-103", product_id: "PRD-103", stock_quantity: 28, low_stock_threshold: 8 },
    { inventory_id: "INV-104", product_id: "PRD-104", stock_quantity: 2, low_stock_threshold: 4 },
    { inventory_id: "INV-105", product_id: "PRD-105", stock_quantity: 11, low_stock_threshold: 3 },
    { inventory_id: "INV-106", product_id: "PRD-106", stock_quantity: 45, low_stock_threshold: 10 },
    { inventory_id: "INV-107", product_id: "PRD-107", stock_quantity: 60, low_stock_threshold: 15 },
    { inventory_id: "INV-108", product_id: "PRD-108", stock_quantity: 1, low_stock_threshold: 3 }
  ],

  // Reviews Table
  reviews: [
    { review_id: "REV-1", customer_id: "CUST-101", product_id: "PRD-101", rating: 5, comment: "Insanely fast build quality. Worth every dollar!" },
    { review_id: "REV-2", customer_id: "CUST-102", product_id: "PRD-101", rating: 4, comment: "Great screen and keyboard, slightly heavy." },
    { review_id: "REV-3", customer_id: "CUST-103", product_id: "PRD-102", rating: 5, comment: "The noise cancellation makes long flights peaceful." },
    { review_id: "REV-4", customer_id: "CUST-101", product_id: "PRD-104", rating: 4, comment: "High quality denim, fits true to size." },
    { review_id: "REV-5", customer_id: "CUST-102", product_id: "PRD-106", rating: 5, comment: "Incredible taste for cooking and salads." }
  ],

  // Coupon Engine Table
  coupons: [
    { coupon_id: "CPN-1", code: "SAVE15", discount_percent: 15, min_order_val: 50.00, expiry_date: "2026-12-31", is_active: true },
    { coupon_id: "CPN-2", code: "SHOPSPHERE10", discount_percent: 10, min_order_val: 20.00, expiry_date: "2026-12-31", is_active: true },
    { coupon_id: "CPN-3", code: "DBMS2026", discount_percent: 20, min_order_val: 100.00, expiry_date: "2026-12-31", is_active: true }
  ],

  // Cart Table (In-Memory for Active Customer session CUST-101)
  cart: [
    { cart_id: "CRT-1", customer_id: "CUST-101", product_id: "PRD-102", quantity: 1 },
    { cart_id: "CRT-2", customer_id: "CUST-101", product_id: "PRD-106", quantity: 2 }
  ],

  // Orders Table
  orders: [
    { order_id: "ORD-9801", customer_id: "CUST-101", total_amount: 274.00, order_status: "Shipped", created_at: "2026-07-25 14:32" },
    { order_id: "ORD-9802", customer_id: "CUST-102", total_amount: 1299.99, order_status: "Placed", created_at: "2026-07-26 09:15" },
    { order_id: "ORD-9803", customer_id: "CUST-103", total_amount: 89.99, order_status: "Packed", created_at: "2026-07-26 11:40" }
  ],

  // Payments Table
  payments: [
    { payment_id: "PAY-4401", order_id: "ORD-9801", payment_mode: "Credit Card", payment_status: "Completed", transaction_time: "2026-07-25 14:33" },
    { payment_id: "PAY-4402", order_id: "ORD-9802", payment_mode: "UPI / NetBanking", payment_status: "Completed", transaction_time: "2026-07-26 09:16" },
    { payment_id: "PAY-4403", order_id: "ORD-9803", payment_mode: "Cash on Delivery", payment_status: "Pending", transaction_time: "2026-07-26 11:40" }
  ],

  // Shipments Table
  shipments: [
    { shipment_id: "SHP-8801", order_id: "ORD-9801", tracking_number: "SP-88392-US", status: "In Transit", updated_at: "2026-07-25 18:00" },
    { shipment_id: "SHP-8802", order_id: "ORD-9802", tracking_number: "SP-88393-US", status: "Processing", updated_at: "2026-07-26 09:30" }
  ],

  // Trigger Event Logs Table (Real-time DB Trigger execution log)
  triggerLogs: [
    { timestamp: "2026-07-26 21:30:12", type: "trigger", message: "inventory_stock_check: Stock for Product #PRD-108 reached 1 unit. Low-stock notification emitted to Vendor #VND-10." },
    { timestamp: "2026-07-26 21:15:00", type: "trigger", message: "order_status_update: Order #ORD-9801 set to 'Shipped'. Tracking #SP-88392-US generated in Shipment table." },
    { timestamp: "2026-07-26 20:45:22", type: "commit", message: "atomic_checkout_commit: Transaction #TXN-9022 committed successfully. 2 items deducted from inventory." }
  ]
};

// --- APP CONTROLLER ---
const App = {
  currentRole: 'customer', // 'customer' | 'vendor' | 'admin' | 'checkout'
  appliedCoupon: null,
  activePaymentMode: 'Credit/Debit Card',

  init() {
    this.bindEvents();
    this.renderAllViews();
    this.startLiveTriggerSimulation();
    console.log("ShopSphere RDBMS Architecture Loaded Successfully.");
  },

  bindEvents() {
    // Role tabs switching
    document.querySelectorAll('.tab-btn, .role-switcher-select').forEach(el => {
      el.addEventListener('change', (e) => this.switchRole(e.target.value));
      el.addEventListener('click', (e) => {
        const role = e.currentTarget.getAttribute('data-role');
        if (role) this.switchRole(role);
      });
    });

    // Global Search & Autocomplete
    const searchInput = document.getElementById('globalSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
      searchInput.addEventListener('blur', () => {
        setTimeout(() => {
          document.getElementById('autocompleteDropdown').classList.remove('active');
        }, 200);
      });
    }

    // Filter controls
    document.querySelectorAll('.filter-control').forEach(ctrl => {
      ctrl.addEventListener('change', () => this.renderStorefrontCatalog());
      ctrl.addEventListener('input', () => this.renderStorefrontCatalog());
    });

    // Rating star filter
    document.querySelectorAll('.rating-option').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.rating-option').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.renderStorefrontCatalog();
      });
    });
  },

  switchRole(role) {
    this.currentRole = role;
    
    // Update active tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-role') === role);
    });

    // Update role select box
    const select = document.getElementById('roleSelectHeader');
    if (select) select.value = role;

    // Show active view
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active');
    });

    const targetView = document.getElementById(`view-${role}`);
    if (targetView) targetView.classList.add('active');

    // Re-render target view for fresh state
    if (role === 'customer') this.renderStorefrontCatalog();
    if (role === 'vendor') this.renderVendorDashboard();
    if (role === 'admin') this.renderAdminPortal();
    if (role === 'checkout') this.renderCheckoutSummary();
  },

  // --- VIEW 1: CUSTOMER CATALOG LOGIC ---
  renderStorefrontCatalog() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    // Fetch Filter values
    const query = (document.getElementById('globalSearchInput')?.value || '').toLowerCase();
    const maxPrice = parseFloat(document.getElementById('priceRangeSlider')?.value || 2000);
    const inStockOnly = document.getElementById('inStockOnlyToggle')?.checked || false;
    
    // Active rating filter
    const activeRatingEl = document.querySelector('.rating-option.active');
    const minRating = activeRatingEl ? parseInt(activeRatingEl.getAttribute('data-stars') || 1) : 1;

    // Selected Categories
    const checkedCats = Array.from(document.querySelectorAll('.cat-checkbox:checked')).map(cb => cb.value);
    const selectedVendor = document.getElementById('vendorFilterSelect')?.value || 'ALL';

    // Filter Products JOIN Inventory JOIN Vendor JOIN Review
    const filtered = DB.products.filter(p => {
      const inv = DB.inventory.find(i => i.product_id === p.product_id);
      const vendor = DB.vendors.find(v => v.vendor_id === p.vendor_id);
      const reviews = DB.reviews.filter(r => r.product_id === p.product_id);
      const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) : 5.0;

      // Text search
      const matchesSearch = p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query);
      // Price range
      const matchesPrice = p.base_price <= maxPrice;
      // In stock
      const matchesStock = !inStockOnly || (inv && inv.stock_quantity > 0);
      // Rating
      const matchesRating = avgRating >= minRating;
      // Category
      const matchesCat = checkedCats.length === 0 || checkedCats.includes(p.category_id);
      // Vendor
      const matchesVendor = selectedVendor === 'ALL' || p.vendor_id === selectedVendor;

      return matchesSearch && matchesPrice && matchesStock && matchesRating && matchesCat && matchesVendor;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
          <i class="fa-solid fa-box-open" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
          <h3>No products match your relational query filters</h3>
          <p>Try clearing filters or adjusting your price slider.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(p => {
      const inv = DB.inventory.find(i => i.product_id === p.product_id);
      const vendor = DB.vendors.find(v => v.vendor_id === p.vendor_id);
      const category = DB.categories.find(c => c.category_id === p.category_id);
      const reviews = DB.reviews.filter(r => r.product_id === p.product_id);
      const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "5.0";

      let stockBadgeClass = "in-stock";
      let stockBadgeText = `In Stock: ${inv ? inv.stock_quantity : 0} units`;
      if (inv && inv.stock_quantity <= inv.low_stock_threshold && inv.stock_quantity > 0) {
        stockBadgeClass = "low-stock";
        stockBadgeText = `Low Stock: ${inv.stock_quantity} units left!`;
      } else if (!inv || inv.stock_quantity === 0) {
        stockBadgeClass = "out-of-stock";
        stockBadgeText = `Out of Stock`;
      }

      return `
        <div class="product-card">
          <div class="product-img-wrapper">
            <img src="${p.img}" alt="${p.title}" loading="lazy">
            <span class="category-tag">${category ? category.category_name : 'General'}</span>
            <span class="coupon-tag"><i class="fa-solid fa-tag"></i> 15% OFF</span>
          </div>
          <div class="product-info">
            <div class="vendor-badge">
              <i class="fa-solid fa-store"></i> ${vendor ? vendor.store_name : 'Verified Vendor'}
            </div>
            <h3 class="product-title">${p.title}</h3>
            <p class="product-desc">${p.description}</p>
            
            <div class="rating-row">
              <span class="stars"><i class="fa-solid fa-star"></i> ${avgRating}</span>
              <span class="review-count">(${reviews.length} reviews)</span>
            </div>

            <div class="price-stock-row">
              <div class="price-tag">$${p.base_price.toFixed(2)}</div>
              <span class="stock-badge ${stockBadgeClass}">${stockBadgeText}</span>
            </div>

            <button class="add-cart-btn" onclick="App.addToCart('${p.product_id}')" ${inv && inv.stock_quantity === 0 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>
              <i class="fa-solid fa-cart-plus"></i> Add to Cart
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Update Cart counter in header
    this.updateCartBadge();
  },

  handleSearch(query) {
    const dropdown = document.getElementById('autocompleteDropdown');
    if (!dropdown) return;

    if (!query.trim()) {
      dropdown.classList.remove('active');
      return;
    }

    const matches = DB.products.filter(p => p.title.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
    if (matches.length === 0) {
      dropdown.classList.remove('active');
      return;
    }

    dropdown.innerHTML = matches.map(p => `
      <div class="autocomplete-item" onclick="App.selectSearchItem('${p.title}')">
        <div>
          <div style="font-weight:600; color:var(--text-main);">${p.title}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">$${p.base_price.toFixed(2)}</div>
        </div>
        <i class="fa-solid fa-arrow-right" style="color:var(--primary-blue);"></i>
      </div>
    `).join('');

    dropdown.classList.add('active');
  },

  selectSearchItem(title) {
    const input = document.getElementById('globalSearchInput');
    if (input) input.value = title;
    document.getElementById('autocompleteDropdown').classList.remove('active');
    this.renderStorefrontCatalog();
  },

  addToCart(productId) {
    const product = DB.products.find(p => p.product_id === productId);
    const inv = DB.inventory.find(i => i.product_id === productId);

    if (!inv || inv.stock_quantity <= 0) {
      this.showToast("Cannot add to cart: Out of Stock!", "danger");
      return;
    }

    const existing = DB.cart.find(c => c.product_id === productId);
    if (existing) {
      if (existing.quantity + 1 > inv.stock_quantity) {
        this.showToast(`Cannot add more than ${inv.stock_quantity} available units!`, "warning");
        return;
      }
      existing.quantity += 1;
    } else {
      DB.cart.push({
        cart_id: `CRT-${Date.now().toString().slice(-4)}`,
        customer_id: 'CUST-101',
        product_id: productId,
        quantity: 1
      });
    }

    this.showToast(`Added "${product.title}" to cart!`, "success");
    this.updateCartBadge();
  },

  updateCartBadge() {
    const count = DB.cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cartBadgeCount');
    if (badge) badge.innerText = count;
  },

  // --- VIEW 2: VENDOR DASHBOARD LOGIC ---
  renderVendorDashboard() {
    // Compute KPIs
    const totalRev = DB.orders.reduce((sum, o) => sum + o.total_amount, 0);
    const totalOrders = DB.orders.length;
    const activeProducts = DB.products.length;
    const lowStockCount = DB.inventory.filter(i => i.stock_quantity <= i.low_stock_threshold).length;

    document.getElementById('kpiTotalRev').innerText = `$${totalRev.toFixed(2)}`;
    document.getElementById('kpiTotalOrders').innerText = totalOrders;
    document.getElementById('kpiActiveProducts').innerText = activeProducts;
    document.getElementById('kpiLowStock').innerText = lowStockCount;

    // Render Inventory Table
    const invTbody = document.getElementById('vendorInventoryTbody');
    if (invTbody) {
      invTbody.innerHTML = DB.inventory.map(inv => {
        const prod = DB.products.find(p => p.product_id === inv.product_id) || {};
        const cat = DB.categories.find(c => c.category_id === prod.category_id) || {};
        const isLow = inv.stock_quantity <= inv.low_stock_threshold;

        return `
          <tr>
            <td><code>${prod.product_id || 'N/A'}</code></td>
            <td style="font-weight:600;">${prod.title || 'Unknown Product'}</td>
            <td><span class="badge badge-purple">${cat.category_name || 'General'}</span></td>
            <td>$${prod.base_price ? prod.base_price.toFixed(2) : '0.00'}</td>
            <td style="font-weight:700;">${inv.stock_quantity}</td>
            <td>${inv.low_stock_threshold}</td>
            <td>
              ${isLow ? `
                <div class="trigger-alert-cell alert-active">
                  <i class="fa-solid fa-triangle-exclamation"></i> TRIGGER ALERT: Low Stock
                </div>
              ` : `
                <div class="trigger-alert-cell alert-ok">
                  <i class="fa-solid fa-circle-check"></i> Stock Optimal
                </div>
              `}
            </td>
            <td>
              <button class="btn-action btn-outline" onclick="App.openEditStockModal('${inv.inventory_id}')">
                <i class="fa-solid fa-pen-to-square"></i> Update Stock
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }

    // Render Orders Fulfillment Queue
    const ordersTbody = document.getElementById('vendorOrdersTbody');
    if (ordersTbody) {
      ordersTbody.innerHTML = DB.orders.map(ord => {
        const cust = DB.customers.find(c => c.customer_id === ord.customer_id) || {};

        return `
          <tr>
            <td><code>${ord.order_id}</code></td>
            <td style="font-weight:600;">${cust.name || 'Customer'}</td>
            <td><span class="badge badge-blue">$${ord.total_amount.toFixed(2)}</span></td>
            <td>${ord.created_at}</td>
            <td>
              <select class="form-control" style="padding:0.3rem 0.5rem; font-size:0.85rem;" onchange="App.updateOrderStatus('${ord.order_id}', this.value)">
                <option value="Placed" ${ord.order_status === 'Placed' ? 'selected' : ''}>Placed</option>
                <option value="Packed" ${ord.order_status === 'Packed' ? 'selected' : ''}>Packed</option>
                <option value="Shipped" ${ord.order_status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                <option value="Delivered" ${ord.order_status === 'Delivered' ? 'selected' : ''}>Delivered</option>
              </select>
            </td>
          </tr>
        `;
      }).join('');
    }
  },

  openEditStockModal(inventoryId) {
    const inv = DB.inventory.find(i => i.inventory_id === inventoryId);
    if (!inv) return;
    const prod = DB.products.find(p => p.product_id === inv.product_id);

    document.getElementById('editInvId').value = inventoryId;
    document.getElementById('editStockTitle').innerText = prod ? prod.title : 'Product';
    document.getElementById('editStockInput').value = inv.stock_quantity;
    document.getElementById('editThresholdInput').value = inv.low_stock_threshold;

    document.getElementById('stockModalOverlay').classList.add('active');
  },

  closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
  },

  saveStockUpdate() {
    const invId = document.getElementById('editInvId').value;
    const newQty = parseInt(document.getElementById('editStockInput').value);
    const newThresh = parseInt(document.getElementById('editThresholdInput').value);

    const inv = DB.inventory.find(i => i.inventory_id === invId);
    if (inv) {
      const oldQty = inv.stock_quantity;
      inv.stock_quantity = newQty;
      inv.low_stock_threshold = newThresh;

      // Simulate Trigger check
      if (newQty <= newThresh) {
        this.addTriggerLog("trigger", `inventory_stock_check: Stock for Product #${inv.product_id} updated to ${newQty} (Threshold: ${newThresh}). Alert sent to Vendor!`);
      }

      this.showToast(`Stock updated from ${oldQty} to ${newQty}`, "success");
      this.closeModal('stockModalOverlay');
      this.renderVendorDashboard();
      this.renderStorefrontCatalog();
    }
  },

  openAddProductModal() {
    document.getElementById('addProductModalOverlay').classList.add('active');
  },

  saveNewProduct(e) {
    e.preventDefault();
    const title = document.getElementById('newProdTitle').value;
    const catId = document.getElementById('newProdCat').value;
    const price = parseFloat(document.getElementById('newProdPrice').value);
    const desc = document.getElementById('newProdDesc').value;
    const stock = parseInt(document.getElementById('newProdStock').value);
    const vendorId = document.getElementById('newProdVendor').value;

    const newProdId = `PRD-${100 + DB.products.length + 1}`;
    const newInvId = `INV-${100 + DB.inventory.length + 1}`;

    const newProd = {
      product_id: newProdId,
      vendor_id: vendorId,
      category_id: catId,
      title: title,
      base_price: price,
      description: desc,
      img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"
    };

    const newInv = {
      inventory_id: newInvId,
      product_id: newProdId,
      stock_quantity: stock,
      low_stock_threshold: 4
    };

    DB.products.push(newProd);
    DB.inventory.push(newInv);

    this.addTriggerLog("commit", `AFTER INSERT TRIGGER on Product (${newProdId}): Inventory row ${newInvId} created automatically.`);
    this.showToast(`Product "${title}" added to inventory!`, "success");
    this.closeModal('addProductModalOverlay');
    this.renderVendorDashboard();
    this.renderStorefrontCatalog();
  },

  updateOrderStatus(orderId, newStatus) {
    const ord = DB.orders.find(o => o.order_id === orderId);
    if (ord) {
      const oldStatus = ord.order_status;
      ord.order_status = newStatus;

      // Trigger log simulation
      this.addTriggerLog("trigger", `order_status_update: Order #${orderId} changed from '${oldStatus}' -> '${newStatus}'.`);
      
      if (newStatus === 'Shipped') {
        const trackingNum = `SP-${Math.floor(10000 + Math.random() * 90000)}-US`;
        DB.shipments.push({
          shipment_id: `SHP-${Date.now().toString().slice(-4)}`,
          order_id: orderId,
          tracking_number: trackingNum,
          status: 'In Transit',
          updated_at: new Date().toISOString().replace('T', ' ').slice(0, 16)
        });
        this.addTriggerLog("trigger", `shipment_auto_create: Tracking #${trackingNum} generated for Order #${orderId}`);
      }

      this.showToast(`Order #${orderId} status set to ${newStatus}`, "info");
      this.renderVendorDashboard();
    }
  },

  // --- VIEW 3: PLATFORM ADMIN PORTAL LOGIC ---
  renderAdminPortal() {
    // KPIs
    const platformGross = DB.orders.reduce((sum, o) => sum + o.total_amount, 0);
    document.getElementById('adminGrossRevenue').innerText = `$${platformGross.toFixed(2)}`;
    document.getElementById('adminActiveVendors').innerText = DB.vendors.filter(v => v.approval_status === 'Approved').length;
    document.getElementById('adminCustomerCount').innerText = DB.customers.length;
    document.getElementById('adminCategoryCount').innerText = DB.categories.length;

    // Render Vendor Approval Table
    const vendorTbody = document.getElementById('adminVendorsTbody');
    if (vendorTbody) {
      vendorTbody.innerHTML = DB.vendors.map(v => {
        let badgeClass = "badge-amber";
        if (v.approval_status === 'Approved') badgeClass = "badge-green";
        if (v.approval_status === 'Rejected') badgeClass = "badge-red";

        return `
          <tr>
            <td><code>${v.vendor_id}</code></td>
            <td style="font-weight:600;">${v.store_name}</td>
            <td>${v.contact_email}</td>
            <td><code>${v.license_id}</code></td>
            <td><span class="badge ${badgeClass}">${v.approval_status}</span></td>
            <td>
              ${v.approval_status !== 'Approved' ? `
                <button class="btn-action btn-success" onclick="App.setVendorStatus('${v.vendor_id}', 'Approved')">
                  <i class="fa-solid fa-check"></i> Approve
                </button>
              ` : ''}
              ${v.approval_status !== 'Rejected' ? `
                <button class="btn-action btn-danger" onclick="App.setVendorStatus('${v.vendor_id}', 'Rejected')">
                  <i class="fa-solid fa-xmark"></i> Reject
                </button>
              ` : ''}
            </td>
          </tr>
        `;
      }).join('');
    }

    // Render Category Tree
    this.renderCategoryTree();

    // Render Trigger Logs
    this.renderTriggerLogs();
  },

  setVendorStatus(vendorId, status) {
    const v = DB.vendors.find(v => v.vendor_id === vendorId);
    if (v) {
      v.approval_status = status;
      this.addTriggerLog("trigger", `vendor_approval_trigger: Vendor #${vendorId} (${v.store_name}) status set to '${status}'.`);
      this.showToast(`Vendor ${v.store_name} marked as ${status}`, status === 'Approved' ? 'success' : 'danger');
      this.renderAdminPortal();
      this.renderStorefrontCatalog();
    }
  },

  renderCategoryTree() {
    const container = document.getElementById('categoryTreeContainer');
    if (!container) return;

    const parents = DB.categories.filter(c => c.parent_id === null);

    container.innerHTML = parents.map(p => {
      const children = DB.categories.filter(c => c.parent_id === p.category_id);

      return `
        <div style="margin-bottom: 0.75rem;">
          <div class="tree-item">
            <span class="tree-item-title">
              <i class="fa-solid fa-folder-open" style="color:var(--primary-blue);"></i> ${p.category_name}
            </span>
            <button class="btn-action btn-outline" onclick="App.promptAddSubCategory('${p.category_id}')">
              <i class="fa-solid fa-plus"></i> Add Sub
            </button>
          </div>
          ${children.length > 0 ? `
            <div class="tree-node">
              ${children.map(c => `
                <div class="tree-item">
                  <span class="tree-item-title">
                    <i class="fa-solid fa-tag" style="color:var(--primary-purple);"></i> ${c.category_name}
                  </span>
                  <span class="badge badge-blue">ID: ${c.category_id}</span>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `;
    }).join('');
  },

  promptAddParentCategory() {
    const name = prompt("Enter New Parent Category Name:");
    if (name && name.trim()) {
      const newId = `CAT-${DB.categories.length + 1}`;
      DB.categories.push({
        category_id: newId,
        parent_id: null,
        category_name: name.trim()
      });
      this.addTriggerLog("commit", `DDL EXECUTE: INSERT INTO Category (category_id, parent_id, category_name) VALUES ('${newId}', NULL, '${name}');`);
      this.showToast(`Added Parent Category "${name}"`, "success");
      this.renderAdminPortal();
    }
  },

  promptAddSubCategory(parentId) {
    const parent = DB.categories.find(c => c.category_id === parentId);
    const name = prompt(`Enter Sub-Category Name under "${parent ? parent.category_name : 'Parent'}":`);
    if (name && name.trim()) {
      const newId = `CAT-${DB.categories.length + 1}`;
      DB.categories.push({
        category_id: newId,
        parent_id: parentId,
        category_name: name.trim()
      });
      this.addTriggerLog("commit", `DDL EXECUTE: INSERT INTO Category (category_id, parent_id, category_name) VALUES ('${newId}', '${parentId}', '${name}');`);
      this.showToast(`Added Sub-Category "${name}"`, "success");
      this.renderAdminPortal();
    }
  },

  renderTriggerLogs() {
    const box = document.getElementById('triggerLogBox');
    if (!box) return;

    box.innerHTML = DB.triggerLogs.map(log => `
      <div class="log-entry">
        <span class="log-timestamp">[${log.timestamp}]</span>
        <span class="log-tag ${log.type}">[${log.type.toUpperCase()}]</span>
        ${log.message}
      </div>
    `).join('');

    box.scrollTop = box.scrollHeight;
  },

  addTriggerLog(type, message) {
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    DB.triggerLogs.push({ timestamp, type, message });
    this.renderTriggerLogs();
  },

  startLiveTriggerSimulation() {
    // Periodically log simulated background DB housekeeping trigger
    setInterval(() => {
      const ms = Math.floor(35 + Math.random() * 15);
      const activeLocks = Math.floor(Math.random() * 2);
      const metricEl = document.getElementById('sysLatencyMetric');
      if (metricEl) {
        metricEl.innerHTML = `<i class="fa-solid fa-microchip"></i> DB Query Latency: <strong>${ms}ms</strong> | Active Locks: <strong>${activeLocks}</strong>`;
      }
    }, 4000);
  },

  // --- VIEW 4: MULTI-VENDOR CART & ATOMIC CHECKOUT LOGIC ---
  renderCheckoutSummary() {
    const cartContainer = document.getElementById('vendorCartContainer');
    if (!cartContainer) return;

    if (DB.cart.length === 0) {
      cartContainer.innerHTML = `
        <div style="text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
          <i class="fa-solid fa-cart-shopping" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.4;"></i>
          <h3>Your Multi-Vendor Cart is Empty</h3>
          <p>Switch back to the Storefront Catalog to add products.</p>
        </div>
      `;
      this.updateCheckoutTotals(0, 0, 0);
      return;
    }

    // Group items by Vendor (Relational JOIN: Cart -> Product -> Vendor)
    const itemsByVendor = {};
    DB.cart.forEach(item => {
      const prod = DB.products.find(p => p.product_id === item.product_id);
      if (!prod) return;
      const vendor = DB.vendors.find(v => v.vendor_id === prod.vendor_id) || { store_name: 'Store' };

      if (!itemsByVendor[vendor.vendor_id]) {
        itemsByVendor[vendor.vendor_id] = {
          vendorName: vendor.store_name,
          items: []
        };
      }
      itemsByVendor[vendor.vendor_id].items.push({ ...item, product: prod });
    });

    // Render Grouped Vendor Cards
    let subtotal = 0;
    cartContainer.innerHTML = Object.keys(itemsByVendor).map(vId => {
      const group = itemsByVendor[vId];

      const itemsHtml = group.items.map(item => {
        const lineTotal = item.product.base_price * item.quantity;
        subtotal += lineTotal;

        return `
          <div class="cart-item-row">
            <div class="cart-item-details">
              <img src="${item.product.img}" alt="${item.product.title}" class="cart-item-img">
              <div>
                <div style="font-weight:600; color:var(--text-main);">${item.product.title}</div>
                <div style="font-size:0.8rem; color:var(--text-muted);">$${item.product.base_price.toFixed(2)} each</div>
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:1.5rem;">
              <div class="qty-control">
                <button class="qty-btn" onclick="App.changeCartQty('${item.cart_id}', -1)">-</button>
                <span class="qty-val">${item.quantity}</span>
                <button class="qty-btn" onclick="App.changeCartQty('${item.cart_id}', 1)">+</button>
              </div>
              <div style="font-weight:700; font-family:var(--font-heading); min-width:70px; text-align:right;">
                $${lineTotal.toFixed(2)}
              </div>
              <button style="color:var(--color-danger); opacity:0.8;" onclick="App.removeCartItem('${item.cart_id}')">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        `;
      }).join('');

      return `
        <div class="vendor-cart-group">
          <div class="vendor-cart-header">
            <i class="fa-solid fa-store"></i> Sold & Fulfilled by: ${group.vendorName}
          </div>
          ${itemsHtml}
        </div>
      `;
    }).join('');

    // Compute Coupon Discount
    let discount = 0;
    if (this.appliedCoupon) {
      if (subtotal >= this.appliedCoupon.min_order_val) {
        discount = subtotal * (this.appliedCoupon.discount_percent / 100);
      } else {
        this.appliedCoupon = null;
        this.showToast(`Coupon removed: Minimum order value $${this.appliedCoupon.min_order_val} not met.`, "warning");
      }
    }

    const shipping = subtotal > 0 ? 15.00 : 0;
    this.updateCheckoutTotals(subtotal, discount, shipping);
  },

  changeCartQty(cartId, delta) {
    const item = DB.cart.find(c => c.cart_id === cartId);
    if (!item) return;

    const inv = DB.inventory.find(i => i.product_id === item.product_id);
    const newQty = item.quantity + delta;

    if (newQty <= 0) {
      this.removeCartItem(cartId);
      return;
    }

    if (inv && newQty > inv.stock_quantity) {
      this.showToast(`Only ${inv.stock_quantity} units available in stock!`, "warning");
      return;
    }

    item.quantity = newQty;
    this.renderCheckoutSummary();
    this.updateCartBadge();
  },

  removeCartItem(cartId) {
    DB.cart = DB.cart.filter(c => c.cart_id !== cartId);
    this.showToast("Item removed from cart", "info");
    this.renderCheckoutSummary();
    this.updateCartBadge();
  },

  applyCouponCode() {
    const input = document.getElementById('couponInput');
    const code = (input ? input.value : '').trim().toUpperCase();

    if (!code) {
      this.showToast("Please enter a coupon code", "warning");
      return;
    }

    const coupon = DB.coupons.find(c => c.code === code && c.is_active);
    if (!coupon) {
      this.showToast("Invalid or expired coupon code!", "danger");
      return;
    }

    const subtotal = DB.cart.reduce((sum, item) => {
      const p = DB.products.find(prod => prod.product_id === item.product_id);
      return sum + (p ? p.base_price * item.quantity : 0);
    }, 0);

    if (subtotal < coupon.min_order_val) {
      this.showToast(`Coupon requires minimum order of $${coupon.min_order_val.toFixed(2)}`, "warning");
      return;
    }

    this.appliedCoupon = coupon;
    this.showToast(`Coupon "${code}" applied! ${coupon.discount_percent}% Discount`, "success");
    this.renderCheckoutSummary();
  },

  selectPaymentMode(mode, element) {
    this.activePaymentMode = mode;
    document.querySelectorAll('.payment-option').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
  },

  updateCheckoutTotals(subtotal, discount, shipping) {
    const total = Math.max(0, subtotal - discount + shipping);

    document.getElementById('summarySubtotal').innerText = `$${subtotal.toFixed(2)}`;
    document.getElementById('summaryDiscount').innerText = `-$${discount.toFixed(2)}`;
    document.getElementById('summaryShipping').innerText = `$${shipping.toFixed(2)}`;
    document.getElementById('summaryTotal').innerText = `$${total.toFixed(2)}`;
  },

  // --- ATOMIC DBMS TRANSACTION EXECUTION ---
  executeAtomicCheckout() {
    if (DB.cart.length === 0) {
      this.showToast("Your cart is empty!", "danger");
      return;
    }

    // Step 1: Open Transaction Modal Terminal
    const modal = document.getElementById('transactionModalOverlay');
    const terminal = document.getElementById('sqlTerminalBox');
    modal.classList.add('active');

    const newOrderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPaymentId = `PAY-${Math.floor(10000 + Math.random() * 90000)}`;

    let subtotal = 0;
    DB.cart.forEach(c => {
      const p = DB.products.find(prod => prod.product_id === c.product_id);
      if (p) subtotal += p.base_price * c.quantity;
    });

    let discount = this.appliedCoupon ? subtotal * (this.appliedCoupon.discount_percent / 100) : 0;
    const grandTotal = subtotal - discount + 15.00;

    terminal.innerHTML = `<div class="sql-line begin">> BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;</div>`;

    // Step 2: Simulated Step-by-Step SQL Execution
    setTimeout(() => {
      terminal.innerHTML += `\n<div class="sql-line insert">> INSERT INTO Order (order_id, customer_id, total_amount, order_status)\n  VALUES ('${newOrderId}', 'CUST-101', ${grandTotal.toFixed(2)}, 'Placed');</div>`;
      terminal.scrollTop = terminal.scrollHeight;
    }, 600);

    setTimeout(() => {
      terminal.innerHTML += `\n<div class="sql-line insert">> INSERT INTO Payment (payment_id, order_id, payment_mode, payment_status)\n  VALUES ('${newPaymentId}', '${newOrderId}', '${this.activePaymentMode}', 'Completed');</div>`;
      terminal.scrollTop = terminal.scrollHeight;
    }, 1200);

    setTimeout(() => {
      DB.cart.forEach(c => {
        const inv = DB.inventory.find(i => i.product_id === c.product_id);
        if (inv) {
          const oldStock = inv.stock_quantity;
          inv.stock_quantity = Math.max(0, inv.stock_quantity - c.quantity);
          terminal.innerHTML += `\n<div class="sql-line update">> UPDATE Inventory SET stock_quantity = ${inv.stock_quantity}\n  WHERE product_id = '${c.product_id}'; -- (Deducted ${c.quantity} units from ${oldStock})</div>`;
        }
      });
      terminal.scrollTop = terminal.scrollHeight;
    }, 1800);

    setTimeout(() => {
      terminal.innerHTML += `\n<div class="sql-line commit">> COMMIT TRANSACTION; -- [OK] All Row Locks Released.</div>`;
      terminal.scrollTop = terminal.scrollHeight;

      // Update Local Database State
      DB.orders.push({
        order_id: newOrderId,
        customer_id: 'CUST-101',
        total_amount: grandTotal,
        order_status: 'Placed',
        created_at: new Date().toISOString().replace('T', ' ').slice(0, 16)
      });

      DB.payments.push({
        payment_id: newPaymentId,
        order_id: newOrderId,
        payment_mode: this.activePaymentMode,
        payment_status: 'Completed',
        transaction_time: new Date().toISOString().replace('T', ' ').slice(0, 16)
      });

      // Clear Cart
      DB.cart = [];
      this.appliedCoupon = null;
      this.updateCartBadge();

      // Trigger Alert Event Logging
      this.addTriggerLog("commit", `ATOMIC TRANSACTION ${newOrderId} COMMITTED. Order inserted, stock updated, payment processed.`);
      this.addTriggerLog("trigger", `AFTER INSERT TRIGGER on Order (${newOrderId}): Sent confirmation email to Customer #CUST-101.`);

      this.showToast(`Order #${newOrderId} successfully placed!`, "success");
    }, 2500);
  },

  // --- TOAST SYSTEM ---
  showToast(message, type = "info") {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    let icon = "fa-circle-info";
    if (type === "success") icon = "fa-circle-check";
    if (type === "warning") icon = "fa-triangle-exclamation";
    if (type === "danger") icon = "fa-circle-xmark";

    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.innerHTML = `
      <i class="fa-solid ${icon}" style="color:${type === 'danger' ? '#ef4444' : type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : '#3b82f6'};"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = '0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
};

// Initialize App on DOM Load
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
