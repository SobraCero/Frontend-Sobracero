<template>
  <div class="min-h-screen bg-[#fafaf9] flex items-center justify-center p-6 font-sans text-slate-800">
    <div class="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-xl border border-stone-100 p-10 animate-in zoom-in-95 duration-500">

      <div class="text-center mb-8 mt-4">
        <div class="inline-flex items-center justify-center bg-emerald-100 p-4 rounded-full mb-4">
          <KeyRoundIcon class="w-8 h-8 text-emerald-700" />
        </div>
        <h1 class="text-2xl font-black tracking-tight text-emerald-900">Crear Nueva Contraseña</h1>
        <p class="text-stone-500 text-sm mt-2 leading-relaxed">
          Ingresa tu nueva contraseña para acceder a tu cuenta.
        </p>
      </div>

      <form v-if="!exito" @submit.prevent="restablecerPassword" class="space-y-6">
        <div>
          <label class="label-custom font-bold text-xs text-stone-500 uppercase tracking-wider mb-2 block">Nueva Contraseña</label>
          <div class="relative">
            <LockIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input v-model="nuevaPassword" type="password" placeholder="Min. 6 caracteres" class="w-full px-4 py-3 pl-12 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none text-stone-700" required minlength="6" />
          </div>
        </div>
        <div>
          <label class="label-custom font-bold text-xs text-stone-500 uppercase tracking-wider mb-2 block">Confirmar Contraseña</label>
          <div class="relative">
            <LockIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input v-model="confirmarPassword" type="password" placeholder="Repite la contraseña" class="w-full px-4 py-3 pl-12 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none text-stone-700" required />
          </div>
        </div>

        <button type="submit" :disabled="cargando" class="w-full py-4 bg-emerald-700 text-white font-bold rounded-2xl hover:bg-emerald-800 shadow-lg shadow-emerald-700/20 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2">
          <Loader2Icon v-if="cargando" class="w-5 h-5 animate-spin" />
          <span v-else>Guardar Contraseña</span>
        </button>
      </form>

      <div v-else class="text-center py-6 animate-in fade-in duration-500">
        <p class="text-emerald-700 font-bold mb-2">¡Contraseña Restablecida!</p>
        <p class="text-sm text-stone-500 mb-6">Tu contraseña ha sido actualizada con éxito.</p>
        <button @click="irALogin" class="w-full py-3 bg-stone-100 text-stone-700 font-bold rounded-xl hover:bg-stone-200 transition-colors">
          Ir a Iniciar Sesión
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Swal from 'sweetalert2';
import { LockIcon, Loader2Icon, KeyRoundIcon } from 'lucide-vue-next';

const router = useRouter();
const route = useRoute();

const token = ref('');
const nuevaPassword = ref('');
const confirmarPassword = ref('');
const cargando = ref(false);
const exito = ref(false);

onMounted(() => {
  if (route.query.token) {
    token.value = route.query.token as string;
    router.replace({ path: '/restablecer-password', query: {} });
  } else {
    Swal.fire('Enlace inválido', 'No se ha detectado el token de seguridad.', 'error');
    router.push('/login');
  }
});

const restablecerPassword = async () => {
  if (nuevaPassword.value !== confirmarPassword.value) {
    Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
    return;
  }

  cargando.value = true;
  try {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        token: token.value, 
        nuevaPassword: nuevaPassword.value 
      })
    });

    if (response.ok) {
      exito.value = true;
    } else {
      const data = await response.json();
      Swal.fire('Error', data.error || data.mensaje || 'Enlace expirado o inválido', 'error');
    }
  } catch (error) {
    console.error(error);
    Swal.fire('Error', 'Problema de conexión con el servidor', 'error');
  } finally {
    cargando.value = false;
  }
};

const irALogin = () => {
  router.push('/login');
};
</script>
