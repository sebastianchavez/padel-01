/**
 * ui.js
 * Componentes UI: navbar, footer, toasts, modales, iconos, helpers DOM.
 */

const UI = {
  /* =========================================================
     Paths helpers
     ========================================================= */
  isInPages() { return window.location.pathname.includes('/pages/'); },
  prefix() { return this.isInPages() ? '../' : ''; },
  page(name) { return `${this.prefix()}pages/${name}`; },

  /* =========================================================
     Iconos SVG inline (pádel / UI)
     ========================================================= */
  icons: {
    menu: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>',
    close: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>',
    user: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>',
    logout: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>',
    chevronDown: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>',
    padel: '<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M9.5 3A6.5 6.5 0 1 0 9.5 16h.5v3.5a1.5 1.5 0 0 0 3 0V16h.5A6.5 6.5 0 0 0 9.5 3zm-2 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm5-1a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>',
    trophy: '<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v3c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 14.63 21 12.55 21 10V7c0-1.1-.9-2-2-2zM5 10V7h2v3.82C5.84 10.4 5 9.3 5 10zm14 0c0 .7-.84.4-2-.18V7h2v3z"/></svg>',
    check: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>',
    x: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>',
    arrowRight: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>',
    phone: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>',
    mail: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>',
    pin: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
    clock: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    star: '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
    calendar: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>',
    racket: '<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="2"/></svg>',
    academy: '<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>',
    party: '<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M2 22L9 8l9 9-7 5zm14.45-9.45l-2.9-2.9 1.45-1.45 2.9 2.9zM18 4a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/></svg>',
    trainer: '<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/></svg>',
    warning: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>',
    info: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    facebook: '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>',
    instagram: '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.850.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.850.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>',
    tiktok: '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.1z"/></svg>',
    youtube: '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>',
    chevronLeft: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>',
    chevronRight: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>',
    edit: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>',
    trash: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3"/></svg>'
  },

  /* =========================================================
     Generadores de imágenes SVG inline (tema pádel)
     ========================================================= */
  _svgDataUrl(svg) {
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  },

  pistaImage(pista) {
    const idMap = {
      'pista-cristal':     '1530915365347-e35b749a0381',
      'pista-panoramica':  '1554068865-24cecd4e34b8',
      'pista-outdoor-1':   '1622279457486-62dcc4a431d6',
      'pista-outdoor-2':   '1542144582-1ba00456b5e3',
      'pista-indoor-pro':  '1626224583764-f87db24ac4ea',
      'pista-dobles-plus': '1547347298-4074fc3086f0'
    };
    const fallback = [
      '1554068865-24cecd4e34b8',
      '1622279457486-62dcc4a431d6',
      '1530915365347-e35b749a0381',
      '1542144582-1ba00456b5e3'
    ];
    const pistaIndex = (Catalog.pistas() || []).findIndex(p => p.id === pista.id);
    const photoId = idMap[pista.id] || fallback[(pistaIndex >= 0 ? pistaIndex : 0) % fallback.length];
    const w = 800, h = 500, q = 75;
    return `https://images.unsplash.com/photo-${photoId}?w=${w}&h=${h}&fit=crop&auto=format&q=${q}`;
  },

  galeriaImage(item, index = 0) {
    const idMap = {
      'g1':  '1547347298-4074fc3086f0',
      'g2':  '1530915365347-e35b749a0381',
      'g3':  '1626224583764-f87db24ac4ea',
      'g4':  '1554068865-24cecd4e34b8',
      'g5':  '1542652694-40abf526446e',
      'g6':  '1622279457486-62dcc4a431d6',
      'g7':  '1517649763962-0c623066013b',
      'g8':  '1530549387789-4c1017266635',
      'g9':  '1605478371310-a9f1e96b4ff4',
      'g10': '1576678927484-cc907957088c',
      'g11': '1542144582-1ba00456b5e3',
      'g12': '1562088287-bde35a1ea917'
    };
    const fallback = [
      '1547347298-4074fc3086f0',
      '1554068865-24cecd4e34b8',
      '1622279457486-62dcc4a431d6',
      '1605478371310-a9f1e96b4ff4'
    ];
    const photoId = idMap[item.id] || fallback[index % fallback.length];
    const w = 1200, h = 900, q = 75;
    return `https://images.unsplash.com/photo-${photoId}?w=${w}&h=${h}&fit=crop&auto=format&q=${q}`;
  },

  /* =========================================================
     Navbar
     ========================================================= */
  renderNavbar(activeKey = 'home') {
    const user = Session.current();
    const p = this.prefix();

    const links = [
      { key: 'home', label: 'Inicio', href: `${p}index.html` },
      { key: 'servicios', label: 'Servicios', href: `${p}pages/servicios.html` },
      { key: 'clases', label: 'Clases', href: `${p}pages/clases.html` },
      { key: 'precios', label: 'Precios', href: `${p}pages/precios.html` },
      { key: 'galeria', label: 'Galería', href: `${p}pages/galeria.html` },
      { key: 'contacto', label: 'Contacto', href: `${p}pages/contacto.html` }
    ];

    const linksHTML = links.map(l => `
      <a href="${l.href}" class="nav-link ${l.key === activeKey ? 'active' : ''}">
        ${l.label}
      </a>
    `).join('');

    const mobileLinksHTML = links.map(l => `
      <a href="${l.href}" class="block px-3 py-2 rounded-md text-base font-medium ${l.key === activeKey
        ? 'text-white bg-lime-600'
        : 'text-slate-700 hover:bg-slate-100'}">
        ${l.label}
      </a>
    `).join('');

    const userMenu = user ? `
      <div class="relative" id="user-menu-wrapper">
        <button id="user-menu-btn" class="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100">
          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-lime-500 to-green-600 flex items-center justify-center text-white font-bold">
            ${user.name.charAt(0).toUpperCase()}
          </div>
          <span class="hidden md:inline">${user.name.split(' ')[0]}</span>
          ${this.icons.chevronDown}
        </button>
        <div id="user-menu-dropdown" class="hidden absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 z-50">
          <div class="px-4 py-3 border-b border-slate-100">
            <p class="text-sm font-semibold text-slate-900">${user.name}</p>
            <p class="text-xs text-slate-500 truncate">${user.email}</p>
          </div>
          <a href="${p}pages/perfil.html" class="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
            ${this.icons.user}<span>Mi perfil</span>
          </a>
          <a href="${p}pages/reserva.html" class="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
            ${this.icons.padel}<span class="w-5 h-5">${this.icons.padel}</span><span>Nueva reserva</span>
          </a>
          <button id="nav-logout" class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-slate-100">
            ${this.icons.logout}<span>Cerrar sesión</span>
          </button>
        </div>
      </div>
    ` : `
      <a href="${p}pages/login.html" class="hidden md:inline-flex items-center px-4 py-2 text-sm font-medium text-slate-700 hover:text-lime-600">
        Ingresar
      </a>
      <a href="${p}pages/registro.html" class="inline-flex items-center px-4 py-2 text-sm font-semibold text-lime-900 bg-lime-400 hover:bg-lime-500 rounded-md transition-colors">
        Registrarse
      </a>
    `;

    const html = `
      <nav class="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <a href="${p}index.html" class="flex items-center gap-2">
              <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-lime-400 to-green-600 flex items-center justify-center text-white">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9.5 3A6.5 6.5 0 1 0 9.5 16h.5v3.5a1.5 1.5 0 0 0 3 0V16h.5A6.5 6.5 0 0 0 9.5 3z"/></svg>
              </div>
              <span class="text-xl font-black text-slate-900 hidden sm:inline">Padel<span class="text-lime-600">Premium</span></span>
            </a>
            <div class="hidden lg:flex items-center gap-1">${linksHTML}</div>
            <div class="hidden md:flex items-center gap-3">${userMenu}</div>
            <button id="mobileMenuBtn" class="md:hidden text-slate-900 p-2">
              ${this.icons.menu}
            </button>
          </div>
          <div id="mobileMenu" class="md:hidden hidden pb-4 space-y-1">
            ${mobileLinksHTML}
            <div class="pt-3 border-t border-slate-200 mt-3 space-y-2">
              ${user
                ? `<a href="${p}pages/perfil.html" class="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100">Mi perfil</a>
                   <a href="${p}pages/reserva.html" class="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100">Nueva reserva</a>
                   <button id="mobile-logout" class="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50">Cerrar sesión</button>`
                : `<a href="${p}pages/login.html" class="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100">Ingresar</a>
                   <a href="${p}pages/registro.html" class="block btn-primary text-center">Registrarse</a>`}
            </div>
          </div>
        </div>
      </nav>`;

    const container = document.getElementById('appHeader');
    if (container) container.innerHTML = html;

    // Toggle mobile menu
    const menuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
    }

    // User dropdown
    const userBtn = document.getElementById('user-menu-btn');
    const userDropdown = document.getElementById('user-menu-dropdown');
    if (userBtn && userDropdown) {
      userBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('hidden');
      });
      document.addEventListener('click', (e) => {
        if (!document.getElementById('user-menu-wrapper')?.contains(e.target)) {
          userDropdown.classList.add('hidden');
        }
      });
    }

    // Logout
    const setupLogout = (id) => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', () => {
        Session.logout();
        this.toast('Sesión cerrada', 'success');
        setTimeout(() => location.href = `${p}index.html`, 600);
      });
    };
    setupLogout('nav-logout');
    setupLogout('mobile-logout');
  },

  /* =========================================================
     Footer
     ========================================================= */
  renderFooter() {
    const b = Catalog.business();
    const year = new Date().getFullYear();
    const html = `
      <footer class="bg-slate-900 text-slate-300 mt-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div class="md:col-span-2">
              <div class="flex items-center gap-2 mb-4">
                <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-lime-400 to-green-600 flex items-center justify-center text-white">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9.5 3A6.5 6.5 0 1 0 9.5 16h.5v3.5a1.5 1.5 0 0 0 3 0V16h.5A6.5 6.5 0 0 0 9.5 3z"/></svg>
                </div>
                <span class="text-xl font-black text-white">Padel<span class="text-lime-400">Premium</span></span>
              </div>
              <p class="text-slate-400 leading-relaxed max-w-md mb-5">${b.eslogan}. Club de pádel premium con 6 pistas de última generación, escuela para todas las edades y la mejor atención de Lima.</p>
              <div class="flex gap-3">
                <a href="${b.redes.facebook}" target="_blank" rel="noopener" class="w-10 h-10 rounded-full bg-slate-800 hover:bg-lime-500 hover:text-slate-900 flex items-center justify-center transition" aria-label="Facebook">${this.icons.facebook}</a>
                <a href="${b.redes.instagram}" target="_blank" rel="noopener" class="w-10 h-10 rounded-full bg-slate-800 hover:bg-lime-500 hover:text-slate-900 flex items-center justify-center transition" aria-label="Instagram">${this.icons.instagram}</a>
                <a href="${b.redes.tiktok}" target="_blank" rel="noopener" class="w-10 h-10 rounded-full bg-slate-800 hover:bg-lime-500 hover:text-slate-900 flex items-center justify-center transition" aria-label="TikTok">${this.icons.tiktok}</a>
                <a href="${b.redes.youtube}" target="_blank" rel="noopener" class="w-10 h-10 rounded-full bg-slate-800 hover:bg-lime-500 hover:text-slate-900 flex items-center justify-center transition" aria-label="YouTube">${this.icons.youtube}</a>
              </div>
            </div>
            <div>
              <h4 class="text-white font-bold mb-4">Navegación</h4>
              <ul class="space-y-2 text-sm">
                <li><a href="${this.prefix()}index.html" class="text-slate-400 hover:text-lime-400 transition">Inicio</a></li>
                <li><a href="${this.prefix()}pages/servicios.html" class="text-slate-400 hover:text-lime-400 transition">Servicios</a></li>
                <li><a href="${this.prefix()}pages/clases.html" class="text-slate-400 hover:text-lime-400 transition">Clases</a></li>
                <li><a href="${this.prefix()}pages/precios.html" class="text-slate-400 hover:text-lime-400 transition">Precios</a></li>
                <li><a href="${this.prefix()}pages/galeria.html" class="text-slate-400 hover:text-lime-400 transition">Galería</a></li>
                <li><a href="${this.prefix()}pages/contacto.html" class="text-slate-400 hover:text-lime-400 transition">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h4 class="text-white font-bold mb-4">Contacto</h4>
              <ul class="space-y-3 text-sm text-slate-400">
                <li class="flex items-start gap-2">${this.icons.pin}<span>${b.direccion}</span></li>
                <li class="flex items-start gap-2">${this.icons.phone}<span>${b.telefono}</span></li>
                <li class="flex items-start gap-2">${this.icons.mail}<span>${b.email}</span></li>
                <li class="flex items-start gap-2">${this.icons.clock}<span>Lun-Dom: 07:00 - 23:00</span></li>
              </ul>
            </div>
          </div>
          <div class="border-t border-slate-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
            <p class="text-sm text-slate-500">&copy; ${year} ${b.nombre}. Todos los derechos reservados.</p>
            <div class="flex gap-4 text-sm text-slate-500">
              <a href="${this.prefix()}pages/terminos.html" class="hover:text-lime-400 transition">Términos</a>
              <a href="${this.prefix()}pages/privacidad.html" class="hover:text-lime-400 transition">Privacidad</a>
            </div>
          </div>
        </div>
      </footer>`;
    const container = document.getElementById('appFooter');
    if (container) container.innerHTML = html;
  },

  /* =========================================================
     Toast notifications
     ========================================================= */
  ensureToastContainer() {
    let c = document.querySelector('.toast-container');
    if (!c) {
      c = document.createElement('div');
      c.className = 'toast-container';
      document.body.appendChild(c);
    }
    return c;
  },

  toast(message, type = 'success', duration = 3800) {
    const container = this.ensureToastContainer();
    const icons = {
      success: '<svg class="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>',
      error: '<svg class="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>',
      warning: '<svg class="w-5 h-5 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z"/></svg>',
      info: '<svg class="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
    };
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `
      ${icons[type] || icons.info}
      <div class="flex-1 text-sm font-medium text-slate-900">${message}</div>
      <button class="toast-close" aria-label="Cerrar">${this.icons.x}</button>
    `;
    container.appendChild(t);
    const close = () => {
      t.style.opacity = '0';
      t.style.transform = 'translateX(20px)';
      t.style.transition = 'all 0.2s';
      setTimeout(() => t.remove(), 200);
    };
    t.querySelector('.toast-close').addEventListener('click', close);
    setTimeout(close, duration);
  },

  /* =========================================================
     Modal de confirmación
     ========================================================= */
  confirm({ title = '¿Estás seguro?', message = '', confirmText = 'Confirmar', cancelText = 'Cancelar', danger = false }) {
    return new Promise((resolve) => {
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop active';
      backdrop.innerHTML = `
        <div class="modal-content">
          <h3 class="text-xl font-bold text-slate-900 mb-2">${title}</h3>
          <p class="text-slate-600 mb-6 leading-relaxed">${message}</p>
          <div class="flex gap-3 justify-end">
            <button class="btn-outline modal-cancel">${cancelText}</button>
            <button class="${danger ? 'btn-danger' : 'btn-primary'} modal-confirm">${confirmText}</button>
          </div>
        </div>`;
      document.body.appendChild(backdrop);
      const close = (result) => { backdrop.remove(); resolve(result); };
      backdrop.querySelector('.modal-cancel').onclick = () => close(false);
      backdrop.querySelector('.modal-confirm').onclick = () => close(true);
      backdrop.onclick = (e) => { if (e.target === backdrop) close(false); };
    });
  },

  /* =========================================================
     Helpers DOM
     ========================================================= */
  el(tag, attrs = {}, children = '') {
    const e = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'class') e.className = v;
      else if (k === 'html') e.innerHTML = v;
      else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v);
    });
    if (typeof children === 'string') e.innerHTML += children;
    return e;
  },

  badgeEstado(estado) {
    const map = {
      confirmada: '<span class="badge-estado badge-confirmada"><span class="w-2 h-2 rounded-full bg-green-600"></span>Confirmada</span>',
      pendiente: '<span class="badge-estado badge-pendiente"><span class="w-2 h-2 rounded-full bg-yellow-600"></span>Pendiente pago</span>',
      completada: '<span class="badge-estado badge-completada"><span class="w-2 h-2 rounded-full bg-blue-600"></span>Completada</span>',
      cancelada: '<span class="badge-estado badge-cancelada"><span class="w-2 h-2 rounded-full bg-red-600"></span>Cancelada</span>'
    };
    return map[estado] || '';
  },

  /* =========================================================
     Validación
     ========================================================= */
  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },
  isValidPhone(phone) {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 7 && digits.length <= 15;
  },
  isValidDNI(dni) {
    return /^\d{8,12}$/.test(dni.replace(/\D/g, ''));
  },

  /* =========================================================
     Animaciones de scroll
     ========================================================= */
  revealOnScroll() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slide-up');
          entry.target.style.opacity = '1';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('[data-reveal]').forEach(el => {
      el.style.opacity = '0';
      observer.observe(el);
    });
  }
};