/**
 * app.js
 * Bootstrap y handlers compartidos por todas las páginas.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inicializa seed y sesión
  if (typeof seedDatabase === 'function') seedDatabase();
  if (typeof Session !== 'undefined') Session.current();

  const page = document.body.dataset.page || '';
  const p = UI.prefix();

  // Render navbar + footer en todas las páginas (excepto si el body lo omite)
  UI.renderNavbar(page);
  UI.renderFooter();

  // Handlers globales
  Auth.bindLoginForm();
  Auth.bindRegisterForm();
  Auth.bindRecoverForm();
  Auth.bindProfileForm();
  Auth.bindPasswordForm();

  // Handlers por página
  if (page === 'home') {
    ReservasApp.bindInicioPage();
    UI.revealOnScroll();
  }
  if (page === 'reserva') {
    if (!Session.isLogged()) {
      UI.toast('Inicia sesión para reservar', 'warning');
      setTimeout(() => location.href = `${p}pages/login.html`, 800);
      return;
    }
    ReservasApp.wizard.init();
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    const btnSubmit = document.getElementById('btnSubmit');
    if (btnPrev) btnPrev.onclick = () => ReservasApp.wizard.goToStep(ReservasApp.wizard.state.step - 1);
    if (btnNext) btnNext.onclick = () => ReservasApp.wizard.goToStep(ReservasApp.wizard.state.step + 1);
    if (btnSubmit) btnSubmit.onclick = () => ReservasApp.wizard.submit();
  }
  if (page === 'confirmacion') {
    if (!Session.isLogged()) { location.href = `${p}pages/login.html`; return; }
    ReservasApp.bindConfirmacionPage();
  }
  if (page === 'pago') {
    if (!Session.isLogged()) { location.href = `${p}pages/login.html`; return; }
    PagoApp.bindPagoPage();
  }
  if (page === 'pago-confirmado') {
    if (!Session.isLogged()) { location.href = `${p}pages/login.html`; return; }
    PagoApp.bindPagoConfirmadoPage();
  }
  if (page === 'perfil') {
    if (!Session.isLogged()) { location.href = `${p}pages/login.html`; return; }
    ReservasApp.bindPerfilPage();
  }
  if (page === 'detalle') {
    if (!Session.isLogged()) { location.href = `${p}pages/login.html`; return; }
    ReservasApp.bindDetallePage();
  }
  if (page === 'galeria') {
    GaleriaApp.init();
  }
  if (page === 'clases') {
    ClasesApp.init();
  }
  if (page === 'contacto') {
    ContactoApp.init();
  }

  // Animaciones de scroll en páginas con data-reveal
  UI.revealOnScroll();
});

/* =========================================================
   Galería con lightbox
   ========================================================= */
const GaleriaApp = {
  currentIndex: 0,
  items: [],
  init() {
    const grid = document.getElementById('galeriaGrid');
    if (!grid) return;
    this.items = Catalog.galeria();
    const filterBtns = document.querySelectorAll('[data-galeria-filter]');

    const render = (filter = 'todas') => {
      const filtered = filter === 'todas' ? this.items : this.items.filter(i => i.categoria === filter);
      grid.innerHTML = filtered.map((item, i) => `
        <button type="button" data-galeria-idx="${i}" data-filter="${item.categoria}" class="gallery-item text-left">
          <img src="${UI.galeriaImage(item, i)}" alt="${item.titulo}" loading="lazy" />
          <div class="gallery-overlay">
            <div class="text-white">
              <p class="text-xs uppercase tracking-wider text-lime-300 mb-1">${item.categoria}</p>
              <h4 class="font-bold">${item.titulo}</h4>
            </div>
          </div>
        </button>`).join('');
      grid.querySelectorAll('[data-galeria-idx]').forEach(btn => {
        btn.addEventListener('click', () => this.openLightbox(Number(btn.dataset.galeriaIdx), filtered));
      });
    };

    render('todas');
    filterBtns.forEach(b => b.addEventListener('click', () => {
      filterBtns.forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      render(b.dataset.filter);
    }));
  },

  openLightbox(idx, items) {
    this.items = items;
    this.currentIndex = idx;
    const lb = document.getElementById('lightbox');
    if (!lb) return;
    lb.classList.add('active');
    this.renderLightbox();
    document.addEventListener('keydown', this.handleKeys);
  },

  closeLightbox() {
    document.getElementById('lightbox')?.classList.remove('active');
    document.removeEventListener('keydown', this.handleKeys);
  },

  handleKeys: null,

  renderLightbox() {
    const item = this.items[this.currentIndex];
    const img = document.getElementById('lightboxImg');
    const cap = document.getElementById('lightboxCaption');
    const counter = document.getElementById('lightboxCounter');
    if (img) img.src = UI.galeriaImage(item, this.currentIndex);
    if (cap) cap.textContent = `${item.titulo} · ${item.descripcion}`;
    if (counter) counter.textContent = `${this.currentIndex + 1} / ${this.items.length}`;
  },

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
    this.renderLightbox();
  },

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
    this.renderLightbox();
  }
};

// Setup keyboard nav para lightbox
GaleriaApp.handleKeys = (e) => {
  if (e.key === 'Escape') GaleriaApp.closeLightbox();
  if (e.key === 'ArrowRight') GaleriaApp.next();
  if (e.key === 'ArrowLeft') GaleriaApp.prev();
};

/* =========================================================
   Clases - horario semanal
   ========================================================= */
