/* ============================================================
   FighTea — App Data & State  (data.js)  v5
   New: sizes optional per item, varieties, promos, logo
   ============================================================ */
'use strict';

const App = {
  currentUser:  null,
  currentView:  'home',
  cart:         [],
  activeFilter: 'All',
  orderCounter: 0,
};

/* ── CATEGORIES ─────────────────────────────────────────── */
let MENU_CATEGORIES = [];

/* ── GLOBAL SIZES (admin-editable, applied per item optionally) */
let GLOBAL_SIZES = [];
let SIZE_ID_SEQ  = 1;

/* ── ICE OPTIONS (fixed) ─────────────────────────────────── */
const ICE_OPTIONS = [
  { id:'normal', label:'Normal'   },
  { id:'less',   label:'Less Ice' },
  { id:'no',     label:'No Ice'   },
  { id:'warm',   label:'Warm'     },
];

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
  }
  return item.basePrice;
}

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