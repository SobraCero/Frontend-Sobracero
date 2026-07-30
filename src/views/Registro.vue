<template>
  <div class="h-screen flex font-sans text-slate-800 overflow-hidden">

    <div class="hidden lg:block lg:w-1/2 relative h-full">
      <img src="/images/retiro-ong.jpg" alt="Comunidad SobraCero" class="absolute inset-0 w-full h-full object-cover" />
      <div class="absolute inset-0 bg-emerald-950/60 mix-blend-multiply"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/40 to-transparent"></div>
    </div>

    <div class="w-full lg:w-1/2 bg-white overflow-y-auto relative h-full">

      <div class="min-h-full flex flex-col justify-center p-8 lg:p-16">

        <button @click="irAtras" class="absolute top-6 left-6 p-2 text-stone-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-full transition-colors z-10 bg-slate-50 lg:bg-transparent" title="Volver a la página anterior">
          <ArrowLeftIcon class="w-5 h-5" />
        </button>

        <div class="w-full max-w-xl mx-auto animate-in slide-in-from-bottom-8 duration-500 mt-12 lg:mt-0">
          <div class="text-center mb-8 mt-2">
            <h1 class="text-3xl font-black tracking-tight text-primary-900">Únete a SobraCero</h1>
            <p class="text-base-500 text-sm mt-2">Selecciona tu perfil para comenzar tu solicitud</p>
          </div>

          <div class="flex p-1 bg-base-100 rounded-2xl mb-8">
            <button @click="form.rol = 'donante'" :class="tabClass(form.rol === 'donante')" class="flex-1 py-3 text-sm font-bold rounded-xl transition-all">
              Soy Donante (Local/Empresa)
            </button>
            <button @click="form.rol = 'ong'" :class="tabClass(form.rol === 'ong')" class="flex-1 py-3 text-sm font-bold rounded-xl transition-all">
              Soy Receptor (ONG)
            </button>
          </div>

          <form @submit.prevent="procesarRegistro" class="space-y-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div class="md:col-span-2">
                <label class="label-custom">{{ form.rol === 'donante' ? 'Nombre del Local o Empresa' : 'Nombre de la ONG' }}</label>
                <input v-model="form.nombre" type="text" class="input-custom" required />
              </div>

              <div v-if="form.rol === 'ong'">
                <label class="label-custom">RUT Institucional</label>
                <input v-model="form.rut" type="text" placeholder="Ej: 65.123.456-7" class="input-custom" required />
              </div>

              <div>
                <label class="label-custom">Correo Electrónico</label>
                <input v-model="form.email" type="email" class="input-custom" required />
              </div>

              <div>
                <label class="label-custom">Teléfono de Contacto</label>
                <input v-model="form.telefono" type="tel" class="input-custom" required />
              </div>

              <!-- CAMPO DIRECCIÓN CON AUTOCOMPLETADO INTEGRADO -->
              <div class="md:col-span-2 relative">
                <label class="label-custom">Dirección Principal</label>
                <input
                    v-model="form.direccion"
                    @input="buscarDirecciones(form.direccion)"
                    @blur="mostrarSugerencias = false"
                    type="text"
                    placeholder="Busca calle, número, comuna..."
                    class="input-custom"
                    required
                    autocomplete="off"
                />
                <ul v-if="mostrarSugerencias" class="absolute z-50 w-full bg-white border border-stone-200 rounded-xl mt-1 shadow-lg max-h-48 overflow-y-auto">
                  <li
                      v-for="(sug, index) in sugerencias"
                      :key="index"
                      @mousedown.prevent="seleccionarDireccion(sug)"
                      class="px-4 py-3 hover:bg-emerald-50 cursor-pointer text-sm text-stone-700 border-b border-stone-100 last:border-0 transition-colors"
                  >
                    {{ formatearDireccion(sug) }}
                  </li>
                </ul>
              </div>

              <div v-if="form.rol === 'ong'">
                <label class="label-custom">Nombre del Responsable</label>
                <input v-model="form.nombreResponsable" type="text" class="input-custom" required />
              </div>

              <div v-if="form.rol === 'ong'">
                <label class="label-custom">Cargo del Responsable</label>
                <input v-model="form.cargoResponsable" type="text" class="input-custom" required />
              </div>

              <div v-if="form.rol === 'ong'" class="md:col-span-2 p-5 bg-stone-50 rounded-2xl border border-stone-200">
                <label class="label-custom">Documento de Acreditación (PDF)</label>
                <p class="text-xs text-stone-500 mb-3">Requerido para que el Administrador valide tu organización.</p>
                <input type="file" accept=".pdf" @change="capturarArchivo" class="block w-full text-sm text-base-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-primary-100 file:text-primary-700 hover:file:bg-primary-200 transition-all cursor-pointer" required />
              </div>
            </div>

            <BaseButton type="submit" block size="lg" rounded="2xl" :loading="cargando">
              Solicitar Ingreso
            </BaseButton>
          </form>

          <div class="mt-8 text-center">
            <p class="text-sm text-base-500">¿Ya tienes cuenta aprobada? <a href="#" @click.prevent="irALogin" class="font-bold text-primary-700 hover:underline">Inicia Sesión</a></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '../components/ui/BaseButton.vue';
