# Padel Premium Club · Sistema de Reservas

Template completo de sistema de reservas para un club de pádel, construido en **HTML + Tailwind CSS (CDN) + JavaScript nativo** sin frameworks ni build step.

---

## Descripción

Padel Premium Club es un sistema web responsive que permite a los usuarios explorar pistas (cristal, panorámica, indoor pro y outdoor), reservar sesiones, gestionar pagos y mantener un historial completo de sus reservas. Incluye autenticación completa, perfiles editables, gestión de métodos de pago y flujo de pago simulado.

---

## Stack técnico

| Capa | Tecnología |
|---|---|
| Estructura | HTML5 semántico |
| Estilos | Tailwind CSS v3 (CDN) + CSS personalizado |
| Lógica | JavaScript vanilla (ES2020+), sin dependencias |
| Persistencia | `localStorage` (namespace `padel_*`) |
| Iconos | SVG inline |
| Tipografías | Google Fonts: Inter |
| Imágenes | Unsplash CDN |

---

## Estructura de archivos

```
padel-01/
├── index.html                       # Pantalla de inicio
├── pages/
│   ├── servicios.html               # Nuestros servicios
│   ├── reserva.html                 # Wizard de reserva (4 pasos)
│   ├── confirmacion.html            # Confirmación de cita
│   ├── pago.html                    # Pago de reserva (4 métodos)
│   ├── pago-confirmado.html         # Recibo imprimible
│   ├── perfil.html                  # Mi perfil + historial
│   ├── detalle-reserva.html         # Detalle de reserva + anular
│   ├── galeria.html                 # Galería con lightbox
│   ├── clases.html                  # Horario de clases
│   ├── precios.html                 # Tarifas y planes
│   ├── contacto.html                # Formulario + mapa + horarios
│   ├── login.html                   # Inicio de sesión
│   ├── registro.html                # Crear cuenta
│   ├── recuperar.html               # Recuperar contraseña
│   ├── terminos.html                # Términos y condiciones
│   └── privacidad.html              # Política de privacidad
├── assets/
│   ├── css/
│   │   └── styles.css               # Variables, animaciones, componentes
│   └── js/
│       ├── data.js                  # Mock data + APIs dominio + storage
│       ├── ui.js                    # Navbar, footer, toasts, iconos
│       ├── auth.js                  # Lógica de autenticación
│       ├── reservas.js              # Lógica de reservas (CRUD + wizard)
│       ├── pago.js                  # Validación tarjeta + 4 métodos
│       └── app.js                   # Bootstrap + handlers por página
└── README.md
```

---

## Cómo abrir el proyecto

No requiere instalación ni servidor. Simplemente abre `index.html` en cualquier navegador moderno.

```bash
# Opción 1: doble clic sobre index.html
# Opción 2: servidor local (recomendado para algunas funciones)
cd padel-01
python -m http.server 8000
# Luego abre http://localhost:8000
```

---

## Cuentas de demostración

El sistema crea automáticamente datos de prueba en el primer acceso:

| Email | Contraseña | Reservas precargadas |
|---|---|---|
| `demo@padel.com` | `123456` | Cristal (confirmada + pagada), Panorámica (completada), Indoor Pro (pendiente pago), Outdoor #1 (confirmada), Outdoor #2 (cancelada) |
| `admin@padel.com` | `admin123` | Sin reservas precargadas |

Para resetear todos los datos: abre DevTools (F12) → Application → Local Storage → elimina las claves `padel_*`.

---

## Flujo end-to-end

```
Inicio → [Login / Registro] → Reserva (wizard 4 pasos)
  → Confirmación de cita → [Pago] → Confirmación de pago
  → Perfil → Detalle reserva → [Anular cita]
  → Contacto / Galería / Clases / Precios (libres)
```

### Wizard de reserva (4 pasos)

1. **Pista**: elige pista (cristal, panorámica, indoor pro, outdoor, dobles plus)
2. **Fecha y horario**: día + duración (1-3 horas) + slots dinámicos
3. **Confirmación**: notas opcionales + resumen
4. **Finalizar**: confirmación final del wizard

### Métodos de pago (simulados)

