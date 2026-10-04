/**
 * data.js
 * Mock data + capa de persistencia en localStorage.
 * Simula un backend para el template Pádel Premium Club.
 */

const DB_KEYS = {
  users: 'padel_users',
  reservations: 'padel_reservas',
  payments: 'padel_pagos',
  session: 'padel_session',
  contact: 'padel_contact_messages',
  reservaDraft: 'padel_reserva_draft',
  pagoDraft: 'padel_pago_draft',
  seeded: 'padel_seeded_v1'
};

/* =========================================================
   MOCK DATA - Catálogo de pistas de pádel
   ========================================================= */
const PISTAS = [
  {
    id: 'pista-cristal',
    nombre: 'Pista Cristal · Cubierta',
    tipo: 'Cristal',
    superficie: 'Césped sintético',
    capacidad: 4,
    precioHora: 80,
    iluminada: true,
    techada: true,
    imagen: 'cristal',
    descripcion: 'Pista acristalada de máxima visibilidad, perfecta para partidos profesionales y amateur. Iluminación LED cenital.',
    servicios: ['Vestuarios', 'Estacionamiento', 'Buffet', 'Duchas calientes']
  },
  {
    id: 'pista-panoramica',
    nombre: 'Pista Panorámica',
    tipo: 'Panorámica',
    superficie: 'Césped sintético',
    capacidad: 4,
    precioHora: 90,
    iluminada: true,
    techada: true,
    imagen: 'panoramica',
    descripcion: 'Pista panorámica premium con paredes íntegramente acristaladas. La favorita de jugadores experimentados.',
    servicios: ['Vestuarios', 'Estacionamiento', 'Buffet', 'Duchas calientes', 'Alquiler de palas']
  },
  {
    id: 'pista-outdoor-1',
    nombre: 'Pista Outdoor #1',
    tipo: 'Outdoor',
    superficie: 'Césped sintético',
    capacidad: 4,
    precioHora: 60,
    iluminada: true,
    techada: false,
    imagen: 'outdoor1',
    descripcion: 'Pista al aire libre para disfrutar del pádel bajo el cielo. Ideal para tardes soleadas.',
    servicios: ['Vestuarios', 'Estacionamiento']
  },
  {
    id: 'pista-outdoor-2',
    nombre: 'Pista Outdoor #2',
    tipo: 'Outdoor',
    superficie: 'Césped sintético',
    capacidad: 4,
    precioHora: 60,
    iluminada: true,
    techada: false,
    imagen: 'outdoor2',
    descripcion: 'Segunda pista descubierta con la misma calidad de césped sintético e iluminación LED nocturna.',
    servicios: ['Vestuarios', 'Estacionamiento']
  },
  {
    id: 'pista-indoor-pro',
    nombre: 'Pista Indoor Pro',
    tipo: 'Indoor Pro',
    superficie: 'Césped sintético premium',
    capacidad: 4,
    precioHora: 100,
    iluminada: true,
    techada: true,
    imagen: 'indoorpro',
    descripcion: 'Nuestra pista indoor premium, utilizada en torneos nacionales. Superficie de última generación.',
    servicios: ['Vestuarios premium', 'Estacionamiento', 'Buffet', 'Duchas', 'Alquiler de palas']
  },
  {
    id: 'pista-dobles-plus',
    nombre: 'Pista Dobles Plus',
    tipo: 'Dobles',
    superficie: 'Césped sintético',
    capacidad: 4,
    precioHora: 110,
    iluminada: true,
    techada: true,
    imagen: 'doblesplus',
    descripcion: 'Pista con dimensiones ampliadas para partidos de dobles más cómodos. Espacio extra para moverse.',
    servicios: ['Vestuarios', 'Estacionamiento', 'Buffet', 'Duchas', 'Graderías']
  }
];

/* =========================================================
   MOCK DATA - Clases / escuela
   ========================================================= */
