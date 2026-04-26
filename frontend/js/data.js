/* ============================================================
<<<<<<< HEAD
   FighTea — Core State & API Layer  (data.js)  v6
   All data comes from the backend API — no dummy/sample data.
   ============================================================ */
'use strict';

/* ── CONFIG ──────────────────────────────────────────────── */
// Set this to your backend URL. Change before deploying.
// Development : 'http://localhost:4000/api'
// Production  : 'https://your-backend.vercel.app/api'
const API_BASE = window.FIGHTEA_API_BASE || 'http://localhost:4000/api';

/* ── APP STATE ───────────────────────────────────────────── */
=======
   FighTea — App Data & State  (data.js)  v5
   New: sizes optional per item, varieties, promos, logo
   ============================================================ */
'use strict';

>>>>>>> fef27f4cc1a0ba80081bbc1801bfdbf01ba6e728
const App = {
  currentUser:  null,
  currentView:  'home',
  cart:         [],
  activeFilter: 'All',
  orderCounter: 0,
};

<<<<<<< HEAD
/* ── LIVE DATA (fetched from API, never hardcoded) ───────── */
let MENU_CATEGORIES = [];
let GLOBAL_SIZES    = [];
let TOPPINGS        = [];
let PROMOS          = [];
let MENU_ITEMS      = [];
let ORDERS          = [];          // admin queue — fetched from API
let SIZE_ID_SEQ     = 1;
let TOPPING_ID_SEQ  = 1;
let PROMO_ID_SEQ    = 1;
let MENU_ID_SEQ     = 1;
let VARIETY_ID_SEQ  = 1;
let USER_ID_SEQ     = 2;

/* ── ICE OPTIONS (fixed, not from DB) ────────────────────── */
=======
/* ── CATEGORIES ─────────────────────────────────────────── */
let MENU_CATEGORIES = [];

/* ── GLOBAL SIZES (admin-editable, applied per item optionally) */
let GLOBAL_SIZES = [];
let SIZE_ID_SEQ  = 1;

/* ── ICE OPTIONS (fixed) ─────────────────────────────────── */
>>>>>>> fef27f4cc1a0ba80081bbc1801bfdbf01ba6e728
const ICE_OPTIONS = [
  { id:'normal', label:'Normal'   },
  { id:'less',   label:'Less Ice' },
  { id:'no',     label:'No Ice'   },
  { id:'warm',   label:'Warm'     },
];

<<<<<<< HEAD
/* ── DEFAULT IMAGE ───────────────────────────────────────── */
const DEFAULT_IMG = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&q=80';

/* ══════════════════════════════════════════════════════════
   API HELPERS
   ════════════════════════════════════════════════════════ */

/** Make an authenticated or unauthenticated API request */
async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('fightea_token');
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(API_BASE + path, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error || `API error ${res.status}`), { status: res.status, data });
  return data;
}

/** Load entire menu (categories, products, sizes, toppings, promos) from API */
async function loadMenuFromAPI() {
  try {
    const [cats, products, sizes, toppings, promos] = await Promise.all([
      apiFetch('/menu/categories'),
      apiFetch('/menu/products'),
      apiFetch('/menu/sizes'),
      apiFetch('/menu/toppings'),
      apiFetch('/menu/promos'),
    ]);

    MENU_CATEGORIES = cats.map(c => c.name);

    // Populate the category ID map used by admin.js for API calls
    if (typeof _catIdMap !== 'undefined') {
      cats.forEach(c => { _catIdMap[c.name] = c.id; });
    }

    MENU_ITEMS = products.map(p => ({
      id:         p.id,
      cat:        p.category,
      name:       p.name,
      desc:       p.description || '',
      image:      p.image_url   || DEFAULT_IMG,
      emoji:      p.emoji       || '🧋',
      basePrice:  parseFloat(p.base_price),
      hasSizes:   !!p.has_sizes,
      varieties:  (p.varieties || []).map(v => ({
        id:    v.id,
        name:  v.name,
        price: parseFloat(v.price),
      })),
      sizes:      [],
      bestseller: !!p.is_bestseller,
      available:  !!p.is_available,
    }));

    GLOBAL_SIZES = sizes.map(s => ({
      id:       s.id,
      label:    s.label,
      priceAdd: parseFloat(s.price_add),
    }));
    SIZE_ID_SEQ = (sizes.length ? Math.max(...sizes.map(s => s.id)) : 0) + 1;

    TOPPINGS = toppings.map(t => ({
      id:    t.id,
      name:  t.name,
      emoji: t.emoji || '•',
      price: parseFloat(t.price),
    }));
    TOPPING_ID_SEQ = (toppings.length ? Math.max(...toppings.map(t => t.id)) : 0) + 1;

    PROMOS = promos.map(p => ({
      id:          p.id,
      name:        p.name,
      badge:       p.badge       || '',
      description: p.description || '',
      isActive:    !!p.is_active,
      items: (p.items || []).map(i => ({
        itemId:     i.product_id,
        varietyId:  i.variety_id  || null,
        sizeId:     i.size_id     || null,
        promoPrice: parseFloat(i.promo_price),
      })),
    }));
    PROMO_ID_SEQ = (promos.length ? Math.max(...promos.map(p => p.id)) : 0) + 1;

  } catch (err) {
    console.warn('loadMenuFromAPI failed:', err.message);
    // Graceful degradation — show empty menu rather than crashing
  }
}

