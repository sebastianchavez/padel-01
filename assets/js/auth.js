/**
 * auth.js
 * Handlers de autenticación: login, registro, recuperación, perfil.
 */

const Auth = {
  p() { return UI.prefix(); },

  bindLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = form.email.value.trim();
      const password = form.password.value;
      const remember = form.remember?.checked ?? false;

      if (!UI.isValidEmail(email)) {
        UI.toast('Ingresa un correo válido.', 'error');
        return;
      }
      if (!password) {
        UI.toast('Ingresa tu contraseña.', 'error');
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner"></span> Verificando...';

      try {
        const user = Session.login(email, password, remember);
        UI.toast(`Bienvenido, ${user.name.split(' ')[0]}`, 'success');
        setTimeout(() => location.href = `${this.p()}pages/perfil.html`, 700);
      } catch (err) {
        UI.toast(err.message, 'error');
        btn.disabled = false;
        btn.innerHTML = 'Iniciar sesión';
      }
    });
  },

  bindRegisterForm() {
    const form = document.getElementById('registerForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const phone = form.phone.value.trim();
      const dni = form.dni.value.trim();
      const password = form.password.value;
      const password2 = form.password2.value;
      const accept = form.acceptTerms?.checked;

      if (name.length < 3) { UI.toast('Ingresa tu nombre completo.', 'error'); return; }
      if (!UI.isValidEmail(email)) { UI.toast('Correo inválido.', 'error'); return; }
      if (!UI.isValidPhone(phone)) { UI.toast('Teléfono inválido (7-15 dígitos).', 'error'); return; }
      if (dni && !UI.isValidDNI(dni)) { UI.toast('DNI inválido.', 'error'); return; }
      if (password.length < 6) { UI.toast('La contraseña debe tener al menos 6 caracteres.', 'error'); return; }
      if (password !== password2) { UI.toast('Las contraseñas no coinciden.', 'error'); return; }
      if (!accept) { UI.toast('Debes aceptar los términos y condiciones.', 'error'); return; }

      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner"></span> Creando cuenta...';

      try {
        const user = Users.create({ name, email, phone, dni, password });
        Session.login(user.email, password);
        UI.toast('Cuenta creada con éxito', 'success');
        setTimeout(() => location.href = `${this.p()}pages/perfil.html`, 700);
      } catch (err) {
        UI.toast(err.message, 'error');
        btn.disabled = false;
        btn.innerHTML = 'Crear cuenta';
      }
    });
  },

  bindRecoverForm() {
    const form = document.getElementById('recoverForm');
    if (!form) return;
    const step1 = document.getElementById('recoverStep1');
    const step2 = document.getElementById('recoverStep2');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = form.email.value.trim();
      if (!UI.isValidEmail(email)) { UI.toast('Correo inválido.', 'error'); return; }

      const user = Users.findByEmail(email);
      if (!user) {
        UI.toast('No encontramos una cuenta con ese correo.', 'error');
        return;
      }

      step1.classList.add('hidden');
      step2.classList.remove('hidden');
      step2.querySelector('[data-email]').textContent = email;
    });
  },

  bindProfileForm() {
    const form = document.getElementById('profileForm');
    if (!form) return;
    const user = Session.current();
    if (!user) return;

    form.name.value = user.name || '';
    form.email.value = user.email || '';
    form.phone.value = user.phone || '';
    form.dni.value = user.dni || '';

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const phone = form.phone.value.trim();
      const dni = form.dni.value.trim();

      if (name.length < 3) { UI.toast('Nombre muy corto.', 'error'); return; }
      if (!UI.isValidEmail(email)) { UI.toast('Correo inválido.', 'error'); return; }
      if (!UI.isValidPhone(phone)) { UI.toast('Teléfono inválido.', 'error'); return; }
      if (dni && !UI.isValidDNI(dni)) { UI.toast('DNI inválido.', 'error'); return; }

      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner"></span> Guardando...';

      try {
        Users.update(user.id, { name, email, phone, dni });
        UI.toast('Perfil actualizado', 'success');
        btn.disabled = false;
        btn.innerHTML = 'Guardar cambios';
        setTimeout(() => location.reload(), 600);
      } catch (err) {
        UI.toast(err.message, 'error');
        btn.disabled = false;
        btn.innerHTML = 'Guardar cambios';
      }
    });
  },

  bindPasswordForm() {
    const form = document.getElementById('passwordForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const currentPassword = form.currentPassword.value;
      const newPassword = form.newPassword.value;
      const confirmPassword = form.confirmPassword.value;
      const user = Session.current();

      if (!currentPassword || !newPassword || !confirmPassword) {
        UI.toast('Completa todos los campos.', 'error');
        return;
      }
      if (newPassword !== confirmPassword) {
        UI.toast('Las contraseñas nuevas no coinciden.', 'error');
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner"></span> Actualizando...';

      try {
        Users.updatePassword(user.id, currentPassword, newPassword);
        UI.toast('Contraseña actualizada', 'success');
        form.reset();
        btn.disabled = false;
        btn.innerHTML = 'Cambiar contraseña';
      } catch (err) {
        UI.toast(err.message, 'error');
        btn.disabled = false;
        btn.innerHTML = 'Cambiar contraseña';
      }
    });
  }
};