<template>
 <div class="min-h-screen flex font-sans text-slate-800">

   <div class="hidden md:block md:w-1/2 relative">
     <img src="/images/entrega-alimentos.jpg" alt="Sobra Cero" class="absolute inset-0 w-full h-full object-cover" />
     <!-- Overlay oscuro verdoso -->
     <div class="absolute inset-0 bg-emerald-950/60 mix-blend-multiply"></div>
     <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/40 to-transparent"></div>
   </div>

   <div class="w-full md:w-1/2 bg-white flex flex-col justify-center p-8 lg:p-16 relative">

     <button @click="irALanding" class="absolute top-6 left-6 p-2 text-stone-400 hover:text-emerald-700 rounded-full bg-slate-50 md:bg-transparent z-10 transition-colors">
       <ArrowLeftIcon class="w-5 h-5" />
     </button>

     <div class="w-full max-w-sm mx-auto">
       <div class="flex flex-col items-center mb-10 mt-2">
       <img src="/logo-sobra-cero.png" alt="SobraCero" class="h-28 w-auto object-contain mb-2" />
       <h1 class="text-3xl font-black tracking-tight text-emerald-900">Iniciar sesión</h1>
     </div>


     <form v-if="!mostrarOtp" @submit.prevent="procesarLogin" class="space-y-5">
       <div>
         <label class="label-custom">Correo Electrónico</label>
         <input v-model="form.email" type="email" class="input-custom" required />
       </div>


       <div>
         <label class="label-custom">Contraseña</label>
         <div class="relative">
           <input :type="mostrarPassword ? 'text' : 'password'" v-model="form.password" class="input-custom pr-12" required />
           <button type="button" @click="mostrarPassword = !mostrarPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-emerald-600">
             <EyeIcon v-if="!mostrarPassword" class="w-5 h-5" />
             <EyeOffIcon v-else class="w-5 h-5" />
           </button>
         </div>
       </div>


       <div class="flex justify-end">
         <button type="button" @click="irARecuperar" class="text-[11px] font-bold text-emerald-600 uppercase">¿Olvidaste tu contraseña?</button>
       </div>


       <button type="submit" :disabled="cargando" class="w-full py-4 bg-emerald-700 text-white font-bold rounded-2xl hover:bg-emerald-800">
         {{ cargando ? 'Cargando...' : 'Iniciar Sesión' }}
       </button>
     </form>


     <form v-else @submit.prevent="verificarOtp" class="space-y-5">
       <div class="text-center mb-4">
         <p class="text-sm text-stone-600">Hemos enviado un código de seguridad a tu correo: <b>{{ form.email }}</b></p>
       </div>
       <div>
         <label class="label-custom">Código OTP</label>
         <input v-model="otp" type="text" class="input-custom text-center text-xl tracking-widest" required placeholder="123456" />
       </div>
       <button type="submit" :disabled="cargando" class="w-full py-4 bg-emerald-700 text-white font-bold rounded-2xl hover:bg-emerald-800">
         {{ cargando ? 'Verificando...' : 'Verificar Código' }}
       </button>
       <div class="text-center mt-4">
         <button type="button" @click="mostrarOtp = false" class="text-sm font-bold text-emerald-700 hover:underline">Volver</button>
       </div>
     </form>


     <div class="mt-8 text-center" v-if="!mostrarOtp">
       <p class="text-sm text-stone-500">¿No tienes cuenta? <a href="#" @click.prevent="irARegistro" class="font-bold text-emerald-700 hover:underline">Regístrate aquí</a></p>
     </div>
     </div>
   </div>
 </div>
</template>


<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { ArrowLeftIcon, LeafIcon, EyeIcon, EyeOffIcon, Loader2Icon } from 'lucide-vue-next';


const router = useRouter();
const mostrarPassword = ref(false);
const cargando = ref(false);
const mostrarOtp = ref(false);
const otp = ref('');
const form = reactive({ email: '', password: '' });


const procesarLogin = async () => {
 cargando.value = true;
 try {
   const respuesta = await fetch('/api/auth/login', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ email: form.email, password: form.password })
   });


   if (respuesta.ok) {
     const data = await respuesta.json();
    
     if (data.requiereOtp) {
       mostrarOtp.value = true;
       Swal.fire('Código enviado', data.mensaje || 'Revisa tu correo para obtener el código.', 'success');
     } else {
       guardarYRedirigir(data);
     }
   } else {
     const errorText = await respuesta.text();
     Swal.fire('Acceso Denegado', errorText || 'Credenciales incorrectas o cuenta no aprobada.', 'error');
   }
 } catch (error) {
   console.error(error);
   Swal.fire('Error de conexión', 'No se pudo conectar con el servidor.', 'error');
 } finally {
   cargando.value = false;
 }
};


const verificarOtp = async () => {
 cargando.value = true;
 try {
   const respuesta = await fetch('/api/auth/verify-otp', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ email: form.email, otp: otp.value })
   });


   if (respuesta.ok) {
     const data = await respuesta.json();
     guardarYRedirigir(data);
   } else {
     const errorText = await respuesta.text();
     Swal.fire('Error', errorText || 'Código OTP inválido o expirado.', 'error');
   }
 } catch (error) {
   console.error(error);
   Swal.fire('Error de conexión', 'No se pudo conectar con el servidor.', 'error');
 } finally {
   cargando.value = false;
 }
};


const guardarYRedirigir = (data: any) => {
 localStorage.setItem('token', data.token);
 localStorage.setItem('usuario', JSON.stringify(data.usuario));


 if (data.usuario.debeCambiarPassword) {
   router.push('/cambiar-password-obligatorio');
 } else {
   if (data.usuario.rol === 'ADMIN') router.push('/admin');
   else if (data.usuario.rol === 'ONG') router.push('/ong');
   else router.push('/donante');
 }
};


const irARegistro = () => router.push('/registro');
const irARecuperar = () => router.push('/recuperar-password');
const irALanding = () => router.push('/');
</script>