/* ══════════════════════════════════════════════════════════
   SESSION / AUTH HELPERS
   ════════════════════════════════════════════════════════ */
function saveSession(userData) {
  App.currentUser = userData.user || userData;
  if (userData.token) localStorage.setItem('fightea_token', userData.token);
  try {
    localStorage.setItem('fightea_user', JSON.stringify(App.currentUser));
  } catch (_) {}
}

async function loadSession() {
  const token = localStorage.getItem('fightea_token');
  if (!token) return;
  try {
    const user = await apiFetch('/auth/me');
    App.currentUser = user;
    localStorage.setItem('fightea_user', JSON.stringify(user));
  } catch (_) {
    // Token expired or invalid — clear everything
    clearSession();
  }
}

function clearSession() {
  App.currentUser = null;
  localStorage.removeItem('fightea_token');
  localStorage.removeItem('fightea_user');
}

function isLoggedIn()    { return !!App.currentUser; }
function isAdmin()       { return App.currentUser && ['admin','staff'].includes(App.currentUser.role); }
function isStrictAdmin() { return App.currentUser && App.currentUser.role === 'admin'; }

function getAuthToken()  { return localStorage.getItem('fightea_token'); }

/* ── CART UTILS ──────────────────────────────────────────── */
function cartTotal() { return App.cart.reduce((s,i) => s + i.price * i.qty, 0); }
function cartCount() { return App.cart.reduce((s,i) => s + i.qty, 0); }

/* ── MENU UTILS ──────────────────────────────────────────── */
function formatCurrency(n) {
  return '₱' + Number(n).toLocaleString('en-PH', { minimumFractionDigits:0, maximumFractionDigits:2 });
}
function getCurrentTime() {
  return new Date().toLocaleTimeString('en-PH', { hour:'2-digit', minute:'2-digit' });
}
function getCategories() { return ['All', ...MENU_CATEGORIES]; }

function drinkImg(item, cls='', style='') {
  const src = item.image || DEFAULT_IMG;
  const fb  = item.emoji || '🧋';
  return `<img src="${src}" alt="${item.name||''}" class="${cls}" style="${style}"` +
         ` onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" loading="lazy">` +
         `<span style="display:none;align-items:center;justify-content:center;font-size:48px;width:100%;height:100%">${fb}</span>`;
}

function getItemSizes(item) {
  if (!item.hasSizes) return [];
  if (item.sizes && item.sizes.length > 0) return item.sizes;
  return GLOBAL_SIZES.map(s => ({ sizeId: s.id, label: s.label, priceAdd: s.priceAdd }));
}