const CLASES = [
  { id: 'c1', nombre: 'Escuela Infantil', profesor: 'Carlos Méndez', dias: ['Lun', 'Mié', 'Vie'], hora: '16:00 - 17:30', edades: '6 - 12 años', precio: 250, cupos: 16, nivel: 'Inicial' },
  { id: 'c2', nombre: 'Tecnificación Juvenil', profesor: 'Luis Rojas', dias: ['Mar', 'Jue'], hora: '17:00 - 18:30', edades: '13 - 17 años', precio: 320, cupos: 12, nivel: 'Intermedio' },
  { id: 'c3', nombre: 'Pádel Adultos · Iniciación', profesor: 'Miguel Ángel Torres', dias: ['Lun', 'Mié', 'Vie'], hora: '20:00 - 21:30', edades: '18+ años', precio: 280, cupos: 16, nivel: 'Inicial' },
  { id: 'c4', nombre: 'Pádel Femenino', profesor: 'María José Paz', dias: ['Mar', 'Jue'], hora: '18:00 - 19:30', edades: '16+ años', precio: 260, cupos: 16, nivel: 'Todos' },
  { id: 'c5', nombre: 'Entrenamiento Avanzado', profesor: 'Jorge Salinas', dias: ['Mar', 'Jue', 'Sáb'], hora: '19:30 - 21:00', edades: '16+ años', precio: 350, cupos: 8, nivel: 'Avanzado' },
  { id: 'c6', nombre: 'Pádel Senior', profesor: 'Ana Lucía Vega', dias: ['Lun', 'Mié'], hora: '09:00 - 10:30', edades: '50+ años', precio: 200, cupos: 12, nivel: 'Inicial' }
];

/* =========================================================
   MOCK DATA - Galería
   ========================================================= */
const GALERIA = [
  { id: 'g1', titulo: 'Torneo Apertura 2026', categoria: 'torneos', descripcion: 'Final del torneo apertura 2026 entre los mejores jugadores del club.' },
  { id: 'g2', titulo: 'Pista Cristal iluminada', categoria: 'pistas', descripcion: 'Vista nocturna de nuestra pista cristal con iluminación LED.' },
  { id: 'g3', titulo: 'Escuela Infantil', categoria: 'clases', descripcion: 'Pequeños jugadores disfrutando su primera clase.' },
  { id: 'g4', titulo: 'Pista Indoor Pro', categoria: 'pistas', descripcion: 'Nuestra pista indoor de máxima calidad.' },
  { id: 'g5', titulo: 'Torneo Corporativo', categoria: 'eventos', descripcion: 'Evento empresarial con equipos corporativos.' },
  { id: 'g6', titulo: 'Tecnificación Juvenil', categoria: 'clases', descripcion: 'Sesión de tecnificación con jóvenes promesas.' },
  { id: 'g7', titulo: 'Noche de Pádel', categoria: 'eventos', descripcion: 'Encuentros nocturnos bajo las luces del club.' },
  { id: 'g8', titulo: 'Vestidores Premium', categoria: 'instalaciones', descripcion: 'Vestidores modernos totalmente equipados.' },
  { id: 'g9', titulo: 'Buffet y Cafetería', categoria: 'instalaciones', descripcion: 'Zona de descanso y cafetería con vista a las pistas.' },
  { id: 'g10', titulo: 'Torneo Relámpago', categoria: 'torneos', descripcion: 'Torneo relámpago de fin de semana con 32 parejas.' },
  { id: 'g11', titulo: 'Pista Panorámica', categoria: 'pistas', descripcion: 'Vista panorámica del club con las pistas iluminadas.' },
  { id: 'g12', titulo: 'Clase de Palas', categoria: 'clases', descripcion: 'Especialización técnica de golpes y palas.' }
];

/* =========================================================
   MOCK DATA - Servicios adicionales
   ========================================================= */
const SERVICIOS = [
  {
    id: 's1',
    titulo: 'Alquiler de Pistas',
    icono: 'padel',
    descripcion: 'Reserva pistas de pádel cristal, panorámicas, indoor y outdoor. Disponibilidad por horas con pago online.',
    precioDesde: 60
  },
  {
    id: 's2',
    titulo: 'Escuela de Pádel',
    icono: 'academy',
    descripcion: 'Programas de formación para niños, jóvenes y adultos con entrenadores certificados por la FIP.',
    precioDesde: 200
  },
  {
    id: 's3',
    titulo: 'Torneos y Eventos',
    icono: 'trophy',
    descripcion: 'Organización de torneos corporativos, barriales y amateurs con arbitraje profesional incluido.',
    precioDesde: 800
  },
  {
    id: 's4',
    titulo: 'Eventos Sociales',
    icono: 'party',
    descripcion: 'Celebra cumpleaños, despedidas y eventos especiales con paquetes personalizados.',
    precioDesde: 350
  },
  {
    id: 's5',
    titulo: 'Entrenamiento Personal',
    icono: 'trainer',
    descripcion: 'Sesiones individuales o grupales con entrenadores especializados en pádel.',
    precioDesde: 80
  },
  {
    id: 's6',
    titulo: 'Alquiler de Material',
    icono: 'racket',
    descripcion: 'Palas, pelotas y grips de las mejores marcas. Disponibles en recepción.',
    precioDesde: 15
  }
];

