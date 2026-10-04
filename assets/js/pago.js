/**
 * pago.js
 * Lógica de pago: 4 métodos (tarjeta, Yape, transferencia, efectivo) + validación.
 */

const PagoApp = {
  p() { return UI.prefix(); },

  /* =========================================================
     Validación Luhn
     ========================================================= */
  luhn(num) {
    const digits = num.replace(/\D/g, '');
    if (digits.length < 13 || digits.length > 19) return false;
    let sum = 0;
    let isAlt = false;
    for (let i = digits.length - 1; i >= 0; i--) {
      let d = parseInt(digits[i], 10);
      if (isAlt) { d *= 2; if (d > 9) d -= 9; }
      sum += d;
      isAlt = !isAlt;
    }
    return sum % 10 === 0;
  },

  detectBrand(num) {
    const n = num.replace(/\D/g, '');
    if (/^4/.test(n)) return 'VISA';
    if (/^(5[1-5]|2[2-7])/.test(n)) return 'MASTERCARD';
    if (/^3[47]/.test(n)) return 'AMEX';
    if (/^6(?:011|5)/.test(n)) return 'DISCOVER';
    return 'CARD';
  },

  formatCardNumber(value) {
    const v = value.replace(/\D/g, '').slice(0, 19);
    return v.replace(/(.{4})/g, '$1 ').trim();
  },

  formatExpiry(value) {
    const v = value.replace(/\D/g, '').slice(0, 4);
    if (v.length >= 3) return `${v.slice(0, 2)}/${v.slice(2)}`;
    return v;
  },

  /* =========================================================
     Bind página de pago
     ========================================================= */
  bindPagoPage() {
    const draft = Draft.getPago();
    let reservaId, total;

    if (draft && draft.reservaId) {
      reservaId = draft.reservaId;
      const reserva = Reservas.findById(reservaId);
      if (reserva) {
        total = reserva.total;
        this.renderResumenPago(reserva);
      } else {
        UI.toast('Reserva no encontrada', 'error');
        setTimeout(() => location.href = `${this.p()}pages/perfil.html`, 800);
        return;
      }
    } else {
      // Buscar la primera reserva pendiente del usuario
      const user = Session.current();
      if (!user) { location.href = `${this.p()}pages/login.html`; return; }
      const reservas = Reservas.byUser(user.id).filter(r => r.status !== 'cancelada' && !Pagos.byReservation(r.id).length);
      if (reservas.length === 0) {
        UI.toast('No tienes reservas pendientes de pago', 'info');
        setTimeout(() => location.href = `${this.p()}pages/reserva.html`, 800);
        return;
      }
      reservas.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      reservaId = reservas[0].id;
      total = reservas[0].total;
      Draft.savePago({ reservaId, total });
      this.renderResumenPago(reservas[0]);
    }

    this.bindMethodTabs();
    this.bindTarjetaForm(reservaId);
    this.bindYapeForm(reservaId);
    this.bindTransferForm(reservaId);
    this.bindEfectivoForm(reservaId);
  },

  renderResumenPago(reserva) {
    const pista = Catalog.pistaById(reserva.pistaId);
    const cont = document.getElementById('pagoResumen');
    if (!cont) return;
    const endTime = Reservas.timeSlots(reserva.startTime, reserva.duration).slice(-1)[0];
    cont.innerHTML = `
      <div class="bg-white border-2 border-lime-200 rounded-xl p-6 sticky top-20">
        <h4 class="font-bold text-slate-900 mb-4">Resumen del pago</h4>
        <div class="space-y-3 text-sm mb-4">
          <div class="flex justify-between"><span class="text-slate-600">Pista:</span><span class="font-semibold text-slate-900 text-right">${pista.nombre}</span></div>
          <div class="flex justify-between"><span class="text-slate-600">Fecha:</span><span class="font-semibold text-slate-900">${formatDate(reserva.date, { short: true })}</span></div>
          <div class="flex justify-between"><span class="text-slate-600">Horario:</span><span class="font-semibold text-slate-900">${reserva.startTime} - ${endTime}</span></div>
          <div class="flex justify-between"><span class="text-slate-600">Duración:</span><span class="font-semibold text-slate-900">${reserva.duration}h</span></div>
        </div>
        <div class="border-t border-slate-200 pt-3">
          <div class="flex justify-between items-baseline">
            <span class="text-slate-900 font-bold">Total a pagar:</span>
            <span class="font-black text-3xl text-lime-700">${formatCurrency(reserva.total)}</span>
          </div>
        </div>
      </div>`;
  },

  bindMethodTabs() {
    const tabs = document.querySelectorAll('[data-method-tab]');
    const panels = document.querySelectorAll('[data-method-panel]');
    tabs.forEach(t => t.addEventListener('click', () => {
      tabs.forEach(x => { x.classList.remove('border-lime-500', 'bg-lime-50'); x.classList.add('border-slate-200'); x.querySelector('span:first-child').classList.remove('text-lime-700'); });
      t.classList.add('border-lime-500', 'bg-lime-50');
      t.classList.remove('border-slate-200');
      t.querySelector('span:first-child').classList.add('text-lime-700');
      panels.forEach(p => p.classList.add('hidden'));
      document.getElementById(`method-${t.dataset.methodTab}`)?.classList.remove('hidden');
    }));
  },

  bindTarjetaForm(reservaId) {
    const form = document.getElementById('tarjetaForm');
    if (!form) return;
    const numInput = form.querySelector('[name="numero"]');
    const expInput = form.querySelector('[name="vencimiento"]');
    const cvvInput = form.querySelector('[name="cvv"]');

    numInput.addEventListener('input', () => {
      numInput.value = this.formatCardNumber(numInput.value);
    });
    expInput.addEventListener('input', () => {
      expInput.value = this.formatExpiry(expInput.value);
    });
    cvvInput.addEventListener('input', () => {
      cvvInput.value = cvvInput.value.replace(/\D/g, '').slice(0, 4);
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const numero = numInput.value.replace(/\s/g, '');
      const vencimiento = expInput.value;
      const cvv = cvvInput.value;
      const titular = form.titular.value.trim();

      if (!titular || titular.length < 3) { UI.toast('Ingresa el titular de la tarjeta', 'error'); return; }
      if (!this.luhn(numero)) { UI.toast('Número de tarjeta inválido', 'error'); return; }
      if (!/^\d{2}\/\d{2}$/.test(vencimiento)) { UI.toast('Vencimiento inválido (MM/AA)', 'error'); return; }
      const [mm, yy] = vencimiento.split('/').map(Number);
      const now = new Date();
      const expDate = new Date(2000 + yy, mm - 1, 1);
      expDate.setMonth(expDate.getMonth() + 1);
      if (expDate <= now) { UI.toast('Tarjeta vencida', 'error'); return; }
      if (!/^\d{3,4}$/.test(cvv)) { UI.toast('CVV inválido', 'error'); return; }

      this.procesarPago(reservaId, {
        method: 'tarjeta',
        cardLast4: numero.slice(-4),
        cardBrand: this.detectBrand(numero),
        cardHolder: titular
      });
    });
  },

  bindYapeForm(reservaId) {
    const form = document.getElementById('yapeForm');
    if (!form) return;
    form.querySelector('[name="operacion"]').addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const operacion = form.operacion.value.trim();
      const celular = form.celular.value.trim();
      if (!UI.isValidPhone(celular)) { UI.toast('Celular inválido', 'error'); return; }
      if (!/^\d{8,10}$/.test(operacion)) { UI.toast('Número de operación inválido (8-10 dígitos)', 'error'); return; }
      this.procesarPago(reservaId, { method: 'yape', cardHolder: celular });
    });
  },

  bindTransferForm(reservaId) {
    const form = document.getElementById('transferForm');
    if (!form) return;
    form.querySelector('[name="operacion"]').addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 12);
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const operacion = form.operacion.value.trim();
      const banco = form.banco.value;
      if (!banco) { UI.toast('Selecciona el banco', 'error'); return; }
      if (!/^\d{8,12}$/.test(operacion)) { UI.toast('Número de operación inválido (8-12 dígitos)', 'error'); return; }
      this.procesarPago(reservaId, { method: 'transferencia', cardHolder: banco });
    });
  },

  bindEfectivoForm(reservaId) {
    const form = document.getElementById('efectivoForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nombre = form.nombre.value.trim();
      if (!nombre || nombre.length < 3) { UI.toast('Ingresa tu nombre completo', 'error'); return; }
      this.procesarPago(reservaId, { method: 'efectivo', cardHolder: nombre });
    });
  },

  procesarPago(reservaId, data) {
    const reserva = Reservas.findById(reservaId);
    if (!reserva) { UI.toast('Reserva no encontrada', 'error'); return; }
    if (Pagos.byReservation(reservaId).length > 0) {
      UI.toast('Esta reserva ya está pagada', 'warning');
      setTimeout(() => location.href = `${this.p()}pages/perfil.html`, 800);
      return;
    }

    const btn = document.querySelector('button[type="submit"][data-paying]') ||
      [...document.querySelectorAll('form:not(.hidden) button[type="submit"]')][0];
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner"></span> Procesando pago...';
    }

    setTimeout(() => {
      const pago = Pagos.create({
        reservationId: reservaId,
        ...data,
        amount: reserva.total,
        status: 'aprobado'
      });
      Draft.clearPago();
      UI.toast('¡Pago realizado con éxito!', 'success');
      setTimeout(() => location.href = `${this.p()}pages/pago-confirmado.html?id=${pago.id}`, 700);
    }, 1100);
  },

  /* =========================================================
     Bind página pago-confirmado
     ========================================================= */
  bindPagoConfirmadoPage() {
    const id = new URLSearchParams(location.search).get('id');
    if (!id) { location.href = `${this.p()}pages/perfil.html`; return; }
    const pago = Pagos.findById(id);
    if (!pago) { location.href = `${this.p()}pages/perfil.html`; return; }
    const reserva = Reservas.findById(pago.reservationId);
    const user = Session.current();
    if (!user || reserva.userId !== user.id) { location.href = `${this.p()}index.html`; return; }
    this.renderRecibo(pago, reserva);
  },

  renderRecibo(pago, reserva) {
    const pista = Catalog.pistaById(reserva.pistaId);
    const endTime = Reservas.timeSlots(reserva.startTime, reserva.duration).slice(-1)[0];
    const cont = document.getElementById('reciboContent');
    if (!cont) return;

    cont.innerHTML = `
      <div class="bg-white border border-slate-200 rounded-xl overflow-hidden print-area">
        <div class="bg-gradient-to-r from-lime-500 to-green-600 text-white p-8 text-center">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
          </div>
          <h2 class="text-2xl font-black mb-2">¡Pago confirmado!</h2>
          <p class="text-lime-50">Tu reserva está completamente pagada</p>
        </div>
        <div class="p-8">
          <div class="flex justify-between items-start mb-6 pb-6 border-b border-slate-200">
            <div>
              <p class="text-xs uppercase tracking-wider text-slate-500">Comprobante</p>
              <p class="font-mono font-bold text-slate-900">${pago.operationNumber}</p>
            </div>
            <div class="text-right">
              <p class="text-xs uppercase tracking-wider text-slate-500">Fecha de pago</p>
              <p class="font-semibold text-slate-900">${formatDateTime(pago.paidAt)}</p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p class="text-xs uppercase tracking-wider text-slate-500 mb-1">Pista</p>
              <p class="font-bold text-slate-900">${pista.nombre}</p>
            </div>
            <div>
              <p class="text-xs uppercase tracking-wider text-slate-500 mb-1">Fecha y hora</p>
              <p class="font-bold text-slate-900">${formatDate(reserva.date, { weekday: true })}</p>
              <p class="text-sm text-slate-700">${reserva.startTime} - ${endTime}</p>
            </div>
            <div>
              <p class="text-xs uppercase tracking-wider text-slate-500 mb-1">Cliente</p>
              <p class="font-bold text-slate-900">${Session.current().name}</p>
              <p class="text-sm text-slate-700">${Session.current().email}</p>
            </div>
            <div>
              <p class="text-xs uppercase tracking-wider text-slate-500 mb-1">Método de pago</p>
              <p class="font-bold text-slate-900">${ReservasApp.metodoPagoLabel(pago.method)}</p>
              ${pago.cardLast4 ? `<p class="text-sm text-slate-700">${pago.cardBrand} •••• ${pago.cardLast4}</p>` : ''}
            </div>
          </div>
          <div class="bg-lime-50 border border-lime-200 rounded-lg p-4 flex justify-between items-center">
            <span class="font-bold text-slate-900">Total pagado</span>
            <span class="font-black text-3xl text-lime-700">${formatCurrency(pago.amount)}</span>
          </div>
          <p class="text-xs text-slate-500 mt-6 text-center">Conserva este comprobante como respaldo. Te enviamos una copia a tu correo.</p>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row gap-3 mt-6 no-print">
        <button onclick="window.print()" class="btn-outline flex-1">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
          Imprimir comprobante
        </button>
        <a href="${this.p()}pages/perfil.html" class="btn-primary flex-1">Ir a mi perfil</a>
      </div>`;
  }
};