/**
 * reservas.js
 * Lógica de reservas: wizard, slots dinámicos, detalle, cancelación.
 */

const ReservasApp = {
  p() { return UI.prefix(); },

  /* =========================================================
     Wizard de reserva (4 pasos)
     ========================================================= */
  wizard: {
    state: {
      step: 1,
      pistaId: null,
      date: null,
      startTime: null,
      duration: 1,
      players: 4,
      notes: ''
    },

    init() {
      // Restaurar borrador si existe y no hay params de pista en URL
      const urlPista = new URLSearchParams(location.search).get('pista');
      const draft = Draft.getReserva();
      if (draft && !urlPista) {
        this.state = { ...this.state, ...draft };
      } else if (urlPista) {
        this.state.pistaId = urlPista;
      }
      this.renderStep();
    },

    saveDraft() { Draft.saveReserva(this.state); },

    goToStep(n) {
      if (n > 1 && !this.validateStep(this.state.step)) {
        UI.toast('Completa los campos requeridos.', 'warning');
        return;
      }
      this.state.step = n;
      this.saveDraft();
      this.renderStep();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    validateStep(step) {
      if (step === 1) return !!this.state.pistaId;
      if (step === 2) return !!this.state.date && !!this.state.startTime && this.state.duration > 0;
      return true;
    },

    renderStep() {
      // Stepper
      document.querySelectorAll('.step-circle').forEach(c => {
        const s = Number(c.dataset.step);
        c.classList.remove('active', 'done');
        if (s === this.state.step) c.classList.add('active');
        else if (s < this.state.step) c.classList.add('done');
      });
      document.querySelectorAll('.step-line').forEach((l, i) => {
        const nextStep = i + 1;
        l.classList.toggle('done', nextStep < this.state.step);
      });
      // Step text labels
      document.querySelectorAll('[data-step-label]').forEach(el => {
        const s = Number(el.dataset.stepLabel);
        el.classList.toggle('text-slate-900', s === this.state.step);
        el.classList.toggle('text-slate-500', s !== this.state.step);
      });

      // Paneles
      document.querySelectorAll('.step-panel').forEach(p => p.classList.add('hidden'));
      const panel = document.getElementById(`step${this.state.step}`);
      if (panel) panel.classList.remove('hidden');

      // Botones
      const btnPrev = document.getElementById('btnPrev');
      const btnNext = document.getElementById('btnNext');
      const btnSubmit = document.getElementById('btnSubmit');
      if (btnPrev) btnPrev.classList.toggle('hidden', this.state.step === 1);
      if (btnNext) btnNext.classList.toggle('hidden', this.state.step === 4);
      if (btnSubmit) btnSubmit.classList.toggle('hidden', this.state.step !== 4);

      if (this.state.step === 1) this.renderStep1();
      if (this.state.step === 2) this.renderStep2();
      if (this.state.step === 3) this.renderStep3();
      if (this.state.step === 4) this.renderStep4();
    },

    renderStep1() {
      const grid = document.getElementById('step1Grid');
      if (!grid) return;
      grid.innerHTML = Catalog.pistas().map(p => {
        const selected = this.state.pistaId === p.id;
        return `
          <button type="button" data-pista="${p.id}" class="pista-card text-left w-full bg-white border-2 ${selected ? 'border-lime-500 ring-2 ring-lime-200' : 'border-slate-200 hover:border-lime-400'} rounded-xl p-5 transition card-hover">
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  ${p.techada ? '<span class="px-2 py-0.5 text-xs font-bold bg-slate-100 text-slate-700 rounded">Techada</span>' : '<span class="px-2 py-0.5 text-xs font-bold bg-orange-100 text-orange-700 rounded">Outdoor</span>'}
                  <span class="px-2 py-0.5 text-xs font-bold bg-lime-100 text-lime-700 rounded">${p.tipo}</span>
                </div>
                <h3 class="text-lg font-bold text-slate-900 mb-1">${p.nombre}</h3>
                <p class="text-sm text-slate-600 mb-3">${p.descripcion}</p>
                <div class="flex items-center gap-3 text-xs text-slate-500">
                  <span class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    ${p.capacidad} jugadores
                  </span>
                  ${p.iluminada ? '<span class="flex items-center gap-1 text-yellow-600">⚡ Iluminada</span>' : ''}
                </div>
              </div>
              <div class="text-right">
                <div class="text-2xl font-black text-lime-700">${formatCurrency(p.precioHora)}</div>
                <div class="text-xs text-slate-500">por hora</div>
              </div>
            </div>
          </button>`;
      }).join('');

      grid.querySelectorAll('[data-pista]').forEach(btn => {
        btn.addEventListener('click', () => {
          this.state.pistaId = btn.dataset.pista;
          this.saveDraft();
          this.renderStep1();
        });
      });
    },

    renderStep2() {
      const pista = Catalog.pistaById(this.state.pistaId);
      if (!pista) return;

      const pistaInfo = document.getElementById('pistaInfo');
      if (pistaInfo) {
        pistaInfo.innerHTML = `
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-lg bg-lime-100 flex items-center justify-center text-lime-700">
              <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2"/></svg>
            </div>
            <div>
              <p class="text-sm text-slate-500">Pista seleccionada</p>
              <p class="font-bold text-slate-900">${pista.nombre}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm text-slate-500">Tarifa</p>
            <p class="font-bold text-lime-700">${formatCurrency(pista.precioHora)} / hora</p>
          </div>`;
      }

      const dateInput = document.getElementById('reservaFecha');
      if (dateInput) {
        dateInput.min = todayISO();
        if (this.state.date) dateInput.value = this.state.date;
        dateInput.onchange = () => {
          this.state.date = dateInput.value;
          this.state.startTime = null;
          this.saveDraft();
          this.renderSlots();
        };
      }

      const durationSelect = document.getElementById('reservaDuracion');
      if (durationSelect) {
        durationSelect.value = String(this.state.duration);
        durationSelect.onchange = () => {
          this.state.duration = Number(durationSelect.value);
          this.state.startTime = null;
          this.saveDraft();
          this.renderSlots();
        };
      }

      this.renderSlots();
    },

    renderSlots() {
      const cont = document.getElementById('slotsContainer');
      if (!cont) return;
      if (!this.state.date) {
        cont.innerHTML = '<p class="text-slate-500 text-sm">Selecciona una fecha para ver los horarios disponibles.</p>';
        return;
      }
      const pista = Catalog.pistaById(this.state.pistaId);
      const occupied = Reservas.occupiedByPistaDate(this.state.pistaId, this.state.date);
      const slots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];

      cont.innerHTML = `
        <div class="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2 w-full">
          ${slots.map(h => {
              const occupiedUntil = Reservas.timeSlots(h, this.state.duration);
              const conflict = occupiedUntil.some(s => occupied.includes(s));
              const selected = this.state.startTime === h;
              return `<button type="button" data-slot="${h}" ${conflict ? 'disabled' : ''} class="time-slot ${selected ? 'selected' : ''}">${h}</button>`;
            }).join('')}
        </div>
        <p class="text-xs text-slate-500 mt-3">Horario de reservas: 08:00 - 22:00. Slots marcados están ocupados.</p>`;

      cont.querySelectorAll('[data-slot]').forEach(btn => {
        if (btn.disabled) return;
        btn.addEventListener('click', () => {
          this.state.startTime = btn.dataset.slot;
          this.saveDraft();
          this.renderSlots();
          this.updateTotal();
        });
      });
      this.updateTotal();
    },

    updateTotal() {
      const pista = Catalog.pistaById(this.state.pistaId);
      const totalEl = document.getElementById('resumenTotal');
      if (totalEl && pista && this.state.duration) {
        totalEl.textContent = formatCurrency(pista.precioHora * this.state.duration);
      }
    },

    renderStep3() {
      const pista = Catalog.pistaById(this.state.pistaId);
      const resumen = document.getElementById('resumenReserva');
      if (resumen && pista) {
        const endTime = Reservas.timeSlots(this.state.startTime, this.state.duration).slice(-1)[0];
        resumen.innerHTML = `
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <p class="text-xs uppercase tracking-wider text-slate-500 mb-1">Pista</p>
              <p class="font-bold text-slate-900">${pista.nombre}</p>
            </div>
            <div>
              <p class="text-xs uppercase tracking-wider text-slate-500 mb-1">Fecha</p>
              <p class="font-bold text-slate-900">${formatDate(this.state.date, { weekday: true })}</p>
            </div>
            <div>
              <p class="text-xs uppercase tracking-wider text-slate-500 mb-1">Horario</p>
              <p class="font-bold text-slate-900">${this.state.startTime} - ${endTime} (${this.state.duration}h)</p>
            </div>
            <div>
              <p class="text-xs uppercase tracking-wider text-slate-500 mb-1">Total</p>
              <p class="font-black text-2xl text-lime-700">${formatCurrency(pista.precioHora * this.state.duration)}</p>
            </div>
          </div>`;
      }
      const notesInput = document.getElementById('reservaNotas');
      if (notesInput) {
        notesInput.value = this.state.notes || '';
        notesInput.oninput = () => { this.state.notes = notesInput.value; this.saveDraft(); };
      }
    },

    renderStep4() {
      // Confirmación final - resumen + botones
      const pista = Catalog.pistaById(this.state.pistaId);
      const resumen = document.getElementById('resumenFinal');
      if (resumen && pista) {
        const endTime = Reservas.timeSlots(this.state.startTime, this.state.duration).slice(-1)[0];
        resumen.innerHTML = `
          <div class="bg-white border-2 border-lime-200 rounded-xl p-6">
            <h4 class="font-bold text-slate-900 mb-4 text-lg">Resumen de tu reserva</h4>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between"><span class="text-slate-600">Pista:</span><span class="font-semibold text-slate-900">${pista.nombre}</span></div>
              <div class="flex justify-between"><span class="text-slate-600">Fecha:</span><span class="font-semibold text-slate-900">${formatDate(this.state.date, { weekday: true })}</span></div>
              <div class="flex justify-between"><span class="text-slate-600">Horario:</span><span class="font-semibold text-slate-900">${this.state.startTime} - ${endTime}</span></div>
              <div class="flex justify-between"><span class="text-slate-600">Duración:</span><span class="font-semibold text-slate-900">${this.state.duration} hora(s)</span></div>
              <div class="flex justify-between"><span class="text-slate-600">Jugadores:</span><span class="font-semibold text-slate-900">${this.state.players}</span></div>
              ${this.state.notes ? `<div class="flex justify-between"><span class="text-slate-600">Notas:</span><span class="font-semibold text-slate-900 text-right max-w-xs">${this.state.notes}</span></div>` : ''}
              <div class="border-t border-slate-200 pt-3 flex justify-between items-baseline">
                <span class="text-slate-900 font-bold">Total a pagar:</span>
                <span class="font-black text-2xl text-lime-700">${formatCurrency(pista.precioHora * this.state.duration)}</span>
              </div>
            </div>
            <p class="mt-4 text-xs text-slate-500">Al confirmar, tu reserva quedará registrada. Podrás pagarla inmediatamente o más tarde desde tu perfil.</p>
          </div>`;
      }
    },

    async submit() {
      const user = Session.current();
      if (!user) {
        UI.toast('Inicia sesión para reservar', 'warning');
        setTimeout(() => location.href = `${this.p()}pages/login.html`, 800);
        return;
      }
      const pista = Catalog.pistaById(this.state.pistaId);
      const total = pista.precioHora * this.state.duration;

      const btn = document.getElementById('btnSubmit');
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner"></span> Procesando...';

      try {
        const reserva = Reservas.create({
          userId: user.id,
          pistaId: pista.id,
          date: this.state.date,
          startTime: this.state.startTime,
          duration: this.state.duration,
          total,
          players: this.state.players,
          notes: this.state.notes,
          status: 'confirmada'
        });
        Draft.savePago({ reservaId: reserva.id, total, pistaId: pista.id });
        UI.toast('¡Reserva confirmada!', 'success');
        setTimeout(() => location.href = `${this.p()}pages/confirmacion.html?id=${reserva.id}`, 500);
      } catch (err) {
        UI.toast(err.message, 'error');
        btn.disabled = false;
        btn.innerHTML = 'Confirmar reserva →';
      }
    }
  },

  /* =========================================================
     Página de confirmación (entre reserva y pago)
     ========================================================= */
  bindConfirmacionPage() {
    const id = new URLSearchParams(location.search).get('id');
    if (!id) {
      location.href = `${this.p()}index.html`;
      return;
    }
    const reserva = Reservas.findById(id);
    if (!reserva) {
      UI.toast('Reserva no encontrada', 'error');
      return;
    }
    const pista = Catalog.pistaById(reserva.pistaId);
    const cont = document.getElementById('confirmacionContent');
    if (cont) {
      const endTime = Reservas.timeSlots(reserva.startTime, reserva.duration).slice(-1)[0];
      cont.innerHTML = `
        <div class="bg-white border-2 border-lime-200 rounded-xl p-6 mb-6">
          <h4 class="font-bold text-slate-900 mb-4 text-lg">Datos de tu reserva</h4>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between"><span class="text-slate-600">Código:</span><span class="font-mono font-semibold text-slate-900">${reserva.id.slice(-8).toUpperCase()}</span></div>
            <div class="flex justify-between"><span class="text-slate-600">Pista:</span><span class="font-semibold text-slate-900">${pista.nombre}</span></div>
            <div class="flex justify-between"><span class="text-slate-600">Fecha:</span><span class="font-semibold text-slate-900">${formatDate(reserva.date, { weekday: true })}</span></div>
            <div class="flex justify-between"><span class="text-slate-600">Horario:</span><span class="font-semibold text-slate-900">${reserva.startTime} - ${endTime}</span></div>
            <div class="flex justify-between"><span class="text-slate-600">Duración:</span><span class="font-semibold text-slate-900">${reserva.duration} hora(s)</span></div>
            <div class="border-t border-slate-200 pt-3 flex justify-between items-baseline">
              <span class="text-slate-900 font-bold">Total:</span>
              <span class="font-black text-2xl text-lime-700">${formatCurrency(reserva.total)}</span>
            </div>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row gap-3">
          <a href="${this.p()}pages/pago.html" class="btn-primary flex-1">Ir a pagar ahora</a>
          <a href="${this.p()}pages/perfil.html" class="btn-outline flex-1">Pagar más tarde</a>
        </div>`;
    }
  },

  /* =========================================================
     Detalle de reserva
     ========================================================= */
  bindDetallePage() {
    const id = new URLSearchParams(location.search).get('id');
    if (!id) { location.href = `${this.p()}pages/perfil.html`; return; }
    const user = Session.current();
    if (!user) { location.href = `${this.p()}pages/login.html`; return; }
    const reserva = Reservas.findById(id);
    if (!reserva || reserva.userId !== user.id) {
      UI.toast('Reserva no encontrada', 'error');
      location.href = `${this.p()}pages/perfil.html`;
      return;
    }
    this.renderDetalle(reserva);
  },

  renderDetalle(reserva) {
    const pista = Catalog.pistaById(reserva.pistaId);
    const pago = Pagos.byReservation(reserva.id)[0];
    const endTime = Reservas.timeSlots(reserva.startTime, reserva.duration).slice(-1)[0];
    const cont = document.getElementById('detalleContent');
    if (!cont) return;

    const canCancel = (reserva.status === 'confirmada' || reserva.status === 'pendiente') && !isPastDate(reserva.date);

    cont.innerHTML = `
      <div class="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div class="bg-gradient-to-br from-lime-50 to-green-50 p-6 border-b border-slate-200">
          <div class="flex items-start justify-between gap-3 mb-2">
            <div>
              <p class="text-xs uppercase tracking-wider text-slate-500">Reserva</p>
              <p class="font-mono font-bold text-slate-900">#${reserva.id.slice(-8).toUpperCase()}</p>
            </div>
            <div>${UI.badgeEstado(reserva.status)}</div>
          </div>
          <h2 class="text-2xl font-black text-slate-900">${pista.nombre}</h2>
        </div>
        <div class="p-6 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-xs uppercase tracking-wider text-slate-500 mb-1">Fecha</p>
              <p class="font-bold text-slate-900">${formatDate(reserva.date, { weekday: true })}</p>
            </div>
            <div>
              <p class="text-xs uppercase tracking-wider text-slate-500 mb-1">Horario</p>
              <p class="font-bold text-slate-900">${reserva.startTime} - ${endTime}</p>
            </div>
            <div>
              <p class="text-xs uppercase tracking-wider text-slate-500 mb-1">Duración</p>
              <p class="font-bold text-slate-900">${reserva.duration} hora(s)</p>
            </div>
            <div>
              <p class="text-xs uppercase tracking-wider text-slate-500 mb-1">Jugadores</p>
              <p class="font-bold text-slate-900">${reserva.players}</p>
            </div>
          </div>
          ${reserva.notes ? `<div><p class="text-xs uppercase tracking-wider text-slate-500 mb-1">Notas</p><p class="text-slate-700">${reserva.notes}</p></div>` : ''}
          ${pago ? `
            <div class="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <p class="text-xs uppercase tracking-wider text-slate-500 mb-2">Información de pago</p>
              <div class="space-y-1 text-sm">
                <div class="flex justify-between"><span class="text-slate-600">Método:</span><span class="font-semibold">${this.metodoPagoLabel(pago.method)}</span></div>
                ${pago.cardLast4 ? `<div class="flex justify-between"><span class="text-slate-600">Tarjeta:</span><span class="font-semibold">${pago.cardBrand} •••• ${pago.cardLast4}</span></div>` : ''}
                <div class="flex justify-between"><span class="text-slate-600">Operación:</span><span class="font-mono font-semibold">${pago.operationNumber}</span></div>
                <div class="flex justify-between"><span class="text-slate-600">Monto:</span><span class="font-bold text-lime-700">${formatCurrency(pago.amount)}</span></div>
              </div>
            </div>` : `
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p class="font-bold text-yellow-900 mb-1">Pago pendiente</p>
              <p class="text-sm text-yellow-800">Tu reserva aún no tiene un pago registrado.</p>
              ${reserva.status !== 'cancelada' && reserva.status !== 'completada' && !isPastDate(reserva.date) ? `<a href="${this.p()}pages/pago.html" class="btn-primary mt-3 inline-flex">Pagar ahora</a>` : ''}
            </div>`}
          ${reserva.status === 'cancelada' && reserva.cancelReason ? `<div><p class="text-xs uppercase tracking-wider text-slate-500 mb-1">Motivo de cancelación</p><p class="text-slate-700">${reserva.cancelReason}</p></div>` : ''}
          <div class="border-t border-slate-200 pt-4 flex flex-wrap gap-3">
            <a href="${this.p()}pages/perfil.html" class="btn-outline">← Volver a mi perfil</a>
            ${canCancel ? `<button id="btnCancelar" class="btn-danger">Anular reserva</button>` : ''}
            ${!pago && reserva.status !== 'cancelada' && !isPastDate(reserva.date) ? `<a href="${this.p()}pages/pago.html" class="btn-primary">Ir a pagar</a>` : ''}
          </div>
        </div>
      </div>`;

    const btnCancel = document.getElementById('btnCancelar');
    if (btnCancel) {
      btnCancel.addEventListener('click', async () => {
        const ok = await UI.confirm({
          title: '¿Anular esta reserva?',
          message: 'Esta acción no se puede deshacer. Se requiere al menos 24 horas de anticipación.',
          confirmText: 'Sí, anular',
          cancelText: 'Cancelar',
          danger: true
        });
        if (!ok) return;
        try {
          Reservas.cancel(reserva.id, 'Anulada por el usuario');
          UI.toast('Reserva anulada', 'success');
          setTimeout(() => location.reload(), 600);
        } catch (err) {
          UI.toast(err.message, 'error');
        }
      });
    }
  },

  metodoPagoLabel(method) {
    return { tarjeta: 'Tarjeta', yape: 'Yape', transferencia: 'Transferencia', efectivo: 'Efectivo' }[method] || method;
  },

  /* =========================================================
     Historial en perfil
     ========================================================= */
  bindPerfilPage() {
    const user = Session.current();
    if (!user) return;

    // Stats
    const stats = Reservas.stats(user.id);
    const statsEl = document.getElementById('statsCounters');
    if (statsEl) {
      statsEl.innerHTML = `
        <div class="bg-white border border-slate-200 rounded-xl p-5">
          <p class="text-sm text-slate-500 mb-1">Próximas</p>
          <p class="text-3xl font-black text-lime-700">${stats.proximas}</p>
        </div>
        <div class="bg-white border border-slate-200 rounded-xl p-5">
          <p class="text-sm text-slate-500 mb-1">Completadas</p>
          <p class="text-3xl font-black text-blue-700">${stats.completadas}</p>
        </div>
        <div class="bg-white border border-slate-200 rounded-xl p-5">
          <p class="text-sm text-slate-500 mb-1">Pendientes</p>
          <p class="text-3xl font-black text-yellow-700">${stats.pendientes}</p>
        </div>
        <div class="bg-white border border-slate-200 rounded-xl p-5">
          <p class="text-sm text-slate-500 mb-1">Canceladas</p>
          <p class="text-3xl font-black text-red-700">${stats.canceladas}</p>
        </div>`;
    }

    this.renderHistorial('todas');
    const tabs = document.querySelectorAll('[data-filter]');
    tabs.forEach(t => t.addEventListener('click', () => {
      tabs.forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      this.renderHistorial(t.dataset.filter);
    }));
  },

  renderHistorial(filter = 'todas') {
    const user = Session.current();
    if (!user) return;
    const list = Reservas.byUser(user.id);
    const today = todayISO();

    let filtered = list;
    if (filter === 'proximas') filtered = list.filter(r => r.status !== 'cancelada' && r.status !== 'completada' && r.date >= today);
    else if (filter === 'completadas') filtered = list.filter(r => r.status === 'completada' || (r.date < today && r.status !== 'cancelada'));
    else if (filter === 'pendientes') filtered = list.filter(r => r.status === 'pendiente');
    else if (filter === 'canceladas') filtered = list.filter(r => r.status === 'cancelada');

    filtered.sort((a, b) => (b.date + b.startTime).localeCompare(a.date + a.startTime));

    const cont = document.getElementById('historialList');
    if (!cont) return;

    if (filtered.length === 0) {
      cont.innerHTML = `
        <div class="bg-white border border-slate-200 rounded-xl p-10 text-center">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          </div>
          <h3 class="font-bold text-slate-900 mb-1">Sin reservas</h3>
          <p class="text-sm text-slate-500 mb-4">No tienes reservas en este filtro.</p>
          <a href="${this.p()}pages/reserva.html" class="btn-primary inline-flex">Hacer una reserva</a>
        </div>`;
      return;
    }

    cont.innerHTML = filtered.map(r => {
      const pista = Catalog.pistaById(r.pistaId);
      const pago = Pagos.byReservation(r.id)[0];
      const endTime = Reservas.timeSlots(r.startTime, r.duration).slice(-1)[0];
      return `
        <a href="${this.p()}pages/detalle-reserva.html?id=${r.id}" class="block bg-white border border-slate-200 rounded-xl p-5 hover:border-lime-400 hover:shadow-md transition">
          <div class="flex items-start justify-between gap-3 mb-3">
            <div>
              <h4 class="font-bold text-slate-900">${pista ? pista.nombre : 'Pista'}</h4>
              <p class="text-xs text-slate-500">Reserva #${r.id.slice(-8).toUpperCase()}</p>
            </div>
            <div>${UI.badgeEstado(r.status)}</div>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div><p class="text-xs text-slate-500">Fecha</p><p class="font-semibold text-slate-900">${formatDate(r.date, { short: true })}</p></div>
            <div><p class="text-xs text-slate-500">Hora</p><p class="font-semibold text-slate-900">${r.startTime} - ${endTime}</p></div>
            <div><p class="text-xs text-slate-500">Duración</p><p class="font-semibold text-slate-900">${r.duration}h</p></div>
            <div><p class="text-xs text-slate-500">Total</p><p class="font-bold text-lime-700">${formatCurrency(r.total)}</p></div>
          </div>
          ${pago ? `<p class="text-xs text-green-700 mt-3">✓ Pagado · ${this.metodoPagoLabel(pago.method)}</p>` : (r.status !== 'cancelada' ? '<p class="text-xs text-yellow-700 mt-3">⏳ Pago pendiente</p>' : '')}
        </a>`;
    }).join('');
  },

  bindInicioPage() {
    // Render pistas destacadas
    const grid = document.getElementById('pistasDestacadas');
    if (grid) {
      const pistas = Catalog.pistas().slice(0, 6);
      grid.innerHTML = pistas.map(p => `
        <div class="court-card overflow-hidden">
          <div class="court-img">
            <img src="${UI.pistaImage(p)}" alt="${p.nombre}" loading="lazy">
            ${p.techada ? '<span class="absolute top-3 left-3 px-2 py-1 text-xs font-bold bg-white/90 text-slate-900 rounded">Techada</span>' : '<span class="absolute top-3 left-3 px-2 py-1 text-xs font-bold bg-orange-500/90 text-white rounded">Outdoor</span>'}
          </div>
          <div class="p-5">
            <span class="inline-block px-2 py-0.5 text-xs font-bold bg-lime-100 text-lime-700 rounded mb-2">${p.tipo}</span>
            <h3 class="font-bold text-slate-900 mb-1">${p.nombre}</h3>
            <p class="text-sm text-slate-600 mb-3 line-clamp-2">${p.descripcion}</p>
            <div class="flex items-center justify-between pt-3 border-t border-slate-100">
              <div>
                <div class="text-2xl font-black text-lime-700">${formatCurrency(p.precioHora)}</div>
                <div class="text-xs text-slate-500">por hora</div>
              </div>
              <a href="${this.p()}pages/reserva.html?pista=${p.id}" class="inline-flex items-center gap-1 px-3 py-1.5 bg-lime-500 hover:bg-lime-600 text-slate-900 text-sm font-semibold rounded-md transition">
                Reservar
              </a>
            </div>
          </div>
        </div>`).join('');
    }

    // Render servicios destacados
    const sg = document.getElementById('serviciosResumen');
    if (sg) {
      const servicios = Catalog.servicios().slice(0, 6);
      sg.innerHTML = servicios.map(s => `
        <div class="card-hover bg-white rounded-xl p-6 border border-slate-200">
          <div class="w-14 h-14 rounded-lg bg-gradient-to-br from-lime-400 to-green-600 flex items-center justify-center text-white mb-4">
            ${UI.icons[s.icono] || UI.icons.padel}
          </div>
          <h3 class="font-bold text-slate-900 mb-2">${s.titulo}</h3>
          <p class="text-sm text-slate-600 mb-3">${s.descripcion}</p>
          <div class="text-sm font-semibold text-lime-700">Desde ${formatCurrency(s.precioDesde)}</div>
        </div>`).join('');
    }
  }
};