/* =========================================================
   Planes / Membresías
   ========================================================= */
const PLANES = [
  {
    id: 'plan-basico',
    nombre: 'Básico',
    precioMensual: 199,
    precioAnual: 1990,
    destacado: false,
    color: 'border-slate-200',
    caracteristicas: [
      '2 horas mensuales en pistas outdoor',
      'Reserva con 24h de anticipación',
      'Acceso a vestuarios',
      'Sin compromiso de permanencia'
    ]
  },
  {
    id: 'plan-pro',
    nombre: 'Pro Pádel',
    precioMensual: 449,
    precioAnual: 4490,
    destacado: true,
    color: 'border-lime-500',
    caracteristicas: [
      '10 horas mensuales en cualquier pista',
      'Reserva con 7 días de anticipación',
      '1 clase grupal semanal incluida',
      '20% descuento en clases adicionales',
      'Alquiler gratuito de palas'
    ]
  },
  {
    id: 'plan-elite',
    nombre: 'Elite',
    precioMensual: 749,
    precioAnual: 7490,
    destacado: false,
    color: 'border-slate-200',
    caracteristicas: [
      'Horas ilimitadas en pistas indoor',
      'Reserva con 14 días de anticipación',
      '2 clases semanales con coach',
      'Acceso prioritario a torneos',
      'Plan nutricional trimestral',
      'Camiseta oficial del club'
    ]
  }
];

/* =========================================================
   Horarios de atención
   ========================================================= */
const HORARIOS = [
  { dia: 'Lunes', atencion: '07:00 - 23:00', reservas: '07:00 - 22:00' },
  { dia: 'Martes', atencion: '07:00 - 23:00', reservas: '07:00 - 22:00' },
  { dia: 'Miércoles', atencion: '07:00 - 23:00', reservas: '07:00 - 22:00' },
  { dia: 'Jueves', atencion: '07:00 - 23:00', reservas: '07:00 - 22:00' },
  { dia: 'Viernes', atencion: '07:00 - 00:00', reservas: '07:00 - 23:00' },
  { dia: 'Sábado', atencion: '08:00 - 00:00', reservas: '08:00 - 23:00' },
  { dia: 'Domingo', atencion: '08:00 - 22:00', reservas: '08:00 - 21:00' }
];

/* =========================================================
   Información del negocio
   ========================================================= */
const BUSINESS_INFO = {
  nombre: 'Padel Premium Club',
  eslogan: 'Tu pista, tu juego, tu momento',
  telefono: '+51 987 654 321',
  whatsapp: '+51987654321',
  email: 'hola@padelpremium.com',
  direccion: 'Av. Deportiva 456, San Miguel, Lima - Perú',
  referencia: 'A 1 cuadra del Óvalo de la Av. La Marina',
  coordenadas: { lat: -12.0464, lng: -77.0428 },
  redes: {
    facebook: 'https://facebook.com/padelpremium',
    instagram: 'https://instagram.com/padelpremium',
    tiktok: 'https://tiktok.com/@padelpremium',
    youtube: 'https://youtube.com/@padelpremium'
  }
};

/* =========================================================
   Helpers de storage
   ========================================================= */
const Store = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      console.error('Store.get error', key, e);
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Store.set error', key, e);
      return false;
    }
  },
  remove(key) {
    localStorage.removeItem(key);
  },
  clearAll() {
    Object.values(DB_KEYS).forEach(k => localStorage.removeItem(k));
  }
};

/* =========================================================
   Helpers de ID y formato
   ========================================================= */
