<template>
  <div class="min-h-screen bg-[#fafaf9] flex items-center justify-center p-6 font-sans text-slate-800">
    <div class="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-xl border border-stone-100 p-10 animate-in zoom-in-95 duration-500">

      <!-- BOTÓN VOLVER -->
      <button @click="irALogin" class="absolute top-6 left-6 p-2 text-stone-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-full transition-colors" title="Volver">
        <ArrowLeftIcon class="w-5 h-5" />
      </button>

      <!-- CABECERA -->
      <div class="text-center mb-8 mt-4">
        <div class="inline-flex items-center justify-center bg-emerald-100 p-4 rounded-full mb-4">
          <KeyRoundIcon class="w-8 h-8 text-emerald-700" />
        </div>
        <h1 class="text-2xl font-black tracking-tight text-emerald-900">Recuperar Contraseña</h1>
        <p class="text-stone-500 text-sm mt-2 leading-relaxed">
          Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecerla.
        </p>
      </div>

      <!-- FORMULARIO -->
      <form v-if="!enviado" @submit.prevent="procesarRecuperacion" class="space-y-6">
        <div>
          <label class="label-custom">Correo Electrónico</label>
          <div class="relative">
            <MailIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input v-model="email" type="email" placeholder="ejemplo@correo.cl" class="input-custom pl-12" required />
          </div>
        </div>

        <button type="submit" :disabled="cargando" class="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2">
          <Loader2Icon v-if="cargando" class="w-5 h-5 animate-spin" />
          <span v-else>Enviar enlace de recuperación</span>
        </button>
      </form>

      <!-- ESTADO DE ÉXITO -->
      <div v-else class="text-center py-6 animate-in fade-in duration-500">
        <p class="text-emerald-700 font-bold mb-2">¡Solicitud enviada!</p>
        <p class="text-sm text-stone-500 mb-6">Si existe una cuenta asociada a <strong>{{ email }}</strong>, recibirás un correo en breve con las instrucciones.</p>
        <button @click="irALogin" class="w-full py-3 bg-stone-100 text-stone-700 font-bold rounded-xl hover:bg-stone-200 transition-colors">
          Volver al Inicio de Sesión
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowLeftIcon, MailIcon, Loader2Icon, KeyRoundIcon } from 'lucide-vue-next';

const router = useRouter();
const email = ref('');
const cargando = ref(false);
const enviado = ref(false);

const procesarRecuperacion = async () => {
  if (!email.value) return;
  cargando.value = true;
  try {
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value })
    });
    // Even if it fails, we show success to avoid email enumeration attacks
    enviado.value = true;
  } catch (error) {
    console.error(error);
  } finally {
    cargando.value = false;
  }
};

const irALogin = () => {
  router.push('/login');
};
</script>