function getItemDisplayPrice(item) {
  if (item.varieties && item.varieties.length > 0) {
    return Math.min(...item.varieties.map(v => v.price));
=======
/* ── TOPPINGS (admin-editable) ───────────────────────────── */
let TOPPINGS = [];
let TOPPING_ID_SEQ = 1;

/* ── PROMOS (admin-editable) ─────────────────────────────── */
let PROMOS = [];
let PROMO_ID_SEQ = 1;
/*  Promo shape:
    {
      id, name, description, badge,   // e.g. "Buy 1 Take 1", "Weekend Deal", "B1T1"
      isActive,
      items: [
        { itemId, varietyId|null, sizeId|null, promoPrice }
      ]
    }
*/

/* ── MENU ITEMS ──────────────────────────────────────────── */
let MENU_ITEMS = [];
let MENU_ID_SEQ = 1;
/*  Item shape:
    {
      id, cat, name, desc, image, emoji,
      basePrice,          // base price (no size/variety selected)
      hasSizes: bool,     // if false, sizes are not shown
      sizes: [            // item-specific overrides (uses global size labels)
        { sizeId, label, priceAdd }
      ],
      varieties: [        // e.g. [{id, name, price}]  — mutually exclusive with size selection
        { id, name, price }
      ],
      bestseller, available
    }
*/

let VARIETY_ID_SEQ = 1;

/* ── ORDERS ─────────────────────────────────────────────── */
let ORDERS = [];

/* ── USERS ──────────────────────────────────────────────── */
let USERS = [
  { id:1, name:'FighTea Admin', email:'admin@fightea.com', password:'Admin@FighTea2024', role:'admin' },
];
let USER_ID_SEQ = 2;

/* ── DEFAULT IMAGE ──────────────────────────────────────── */
const DEFAULT_IMG = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&q=80';

/* ── UTILS ───────────────────────────────────────────────── */
function formatCurrency(n){ return '₱'+Number(n).toLocaleString('en-PH',{minimumFractionDigits:0,maximumFractionDigits:2}); }
function generateOrderId(){ App.orderCounter++; return 'FT-'+String(App.orderCounter).padStart(4,'0'); }
function getCurrentTime(){ return new Date().toLocaleTimeString('en-PH',{hour:'2-digit',minute:'2-digit'}); }
function getCategories(){ return ['All',...MENU_CATEGORIES]; }

function drinkImg(item, cls='', style=''){
  const src=item.image||DEFAULT_IMG, fb=item.emoji||'🧋';
  return `<img src="${src}" alt="${item.name||''}" class="${cls}" style="${style}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" loading="lazy">`+
         `<span style="display:none;align-items:center;justify-content:center;font-size:48px;width:100%;height:100%">${fb}</span>`;
}

/** Returns the item's effective sizes array (item-specific or falls back to global) */
function getItemSizes(item){
  if(!item.hasSizes) return [];
  if(item.sizes && item.sizes.length>0) return item.sizes;
  return GLOBAL_SIZES.map(s=>({sizeId:s.id, label:s.label, priceAdd:s.priceAdd}));
}

/** Compute base display price for a menu item (lowest option) */
function getItemDisplayPrice(item){
  if(item.varieties && item.varieties.length>0){
    return Math.min(...item.varieties.map(v=>v.price));
>>>>>>> fef27f4cc1a0ba80081bbc1801bfdbf01ba6e728
  }
  return item.basePrice;
}

<<<<<<< HEAD
function getItemPromos(itemId) {
  return PROMOS.filter(p => p.isActive && p.items.some(pi => pi.itemId === itemId));
}

/* ── ORDER ID ────────────────────────────────────────────── */
function generateLocalOrderId() {
  App.orderCounter++;
  return 'FT-' + String(App.orderCounter).padStart(4, '0');
}

/* ── ADMIN ANALYTICS (uses API) ──────────────────────────── */
async function getAnalyticsFromAPI() {
  return apiFetch('/analytics/summary');
}

/* ── ADMIN QUEUE (uses API) ──────────────────────────────── */
async function fetchOrders(status = 'active') {
  const data = await apiFetch(`/orders?status=${status}`);
  // Normalise to the shape the queue UI expects
  return data.map(o => ({
    id:           o.order_number,
    dbId:         o.id,
    customer:     o.customer_name,
    phone:        o.customer_phone || '',
    status:       o.status,
    payment:      o.payment_method,
    paymentStatus:o.payment_status,
    gcashRef:     o.gcash_ref || null,
    total:        parseFloat(o.total),
    time:         new Date(o.created_at).toLocaleTimeString('en-PH',{hour:'2-digit',minute:'2-digit'}),
    notes:        o.notes || '',
    items: (o.items || []).map(i => ({
      name:     i.product_name,
      emoji:    '🧋',
      variety:  null,
      size:     i.size_label || null,
      ice:      i.ice_label  || null,
      toppings: i.toppings   || [],
      qty:      i.quantity,
      price:    parseFloat(i.unit_price),
    })),
  }));
}

async function updateOrderStatusAPI(dbId, status) {
  return apiFetch(`/orders/${dbId}/status`, {
    method:  'PATCH',
    body:    JSON.stringify({ status }),
  });
}
=======
/** Get active promos for a given item */
function getItemPromos(itemId){
  return PROMOS.filter(p=>p.isActive && p.items.some(pi=>pi.itemId===itemId));
}

function saveSession(u){ App.currentUser=u; try{localStorage.setItem('fightea_user',JSON.stringify({id:u.id,name:u.name,email:u.email,role:u.role}));}catch(e){} }
function loadSession(){ try{const s=localStorage.getItem('fightea_user');if(s)App.currentUser=JSON.parse(s);}catch(e){} }
function clearSession(){ App.currentUser=null; try{localStorage.removeItem('fightea_user');}catch(e){} }

function isLoggedIn(){    return !!App.currentUser; }
function isAdmin(){       return App.currentUser&&(App.currentUser.role==='admin'||App.currentUser.role==='staff'); }
function isStrictAdmin(){ return App.currentUser&&App.currentUser.role==='admin'; }

function cartTotal(){ return App.cart.reduce((s,i)=>s+i.price*i.qty,0); }
function cartCount(){ return App.cart.reduce((s,i)=>s+i.qty,0); }

function getAnalytics(){
  const today=new Date().toDateString();
  const todayOrds=ORDERS.filter(o=>o.dateStr===today);
  const paidOrds=ORDERS.filter(o=>o.paymentStatus==='paid');
  const totalRevenue=paidOrds.reduce((s,o)=>s+o.total,0);
  const todayRevenue=todayOrds.filter(o=>o.paymentStatus==='paid').reduce((s,o)=>s+o.total,0);
  const pendingRevenue=ORDERS.filter(o=>o.payment==='cash'&&o.paymentStatus==='unpaid').reduce((s,o)=>s+o.total,0);
  const byStatus={};
  ORDERS.forEach(o=>{byStatus[o.status]=(byStatus[o.status]||0)+1;});
  const gcashCount=ORDERS.filter(o=>o.payment==='gcash').length;
  const cashCount=ORDERS.filter(o=>o.payment==='cash').length;
  const itemCounts={};
  ORDERS.forEach(order=>{
    order.items.forEach(item=>{
      const k=item.name;
      if(!itemCounts[k]) itemCounts[k]={name:k,emoji:item.emoji,image:item.image,count:0,revenue:0};
      itemCounts[k].count+=item.qty; itemCounts[k].revenue+=item.price*item.qty;
    });
  });
  return {
    totalRevenue,todayRevenue,pendingRevenue,
    totalOrders:ORDERS.length,todayOrders:todayOrds.length,
    completedOrders:byStatus.completed||0,
    gcashCount,cashCount,
    avgOrder:ORDERS.length?(totalRevenue/ORDERS.length):0,
    topItems:Object.values(itemCounts).sort((a,b)=>b.count-a.count).slice(0,5),
    availableItems:MENU_ITEMS.filter(i=>i.available).length,
    unavailableItems:MENU_ITEMS.filter(i=>!i.available).length,
    totalMenuItems:MENU_ITEMS.length,
    totalToppings:TOPPINGS.length,
    totalCategories:MENU_CATEGORIES.length,
    totalPromos:PROMOS.filter(p=>p.isActive).length,
    byStatus,
  };
}

function getOrderStats(){
  return {
    pending:ORDERS.filter(o=>o.status==='pending').length,
    preparing:ORDERS.filter(o=>o.status==='preparing').length,
    ready:ORDERS.filter(o=>o.status==='ready').length,
    total:ORDERS.filter(o=>o.paymentStatus==='paid').reduce((s,o)=>s+o.total,0),
  };
}
/* ── INITIALIZATION ─────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function(){
  loadSession();
  updateNavState();
  renderMenu();
  renderBestsellers();
  initAuth();
  initAuthTabs();
  initImageUpload();
});

function updateNavState(){
  const navAuthArea = document.getElementById('nav-auth-area');
  const mobileAuthBtns = document.getElementById('mobile-auth-btns');
  
  if(isLoggedIn()){
    navAuthArea.innerHTML = `
      <span style="font-size:13px;color:var(--brown)">${App.currentUser.name.split(' ')[0]}</span>
      <button class="navbar-link" onclick="logout()">Sign Out</button>
      ${isAdmin() ? `<button class="navbar-link" onclick="showView('admin')">Admin</button>` : ''}
    `;
    mobileAuthBtns.innerHTML = `
      <button class="btn btn-outline btn-full" onclick="logout()">Sign Out</button>
      ${isAdmin() ? `<button class="btn btn-primary btn-full" onclick="showView('admin')">Admin Panel</button>` : ''}
    `;
  } else {
    navAuthArea.innerHTML = `
      <button class="navbar-link" onclick="showView('auth')">Sign In</button>
      <button class="btn btn-primary btn-sm" onclick="showView('auth')">Get Started</button>
    `;
    mobileAuthBtns.innerHTML = `
      <button class="btn btn-outline btn-full" onclick="showView('auth')">Sign In</button>
      <button class="btn btn-primary btn-full" onclick="showView('auth')">Get Started</button>
    `;
  }
}

function initAuthTabs(){
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', function(){
      switchAuthTab(this.dataset.tab);
    });
  });
}

function renderMenu(){
  // Load menu from backend or use sample data
  if(MENU_ITEMS.length === 0) {
    MENU_ITEMS = [
      { id:1, cat:'Milk Tea', name:'Brown Sugar Boba', desc:'Classic with chewy tapioca', image:'', emoji:'🧋', basePrice:89, hasSizes:true, varieties:[], bestseller:true, available:true },
      { id:2, cat:'Milk Tea', name:'Taro Milk Tea', desc:'Creamy taro flavor', image:'', emoji:'🧋', basePrice:85, hasSizes:true, varieties:[], bestseller:false, available:true },
    ];
    MENU_CATEGORIES = ['Milk Tea', 'Fruit Tea', 'Smoothies', 'Snacks'];
    GLOBAL_SIZES = [
      { id:1, label:'Small (12oz)', priceAdd:0 },
      { id:2, label:'Medium (16oz)', priceAdd:10 },
      { id:3, label:'Large (22oz)', priceAdd:20 },
    ];
  }
}

function renderBestsellers(){
  const grid = document.getElementById('bestsellers-grid');
  if(!grid) return;
  const bestsellers = MENU_ITEMS.filter(i => i.bestseller && i.available);
  grid.innerHTML = bestsellers.map(item => `
    <div class="menu-card" onclick="openCustomizeModal(${item.id})">
      <div class="menu-card-img">${drinkImg(item)}</div>
      <div class="menu-card-body">
        <h4>${item.name}</h4>
        <p>${item.desc || ''}</p>
        <div class="menu-card-footer">
          <span class="menu-price">${formatCurrency(getItemDisplayPrice(item))}</span>
          <button class="btn btn-primary btn-sm" onclick="event.stopPropagation();openCustomizeModal(${item.id})">Add</button>
        </div>
      </div>
    </div>
  `).join('');
}

function showView(viewId){
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const view = document.getElementById(`view-${viewId}`);
  if(view) {
    view.classList.add('active');
    App.currentView = viewId;
    
    if(viewId === 'admin' && !isAdmin()) {
      showView('home');
      showToast('Admin access required.', 'error');
      return;
    }
    
    if(viewId === 'admin') initAdmin();
    if(viewId === 'menu') renderMenuGrid();
  }
}

function updateCartBadge(){
  document.querySelectorAll('.cart-count').forEach(el => el.textContent = cartCount());
}

function showToast(msg, type='info'){
  const container = document.getElementById('toast-container');
  if(!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = msg;
  toast.style.cssText = `
    padding:12px 16px;margin-bottom:8px;border-radius:4px;
    color:white;font-size:14px;
    background:${type==='success'?'#4caf50':type==='error'?'#f44336':'#2196f3'};
  `;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
>>>>>>> fef27f4cc1a0ba80081bbc1801bfdbf01ba6e728