function uid(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function formatCurrency(amount) {
  return `S/ ${Number(amount).toFixed(2)}`;
}

function formatDate(iso, opts = {}) {
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  if (isNaN(d.getTime())) return '';
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const weekdays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  if (opts.weekday) {
    return `${weekdays[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }
  if (opts.short) {
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' });
}

function formatDateTime(iso) {
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  if (isNaN(d.getTime())) return '';
  return `${formatDate(d)} ${d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}`;
}

function todayISO(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

function toLocalDateKey(date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function isPastDate(dateISO) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateISO);
  target.setHours(0, 0, 0, 0);
  return target < today;
}

function isPastDateTime(dateISO, timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  const target = new Date(dateISO);
  target.setHours(h, m, 0, 0);
  return target < new Date();
}

function daysBetween(dateISO1, dateISO2) {
  const d1 = new Date(dateISO1);
  const d2 = new Date(dateISO2);
  return Math.round((d2 - d1) / 86400000);
}

/* =========================================================
   Seeding - datos iniciales (usuarios demo + reservas)
   ========================================================= */
function seedDatabase(force = false) {
  if (!force && Store.get(DB_KEYS.seeded)) return;

  Store.remove(DB_KEYS.users);
  Store.remove(DB_KEYS.reservations);
  Store.remove(DB_KEYS.payments);
  Store.remove(DB_KEYS.contact);

  const users = [
    {
      id: 'user_demo',
      name: 'Sebastián Castro',
      email: 'demo@padel.com',
      phone: '987654321',
      dni: '12345678',
      password: '123456',
      createdAt: '2026-01-15T10:00:00.000Z'
    },
    {
      id: 'user_admin',
      name: 'Administrador',
      email: 'admin@padel.com',
      phone: '999888777',
      dni: '87654321',
      password: 'admin123',
      createdAt: '2025-06-01T08:00:00.000Z',
      role: 'admin'
    }
  ];
  Store.set(DB_KEYS.users, users);

  const reservations = [
    {
      id: 'res_001',
      userId: 'user_demo',
      pistaId: 'pista-cristal',
      date: todayISO(-7),
      startTime: '20:00',
      duration: 2,
      status: 'completada',
      total: 160,
      notes: 'Partido con amigos del trabajo',
      players: 4,
      createdAt: new Date(Date.now() - 8 * 86400000).toISOString()
    },
    {
      id: 'res_002',
      userId: 'user_demo',
      pistaId: 'pista-panoramica',
      date: todayISO(-2),
      startTime: '18:00',
      duration: 1,
      status: 'completada',
      total: 90,
      notes: 'Torneo barrial',
      players: 4,
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
    },
    {
      id: 'res_003',
      userId: 'user_demo',
      pistaId: 'pista-indoor-pro',
      date: todayISO(5),
      startTime: '19:00',
      duration: 2,
      status: 'confirmada',
      total: 200,
      notes: 'Final del torneo',
      players: 4,
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
    },
    {
      id: 'res_004',
      userId: 'user_demo',
      pistaId: 'pista-outdoor-1',
      date: todayISO(12),
      startTime: '21:00',
      duration: 1,
      status: 'pendiente',
      total: 60,
      notes: 'Esperando pago',
      players: 4,
      createdAt: new Date().toISOString()
    },
    {
      id: 'res_005',
      userId: 'user_demo',
      pistaId: 'pista-outdoor-2',
      date: todayISO(-20),
      startTime: '17:00',
      duration: 1,
      status: 'cancelada',
      total: 60,
      notes: 'Lluvia',
      players: 4,
      createdAt: new Date(Date.now() - 22 * 86400000).toISOString()
    }
  ];
  Store.set(DB_KEYS.reservations, reservations);

  const payments = [
    { id: 'pay_001', reservationId: 'res_001', method: 'tarjeta', cardLast4: '4242', cardBrand: 'VISA', amount: 160, status: 'aprobado', operationNumber: 'OP-PADEL-001', paidAt: new Date(Date.now() - 8 * 86400000).toISOString() },
    { id: 'pay_002', reservationId: 'res_002', method: 'yape', cardLast4: null, cardBrand: null, amount: 90, status: 'aprobado', operationNumber: 'OP-PADEL-002', paidAt: new Date(Date.now() - 3 * 86400000).toISOString() },
    { id: 'pay_003', reservationId: 'res_003', method: 'tarjeta', cardLast4: '5555', cardBrand: 'MASTERCARD', amount: 200, status: 'aprobado', operationNumber: 'OP-PADEL-003', paidAt: new Date(Date.now() - 1 * 86400000).toISOString() }
  ];
  Store.set(DB_KEYS.payments, payments);

  Store.set(DB_KEYS.seeded, true);
}

/* =========================================================
   API de dominio - Usuarios
   ========================================================= */
const Users = {
  list() { return Store.get(DB_KEYS.users, []); },
  findById(id) { return this.list().find(u => u.id === id) || null; },
  findByEmail(email) {
    return this.list().find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },
  create(data) {
    const users = this.list();
    if (this.findByEmail(data.email)) {
      throw new Error('El correo ya está registrado.');
    }
    if (data.password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres.');
    }
    const user = {
      id: uid('user'),
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      dni: data.dni?.trim() || '',
      password: data.password,
      createdAt: new Date().toISOString()
    };
    users.push(user);
    Store.set(DB_KEYS.users, users);
    return user;
  },
  update(id, changes) {
    const users = this.list();
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...changes };
    Store.set(DB_KEYS.users, users);
    return users[idx];
  },
  updatePassword(id, currentPassword, newPassword) {
    const users = this.list();
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) throw new Error('Usuario no encontrado.');
    if (users[idx].password !== currentPassword) throw new Error('La contraseña actual no es correcta.');
    if (newPassword.length < 6) throw new Error('La nueva contraseña debe tener al menos 6 caracteres.');
    users[idx].password = newPassword;
    Store.set(DB_KEYS.users, users);
    return users[idx];
  },
  remove(id) {
    const users = this.list().filter(u => u.id !== id);
    Store.set(DB_KEYS.users, users);
  }
};

/* =========================================================
   API de dominio - Sesión
   ========================================================= */
const Session = {
  current() {
    const s = Store.get(DB_KEYS.session);
    if (!s) return null;
    return Users.findById(s.userId);
  },
  isLogged() { return !!this.current(); },
  login(email, password, remember = false) {
    const user = Users.findByEmail(email);
    if (!user) throw new Error('Usuario no encontrado.');
    if (user.password !== password) throw new Error('Contraseña incorrecta.');
    Store.set(DB_KEYS.session, {
      userId: user.id,
      loggedAt: new Date().toISOString(),
      remember: !!remember
    });
    return user;
  },
  logout() {
    Store.remove(DB_KEYS.session);
  },
  require(redirectTo = 'login.html') {
    if (!this.isLogged()) {
      window.location.href = redirectTo;
      return false;
    }
    return true;
  }
};

/* =========================================================
   API de dominio - Reservas
   ========================================================= */
const Reservas = {
  list() { return Store.get(DB_KEYS.reservations, []); },
  findById(id) { return this.list().find(r => r.id === id) || null; },
  byUser(userId) { return this.list().filter(r => r.userId === userId); },
  byPistaDate(pistaId, date) {
    return this.list().filter(r => r.pistaId === pistaId && r.date === date);
  },
  create(data) {
    const reservations = this.list();
    const res = {
      id: uid('res'),
      userId: data.userId,
      pistaId: data.pistaId,
      date: data.date,
      startTime: data.startTime,
      duration: data.duration,
      status: data.status || 'pendiente',
      total: data.total,
      notes: data.notes || '',
      players: data.players || 4,
      createdAt: new Date().toISOString()
    };
    reservations.push(res);
    Store.set(DB_KEYS.reservations, reservations);
    return res;
  },
  update(id, changes) {
    const list = this.list();
    const idx = list.findIndex(r => r.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...changes };
    Store.set(DB_KEYS.reservations, list);
    return list[idx];
  },
  cancel(id, reason = '') {
    const res = this.findById(id);
    if (!res) throw new Error('Reserva no encontrada.');
    const now = new Date();
    const target = new Date(`${res.date}T${res.startTime}:00`);
    const hoursUntil = (target - now) / 3600000;
    if (hoursUntil < 24 && res.status !== 'pendiente') {
      throw new Error('Solo se pueden anular reservas con al menos 24 horas de anticipación.');
    }
    if (res.status === 'cancelada' || res.status === 'completada') {
      throw new Error(`La reserva ya está ${res.status}.`);
    }
    return this.update(id, {
      status: 'cancelada',
      cancelReason: reason,
      cancelledAt: new Date().toISOString()
    });
  },
  hasConflict(pistaId, date, startTime, duration, ignoreId = null) {
    const slots = this.timeSlots(startTime, duration);
    return this.list().some(r => {
      if (r.id === ignoreId) return false;
      if (r.pistaId !== pistaId) return false;
      if (r.date !== date) return false;
      if (r.status === 'cancelada') return false;
      const rSlots = this.timeSlots(r.startTime, r.duration);
      return slots.some(s => rSlots.includes(s));
    });
  },
  timeSlots(startTime, duration) {
    const [h, m] = startTime.split(':').map(Number);
    const start = h * 60 + m;
    const arr = [];
    for (let i = 0; i < duration * 60; i += 60) {
      const total = start + i;
      const hh = Math.floor(total / 60);
      const mm = total % 60;
      arr.push(`${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`);
    }
    return arr;
  },
  occupiedByPistaDate(pistaId, date) {
    const occupied = [];
    this.list().forEach(r => {
      if (r.pistaId !== pistaId) return;
      if (r.date !== date) return;
      if (r.status === 'cancelada') return;
      this.timeSlots(r.startTime, r.duration).forEach(s => occupied.push(s));
    });
    return occupied;
  },
  stats(userId) {
    const list = this.byUser(userId);
    const today = todayISO();
    let proximas = 0, completadas = 0, canceladas = 0, pendientes = 0;
    list.forEach(r => {
      if (r.status === 'cancelada') canceladas++;
      else if (r.status === 'completada') completadas++;
      else if (r.status === 'pendiente') pendientes++;
      else if (r.date >= today) proximas++;
    });
    return { total: list.length, proximas, completadas, canceladas, pendientes };
  },
  delete(id) {
    const list = this.list().filter(r => r.id !== id);
    Store.set(DB_KEYS.reservations, list);
  }
};

/* =========================================================
   API de dominio - Pagos
   ========================================================= */
const Pagos = {
  list() { return Store.get(DB_KEYS.payments, []); },
  findById(id) { return this.list().find(p => p.id === id) || null; },
  byReservation(reservationId) { return this.list().filter(p => p.reservationId === reservationId); },
  create(data) {
    const list = this.list();
    const pay = {
      id: uid('pay'),
      reservationId: data.reservationId,
      method: data.method,
      cardLast4: data.cardLast4 || null,
      cardBrand: data.cardBrand || null,
      cardHolder: data.cardHolder || null,
      amount: data.amount,
      status: data.status || 'aprobado',
      operationNumber: 'OP-' + Date.now().toString(36).toUpperCase(),
      paidAt: new Date().toISOString()
    };
    list.push(pay);
    Store.set(DB_KEYS.payments, list);
    return pay;
  }
};

/* =========================================================
   API - Mensajes de contacto
   ========================================================= */
const Contacto = {
  list() { return Store.get(DB_KEYS.contact, []); },
  create(data) {
    const list = this.list();
    const msg = {
      id: uid('msg'),
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      subject: data.subject || 'Consulta general',
      message: data.message,
      createdAt: new Date().toISOString(),
      read: false
    };
    list.push(msg);
    Store.set(DB_KEYS.contact, list);
    return msg;
  }
};

/* =========================================================
   Borradores
   ========================================================= */
const Draft = {
  saveReserva(data) { Store.set(DB_KEYS.reservaDraft, data); },
  getReserva() { return Store.get(DB_KEYS.reservaDraft, null); },
  clearReserva() { Store.remove(DB_KEYS.reservaDraft); },
  savePago(data) { Store.set(DB_KEYS.pagoDraft, data); },
  getPago() { return Store.get(DB_KEYS.pagoDraft, null); },
  clearPago() { Store.remove(DB_KEYS.pagoDraft); }
};

/* =========================================================
   Catálogos - export para uso en HTML
   ========================================================= */
const Catalog = {
  pistas() { return PISTAS; },
  pistaById(id) { return PISTAS.find(p => p.id === id) || null; },
  clases() { return CLASES; },
  galeria() { return GALERIA; },
  servicios() { return SERVICIOS; },
  planes() { return PLANES; },
  horarios() { return HORARIOS; },
  business() { return BUSINESS_INFO; }
};

/* =========================================================
   Reset (util)
   ========================================================= */
function resetDemo() {
  Store.clearAll();
  seedDatabase(true);
  console.info('Demo data reiniciada.');
  location.reload();
}

/* =========================================================
   Bootstrap inicial
   ========================================================= */
seedDatabase();