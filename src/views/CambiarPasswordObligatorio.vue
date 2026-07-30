<template>
  <div class="min-h-screen bg-[#fafaf9] flex items-center justify-center p-6 font-sans text-slate-800">
    <div class="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl border border-stone-100 p-10">

      <div class="text-center mb-8 mt-2">
        <div class="bg-blue-100 p-4 rounded-3xl mb-4 inline-block">
          <ShieldAlertIcon class="text-blue-600 w-10 h-10" />
        </div>
        <h1 class="text-2xl font-black tracking-tight text-slate-900">Actualiza tu contraseña</h1>
        <p class="text-stone-500 text-sm mt-2">Por seguridad, debes cambiar la contraseña temporal por una propia antes de continuar.</p>
      </div>

      <form @submit.prevent="guardarNuevaPassword" class="space-y-5">
        <div>
          <label class="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 block">Nueva Contraseña</label>
          <div class="relative">
            <input :type="mostrarP1 ? 'text' : 'password'" v-model="form.pass1" class="w-full bg-stone-50 border border-stone-200 text-stone-700 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-12" required minlength="8" />
            <button type="button" @click="mostrarP1 = !mostrarP1" class="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400">
              <EyeIcon v-if="!mostrarP1" class="w-5 h-5" />
              <EyeOffIcon v-else class="w-5 h-5" />
            </button>
          </div>

          <div class="mt-3 bg-stone-50 p-3 rounded-lg border border-stone-100">
            <p class="text-xs font-semibold text-stone-600 mb-1">Tu contraseña debe contener al menos:</p>
            <ul class="text-[11px] text-stone-500 list-disc pl-4 space-y-0.5 marker:text-stone-400">
              <li>8 caracteres en total</li>
              <li>Una letra mayúscula y una minúscula</li>
              <li>Un número</li>
              <li>Un carácter especial (@, $, !, %, *, ?, &, #)</li>
            </ul>
          </div>
        </div>

        <div>
          <label class="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 block">Confirmar Contraseña</label>
          <div class="relative">
            <input :type="mostrarP2 ? 'text' : 'password'" v-model="form.pass2" class="w-full bg-stone-50 border border-stone-200 text-stone-700 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-12" required minlength="8" />
            <button type="button" @click="mostrarP2 = !mostrarP2" class="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400">
              <EyeIcon v-if="!mostrarP2" class="w-5 h-5" />
              <EyeOffIcon v-else class="w-5 h-5" />
            </button>
          </div>
        </div>

        <button type="submit" :disabled="cargando" class="w-full py-4 mt-6 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors flex justify-center items-center gap-2">
          <Loader2Icon v-if="cargando" class="w-5 h-5 animate-spin" />
          <span v-else>Guardar e Ingresar</span>
        </button>
      </form>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { ShieldAlertIcon, EyeIcon, EyeOffIcon, Loader2Icon } from 'lucide-vue-next';

const router = useRouter();
const cargando = ref(false);
const mostrarP1 = ref(false);
const mostrarP2 = ref(false);

const usuarioLogueado = ref<any>(null);

const form = reactive({
  pass1: '',
  pass2: ''
});

onMounted(() => {
  const data = localStorage.getItem('usuario');
  if (data) {
    usuarioLogueado.value = JSON.parse(data);
  } else {
    router.push('/login');
  }
});

const guardarNuevaPassword = async () => {
  // 1. Validar que ambas contraseñas coincidan
  if (form.pass1 !== form.pass2) {
    Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
    return;
  }

  // 2. Validar que la contraseña sea fuerte (Regex)
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
  if (!passwordRegex.test(form.pass1)) {
    Swal.fire({
      title: 'Contraseña muy débil',
      text: 'Debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, un número y un símbolo especial (@$!%*?&#).',
      icon: 'warning',
      confirmButtonColor: '#f59e0b'
    });
    return;
  }

  cargando.value = true;
  try {
    const respuesta = await fetch(`/api/auth/${usuarioLogueado.value.id}/cambiar-password-obligatorio`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nuevaPassword: form.pass1 })
    });

    if (respuesta.ok) {
      usuarioLogueado.value.debeCambiarPassword = false;
      localStorage.setItem('usuario', JSON.stringify(usuarioLogueado.value));

      await Swal.fire({
        title: '¡Contraseña actualizada!',
        text: 'Tu cuenta ahora está segura.',
        icon: 'success',
        confirmButtonColor: '#059669'
      });

      if (usuarioLogueado.value.rol === 'ADMIN') router.push('/admin');
      else if (usuarioLogueado.value.rol === 'ONG') router.push('/ong');
      else router.push('/donante');

    } else {
      Swal.fire('Error', 'La contraseña no cumple con los requisitos de seguridad del servidor.', 'error');
    }
  } catch (error) {
    Swal.fire('Error', 'Falla de conexión con el servidor.', 'error');
  } finally {
    cargando.value = false;
  }
};
</script>