const ClasesApp = {
  init() {
    this.renderTabla();
    this.renderLista();
    this.renderProfesores();
    const filterBtns = document.querySelectorAll('[data-clase-filter]');
    filterBtns.forEach(b => b.addEventListener('click', () => {
      filterBtns.forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      this.renderLista(b.dataset.claseFilter);
    }));
  },

  renderTabla() {
    const tabla = document.getElementById('clasesTabla');
    if (!tabla) return;
    const dias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const clases = Catalog.clases();

    tabla.innerHTML = `
      <div class="grid grid-cols-7 gap-2">
        ${dias.map(d => `
          <div class="text-center text-xs font-bold text-slate-700 uppercase tracking-wider py-2">${d}</div>
        `).join('')}
        ${dias.map(d => {
          const items = clases.filter(c => c.dias.includes(d));
          if (items.length === 0) return `<div class="schedule-cell empty"></div>`;
          return `<div class="space-y-1">${items.map(c => `
            <div class="schedule-cell">
              <p class="font-bold text-slate-900">${c.nombre}</p>
              <p class="text-xs text-slate-500">${c.hora}</p>
              <span class="inline-block mt-1 px-1.5 py-0.5 text-xs bg-lime-100 text-lime-700 rounded">${c.nivel}</span>
            </div>`).join('')}</div>`;
        }).join('')}
      </div>`;
  },

  renderLista(filter = 'todas') {
    const cont = document.getElementById('clasesLista');
    if (!cont) return;
    const clases = Catalog.clases();
    const filtered = filter === 'todas' ? clases : clases.filter(c => c.nivel === filter);
    cont.innerHTML = filtered.map(c => `
      <div class="bg-white border border-slate-200 rounded-xl p-5 card-hover">
        <div class="flex items-start justify-between mb-2">
          <h4 class="font-bold text-slate-900">${c.nombre}</h4>
          <span class="badge-estado badge-confirmada">${c.nivel}</span>
        </div>
        <p class="text-sm text-slate-600 mb-3">Dictado por <span class="font-semibold">${c.profesor}</span></p>
        <div class="grid grid-cols-2 gap-3 text-sm text-slate-700 mb-3">
          <div><span class="text-slate-500">Días:</span> <span class="font-semibold">${c.dias.join(', ')}</span></div>
          <div><span class="text-slate-500">Hora:</span> <span class="font-semibold">${c.hora}</span></div>
          <div><span class="text-slate-500">Edades:</span> <span class="font-semibold">${c.edades}</span></div>
          <div><span class="text-slate-500">Cupos:</span> <span class="font-semibold">${c.cupos}</span></div>
        </div>
        <div class="flex items-center justify-between pt-3 border-t border-slate-100">
          <div class="font-bold text-lime-700 text-lg">${formatCurrency(c.precio)} <span class="text-xs text-slate-500 font-normal">/ mes</span></div>
          <a href="reserva.html" class="text-sm font-semibold text-lime-700 hover:text-lime-900">Inscribirme →</a>
        </div>
      </div>`).join('');
  },

  renderProfesores() {
    const cont = document.getElementById('profesoresLista');
    if (!cont) return;
    const clases = Catalog.clases();
    const profesMap = {};
    clases.forEach(c => {
      if (!profesMap[c.profesor]) {
        profesMap[c.profesor] = { nombre: c.profesor, clases: [] };
      }
      profesMap[c.profesor].clases.push(c.nombre);
    });
    const profes = Object.values(profesMap);
    cont.innerHTML = profes.map(p => `
      <div class="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4">
        <div class="w-14 h-14 rounded-full bg-gradient-to-br from-lime-400 to-green-600 flex items-center justify-center text-white text-lg font-black flex-shrink-0">
          ${p.nombre.charAt(0)}
        </div>
        <div>
          <p class="font-bold text-slate-900">${p.nombre}</p>
          <p class="text-sm text-slate-600">${p.clases.length} clase(s): ${p.clases.join(', ')}</p>
        </div>
      </div>`).join('');
  }
};

/* =========================================================
   Contacto (form + mapa + horarios)
   ========================================================= */
const ContactoApp = {
  init() {
    this.renderHorarios();
    this.bindForm();
  },

  renderHorarios() {
    const cont = document.getElementById('horariosAtencion');
    if (!cont) return;
    const horarios = Catalog.horarios();
    cont.innerHTML = `
      <div class="space-y-1">
        ${horarios.map(h => `
          <div class="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
            <span class="font-semibold text-slate-900">${h.dia}</span>
            <div class="text-right text-sm">
              <p class="text-slate-700">${h.atencion}</p>
              <p class="text-xs text-slate-500">Reservas: ${h.reservas}</p>
            </div>
          </div>`).join('')}
      </div>`;
  },

  bindForm() {
    const form = document.getElementById('contactoForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const phone = form.phone.value.trim();
      const subject = form.subject.value;
      const message = form.message.value.trim();

      if (name.length < 3) { UI.toast('Ingresa tu nombre', 'error'); return; }
      if (!UI.isValidEmail(email)) { UI.toast('Correo inválido', 'error'); return; }
      if (!subject) { UI.toast('Selecciona un asunto', 'error'); return; }
      if (message.length < 10) { UI.toast('Mensaje muy corto', 'error'); return; }

      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner"></span> Enviando...';

      setTimeout(() => {
        Contacto.create({ name, email, phone, subject, message });
        UI.toast('Mensaje enviado con éxito', 'success');
        form.reset();
        btn.disabled = false;
        btn.innerHTML = 'Enviar mensaje';
      }, 700);
    });
  }
};