import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Swal from 'sweetalert2';
import { Loader2Icon, ArrowLeftIcon } from 'lucide-vue-next';

const router = useRouter();
const route = useRoute();

const cargando = ref(false);
const archivoDocumento = ref<File | null>(null);

// ---- ESTADOS PARA EL AUTOCOMPLETADO DE DIRECCIÓN ----
const sugerencias = ref<any[]>([]);
const mostrarSugerencias = ref(false);
let timeout: any = null;

const form = reactive({
  rol: (route.query.rol as string) || 'donante',
  nombre: '',
  email: '',
  telefono: '',
  direccion: '',
  rut: '',
  nombreResponsable: '',
  cargoResponsable: ''
});

const tabClass = (activo: boolean) =>
    activo ? 'bg-white text-primary-700 shadow-sm' : 'text-base-500 hover:text-base-700';

const capturarArchivo = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    archivoDocumento.value = target.files[0] || null;
  }
};

// ---- LÓGICA DE BÚSQUEDA DE DIRECCIONES (PHOTON API) ----
const buscarDirecciones = (query: string) => {
  if (timeout) clearTimeout(timeout);

  if (!query || query.length < 3) {
    sugerencias.value = [];
    mostrarSugerencias.value = false;
    return;
  }

  timeout = setTimeout(async () => {
    try {
      const response = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query + ', Chile')}&limit=5`);
      if (response.ok) {
        const data = await response.json();
        sugerencias.value = data.features;
        mostrarSugerencias.value = data.features.length > 0;
      }
    } catch (error) {
      console.error('Error buscando direcciones:', error);
    }
  }, 300);
};

const formatearDireccion = (feature: any) => {
  const p = feature.properties;
  const partes = [];

  if (p.street) partes.push(`${p.street} ${p.housenumber || ''}`.trim());
  else if (p.name) partes.push(p.name);

  if (p.city || p.town) partes.push(p.city || p.town);
  if (p.state) partes.push(p.state);

  return partes.join(', ');
};

const seleccionarDireccion = (sug: any) => {
  form.direccion = formatearDireccion(sug);
  mostrarSugerencias.value = false;
};
// --------------------------------------------------------

const procesarRegistro = async () => {
  cargando.value = true;

  try {
    const formData = new FormData();
    formData.append('email', form.email);
    formData.append('rol', form.rol.toUpperCase());
    formData.append('razonSocial', form.nombre);
    formData.append('telefono', form.telefono);

    if (form.direccion) {
      formData.append('direccion', form.direccion);
    }

    if (form.rol === 'ong') {
      formData.append('rut', form.rut);
      // Comuna y Región han sido removidos del form
      formData.append('nombreResponsable', form.nombreResponsable);
      formData.append('cargoResponsable', form.cargoResponsable);

      if (archivoDocumento.value) {
        formData.append('documento', archivoDocumento.value);
      }
    }

    const respuesta = await fetch("/api/auth/registro", {
      method: "POST",
      body: formData,
    });

    if (respuesta.ok) {
      await Swal.fire({
        title: '¡Solicitud Enviada!',
        text: 'Un administrador revisará tus datos. Te notificaremos cuando tu cuenta sea aprobada.',
        icon: 'success',
        confirmButtonColor: '#059669',
        confirmButtonText: 'Entendido'
      });
      router.push('/login');
    } else {
      const errorText = await respuesta.text();
      console.error("El backend rechazó los datos:", respuesta.status, errorText);

      Swal.fire({
        title: 'Error al enviar solicitud',
        text: errorText || 'Por favor, verifica tus datos e intenta nuevamente.',
        icon: 'error',
        confirmButtonColor: '#059669'
      });
    }
  } catch (error) {
    console.error("Error de conexión:", error);

    Swal.fire({
      title: 'Error de conexión',
      text: 'No se pudo conectar con el servidor. Intenta más tarde.',
      icon: 'error',
      confirmButtonColor: '#059669'
    });
  } finally {
    cargando.value = false;
  }
};

const irALogin = () => router.push('/login');
const irAtras = () => router.back();
</script>