- **Tarjeta**: validación Luhn + vencimiento + CVV + detección de marca (Visa, Mastercard, AMEX, Discover)
- **Yape**: número de operación (8-10 dígitos) + celular
- **Transferencia**: número de operación (8-12 dígitos) + banco origen
- **Efectivo**: pago en recepción

---

## Modelo de datos (localStorage)

```js
padel_users         // Usuarios registrados
padel_session       // Sesión activa
padel_reservas      // Reservas con estados
padel_pagos         // Pagos realizados
padel_reserva_draft // Borrador durante el wizard
padel_pago_draft    // Datos del pago actual
padel_contact_messages // Mensajes del formulario de contacto
```

### Estados de reserva

| Estado | Descripción |
|---|---|
| `confirmada` | Reserva activa con pago o por pagar |
| `pendiente` | Reserva sin pago registrado |
| `completada` | Sesión ya jugada |
| `cancelada` | Anulada por el usuario |

---

## Funcionalidades clave

- **Auth completo**: login, registro, recuperación, edición de perfil, cambio de contraseña, logout
- **Reservas con wizard** de 4 pasos y slots dinámicos (bloquea ocupado + detecta solapamiento por duración)
- **Validación de tarjeta** con algoritmo Luhn
- **Gestión de historial** con filtros (todas / próximas / pendientes / completadas / canceladas)
- **Anular citas** con modal de confirmación (requiere 24h de anticipación)
- **Galería con lightbox** y navegación por teclado (Esc, flechas)
- **Horarios semanales** con filtros por nivel
- **Comparativa de precios** con toggle mensual / anual (-15% en anual)
- **Recibo imprimible** (compatible con `window.print()`)
- **Validación de formularios** y feedback con toasts
- **100% responsive** mobile-first

---

## Datos seed (primer load)

### Usuarios
- Sebastián Castro · `demo@padel.com` · 123456
- Administrador · `admin@padel.com` · admin123

### Pistas (6)
- Pista Cristal · Cubierta · S/. 80/h
- Pista Panorámica · Cubierta · S/. 90/h
- Pista Indoor Pro · Cubierta premium · S/. 100/h
- Pista Dobles Plus · Cubierta · S/. 110/h
- Pista Outdoor #1 · Descubierta · S/. 60/h
- Pista Outdoor #2 · Descubierta · S/. 60/h

### Clases (6)
- Escuela Infantil (Lun/Mié/Vie 16:00), Tecnificación Juvenil (Mar/Jue 17:00), Pádel Adultos Iniciación (Lun/Mié/Vie 20:00), Pádel Femenino (Mar/Jue 18:00), Entrenamiento Avanzado (Mar/Jue/Sáb 19:30), Pádel Senior (Lun/Mié 09:00).

### Planes (3)
- Básico (S/. 199/mes), Pro Pádel (S/. 449/mes, destacado), Elite (S/. 749/mes).

---

## Personalización

### Colores

Edita las variables en `assets/css/styles.css`:

```css
:root {
  --primary: #84cc16;          /* verde lima principal */
  --primary-dark: #65a30d;
  --primary-light: #a3e635;
  --secondary: #0f172a;        /* gris oscuro navbar/footer */
  --accent: #facc15;           /* amarillo destacado */
}
```

O directamente en los HTML usando clases Tailwind `lime-*` y `green-*`.

### Contenido

- **Pistas**: array `PISTAS` en `assets/js/data.js`
- **Clases**: array `CLASES`
- **Planes**: array `PLANES`
- **Horarios**: array `HORARIOS`
- **Business info**: constante `BUSINESS_INFO`

### Textos y copy

Edita directamente cada HTML. Todas las páginas comparten el mismo navbar y footer, generados dinámicamente por `assets/js/ui.js` desde las funciones `UI.renderNavbar()` y `UI.renderFooter()`.

---

## Compatibilidad

Probado en navegadores modernos:

- Chrome / Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

No requiere polyfills. Usa `localStorage`, `IntersectionObserver` y `fetch` (ninguno crítico para el funcionamiento base).

---

## Licencia

Template de uso libre. Las imágenes provienen de [Unsplash](https://unsplash.com) y están sujetas a sus respectivas licencias.