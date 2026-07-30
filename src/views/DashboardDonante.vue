<template>
  <div class="min-h-screen bg-[#fafaf9] flex flex-col text-slate-800 font-sans">
    <nav class="bg-white border-b border-stone-200 sticky top-0 z-40 px-6 py-3 flex items-center justify-between shadow-sm">
      <div class="flex items-center gap-2 cursor-pointer" @click="seccion = 'mis-donaciones'">
        <img src="/logo-sobra-cero.png" alt="SobraCero" class="h-8 w-auto object-contain hover:rotate-12 transition-transform" />
        <h1 class="text-xl font-black tracking-tight text-emerald-900 hidden sm:block">SobraCero</h1>
      </div>

      <div class="hidden md:flex items-center gap-1 bg-stone-50 p-1 rounded-xl border border-stone-100">
        <button @click="seccion = 'mis-donaciones'" :class="navClass(seccion === 'mis-donaciones')">Mis Donaciones</button>
        <button @click="seccion = 'historial'" :class="navClass(seccion === 'historial')">Historial</button>
        <button @click="seccion = 'publicar'" :class="navClass(seccion === 'publicar')">Publicar Alimento</button>
      </div>

      <div class="flex items-center gap-3">
        <img :src="perfil.foto" @click="abrirConfiguracion" class="w-10 h-10 rounded-full object-cover border border-stone-200 cursor-pointer shadow-sm hover:shadow-md transition-shadow" title="Configurar Cuenta" />
        <div class="text-left hidden sm:block">
          <p class="text-sm font-bold text-stone-900 leading-tight">{{ perfil.nombre }}</p>
          <button @click="cerrarSesion" class="text-[11px] text-stone-500 hover:text-red-600 font-medium flex items-center gap-1 mt-0.5 transition-colors">
            Cerrar Sesión <LogOutIcon class="w-3 h-3" />
          </button>
        </div>
      </div>
    </nav>

    <main class="flex-1 flex flex-col">
      <div v-if="seccion !== 'publicar'" class="relative overflow-hidden rounded-[2rem] mx-4 sm:mx-8 mt-6 mb-6 shadow-xl">
        <div class="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900"></div>
        <div class="absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-500/20 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/3"></div>
        <div class="absolute bottom-0 left-0 w-[300px] h-[300px] bg-teal-500/20 rounded-full blur-[60px] translate-y-1/3 -translate-x-1/3"></div>

        <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(rgba(255, 255, 255, 0.4) 2px, transparent 2px); background-size: 30px 30px;"></div>

        <div class="max-w-7xl mx-auto px-6 sm:px-10 py-10 sm:py-12 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div class="max-w-xl text-center lg:text-left">
            <h2 class="text-3xl sm:text-4xl font-black mb-3 text-white leading-tight tracking-tight">
              Hola, <span class="text-emerald-400">{{ perfil.nombre }}</span>
            </h2>
            <p class="text-emerald-100/90 text-base sm:text-lg font-medium leading-relaxed">
              Supervisa tus aportes, gestiona tu inventario solidario y descubre el impacto directo que generas en la comunidad.
            </p>
          </div>
        </div>
      </div>

      <section v-if="seccion === 'publicar'" class="w-full flex-1 bg-white flex flex-col lg:flex-row shadow-sm">

        <div class="hidden lg:block lg:w-1/2 relative bg-emerald-900 overflow-hidden">
          <img src="/images/entrega-alimentos.jpg" alt="Donación" class="absolute inset-0 w-full h-full object-cover" />
          <div class="absolute inset-0 bg-emerald-600/15 mix-blend-multiply pointer-events-none"></div>
        </div>

        <div class="lg:w-1/2 p-8 lg:p-12 xl:p-16 bg-white flex flex-col justify-start items-center pt-10 lg:pt-16">
          <div class="w-full max-w-xl">
            <header class="mb-8 text-center w-full">
              <h2 class="text-3xl lg:text-4xl font-black text-stone-900 mb-2 inline-block border-b-[5px] border-emerald-600 pb-2">
                {{ donacionEditandoId ? 'Editar Alimento' : 'Publicar Alimento' }}
              </h2>
            </header>

            <form @submit.prevent="crearDonacion" class="space-y-6 flex-1 flex flex-col">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-bold text-stone-600 mb-2">Tipo de Alimento *</label>
                  <input v-model="form.tipo" type="text" placeholder="Ej: Pan artesanal" class="w-full px-4 py-3 bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-stone-800 shadow-sm" required />
                </div>
                <div>
                  <label class="block text-sm font-bold text-stone-600 mb-2">Cantidad (Kilos o Porciones) *</label>
                  <input v-model="form.kilos" type="number" step="1" min="1" class="w-full px-4 py-3 bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-stone-800 shadow-sm" required />
                </div>
                <div>
                  <label class="block text-sm font-bold text-stone-600 mb-2">Fecha de Vencimiento *</label>
                  <input
                      v-model="form.vencimiento"
                      type="date"
                      :min="fechaMinima"
                      class="w-full px-4 py-3 bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-stone-800 shadow-sm"
                      required
                  />
                </div>

                <div class="relative">
                  <label class="block text-sm font-bold text-stone-600 mb-2">Ubicación del Local *</label>
                  <input
                      v-model="form.ubicacion"
                      @input="buscarDirecciones(form.ubicacion)"
                      @blur="mostrarSugerencias = false"
                      type="text"
                      placeholder="Dirección completa"
                      class="w-full px-4 py-3 bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-stone-800 shadow-sm"
                      required
                      autocomplete="off"
                  />
                  <ul v-if="mostrarSugerencias" class="absolute z-50 w-full bg-white border border-stone-200 rounded-xl mt-1 shadow-xl max-h-48 overflow-y-auto">
                    <li
                        v-for="(sug, index) in sugerencias"
                        :key="index"
                        @mousedown.prevent="seleccionarUbicacion(sug)"
                        class="px-4 py-3 hover:bg-emerald-50 cursor-pointer text-sm text-stone-700 border-b border-stone-100 last:border-0 truncate transition-colors"
                    >
                      {{ formatearDireccion(sug) }}
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <label class="block text-sm font-bold text-stone-600 mb-2">Fotografía del Producto *</label>
                <div class="mt-1 border-2 border-dashed border-stone-300 rounded-xl p-8 text-center hover:border-emerald-500 transition-colors cursor-pointer group relative overflow-hidden bg-stone-50/50">
                  <input type="file" @change="handleImagen" class="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                  <div v-if="!form.preview" class="space-y-2">
                    <CameraIcon class="w-8 h-8 mx-auto text-emerald-600/50 group-hover:text-emerald-500 transition-colors" />
                    <p class="text-sm font-medium text-stone-500">Haz clic o arrastra una imagen aquí</p>
                  </div>
                  <div v-else class="h-48 w-full bg-white rounded-lg flex items-center justify-center p-2 shadow-sm border border-stone-100">
                    <img :src="form.preview" class="max-h-full max-w-full object-contain" />
                  </div>
                </div>
              </div>

              <div class="mt-6 flex flex-col sm:flex-row gap-3">
                <button type="submit" class="flex-1 py-3 bg-[#70a46b] hover:bg-[#5b8a57] text-white font-bold rounded-lg shadow-sm transition-all active:scale-[0.98] text-base">
                  {{ donacionEditandoId ? 'Guardar Cambios' : 'Publicar Donación' }}
                </button>
                <button type="button" v-if="donacionEditandoId" @click="cancelarEdicion" class="flex-1 py-3 bg-stone-100 text-stone-700 font-bold rounded-lg hover:bg-stone-200 transition-all active:scale-[0.98] text-base">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <div v-else class="p-6 max-w-7xl mx-auto w-full flex-1">
        <section class="animate-in fade-in duration-500">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
            <div>
              <h2 class="text-3xl font-black tracking-tight text-stone-900">
                {{ seccion === 'historial' ? 'Historial de Entregas' : 'Mis Donaciones' }}
              </h2>
              <p class="text-stone-500 text-sm mt-1">Gestiona y ve todos tus listados de alimentos</p>
            </div>

            <div class="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div class="relative w-full sm:w-80">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <SearchIcon class="w-5 h-5 text-stone-400" />
                </div>
                <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Buscar por alimento..."
                    class="w-full pl-11 pr-4 py-2.5 bg-white border border-stone-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-stone-700"
                >
              </div>
              <button @click="seccion = 'publicar'" class="px-5 py-2.5 bg-emerald-700 text-white font-bold rounded-2xl shadow-sm hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2 whitespace-nowrap active:scale-95">
                <PlusIcon class="w-5 h-5" /> Añadir donación
              </button>
            </div>
          </div>

          <div v-if="paginatedList.length === 0" class="text-center py-12">
            <BoxIcon class="w-12 h-12 text-stone-300 mx-auto mb-4" />
            <p class="text-stone-500 font-medium">No tienes donaciones en esta sección.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <DonacionCard
                v-for="item in paginatedList"
                :key="item.id"
                :item="item"
                :imagen="item.imagen"
                :titulo="item.tipo"
                :estado="item.estado"
                :badgeClass="badgeClass(item.estado)"
                @click-card="abrirDetalle"
            >
              <template #detalles-top>
                <div class="flex items-center gap-2 text-stone-600 mb-1" v-if="item.estado !== 'entregado'">
                  <CalendarIcon class="w-4 h-4 text-stone-400" />
                  <p class="text-sm font-medium">Límite/Venc: {{ item.vencimiento }}</p>
                </div>
                <div class="flex items-start gap-2 text-stone-800 mb-1" v-else-if="item.ong">
                  <CheckCircleIcon class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div class="flex flex-col">
                    <p class="text-sm font-bold">Entregado a <span class="text-emerald-700">{{ item.ong }}</span></p>
                    <p class="text-xs text-stone-500 font-medium mt-0.5" v-if="item.fechaEntrega">El {{ formatFecha(item.fechaEntrega) }}</p>
                  </div>
                </div>

                <div class="flex items-center gap-2 text-stone-500">
                  <ClockIcon class="w-4 h-4 text-stone-400" />
                  <p class="text-xs">Publicado: {{ item.publicado.toLocaleDateString() }}</p>
                </div>
              </template>

              <template #acciones>
                <button v-if="item.estado === 'reservado'" @click.stop="validarCodigoRetiro(item)" class="w-full py-3.5 bg-emerald-700 text-white font-bold rounded-2xl hover:bg-emerald-800 transition-colors flex justify-center items-center gap-2">
                  <KeyIcon class="w-5 h-5" /> Validar Retiro
                </button>
                <template v-else-if="item.estado === 'disponible'">
                  <button @click.stop="abrirEditarDonacion(item)" class="flex-1 py-3.5 bg-[#f3f4f6] text-stone-800 font-bold rounded-2xl hover:bg-stone-200 transition-colors flex justify-center items-center gap-2">
                    Modificar
                  </button>
                  <button @click.stop="eliminarDonacion(item)" class="flex-1 py-3.5 bg-[#1c1c1c] text-white font-bold rounded-2xl hover:bg-black transition-colors flex justify-center items-center gap-2">
                    Finalizar
                  </button>
                </template>
              </template>
            </DonacionCard>
          </div>

          <div v-if="totalPages > 1" class="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
            <p class="text-sm text-stone-500">
              Mostrando {{ (currentPage - 1) * itemsPerPage + 1 }} - {{ Math.min(currentPage * itemsPerPage, listaFiltrada.length) }} de {{ listaFiltrada.length }} donaciones
            </p>
            <div class="flex items-center gap-1.5">
              <button
                  @click="currentPage > 1 && currentPage--"
                  :disabled="currentPage === 1"
                  class="w-9 h-9 flex items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-500 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>

              <button
                  v-for="page in totalPages"
                  :key="page"
                  @click="currentPage = page"
                  :class="[
                  'w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all',
                  currentPage === page
                    ? 'bg-emerald-700 text-white border border-transparent shadow-sm'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                ]"
              >
                {{ page }}
              </button>

              <button
                  @click="currentPage < totalPages && currentPage++"
                  :disabled="currentPage === totalPages"
                  class="w-9 h-9 flex items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-500 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
          </div>

        </section>
      </div>
    </main>

    <footer class="bg-emerald-950 pt-16 pb-8 px-6 border-t border-emerald-900 mt-auto">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div class="md:col-span-1">
            <div class="flex items-center gap-1 mb-6">
              <img src="/logo-sobra-cero.png" alt="Logo" class="h-10 w-auto object-contain brightness-0 invert" />
              <span class="text-xl font-black text-white">SobraCero</span>
            </div>
            <p class="text-emerald-100/70 text-sm leading-relaxed">Conectando excedentes alimentarios con quienes más lo necesitan a través de la tecnología.</p>
          </div>
          <div>
            <h4 class="font-bold text-white mb-4">Plataforma</h4>
            <ul class="space-y-3 text-sm text-emerald-100/70">
              <li><router-link to="/#como-funciona" class="hover:text-emerald-400 transition-colors">¿Cómo funciona?</router-link></li>
              <li><router-link to="/#impacto" class="hover:text-emerald-400 transition-colors">Impacto Social</router-link></li>
              <li><router-link to="/#preguntas" class="hover:text-emerald-400 transition-colors">Preguntas Frecuentes</router-link></li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold text-white mb-4">Compañía</h4>
            <ul class="space-y-3 text-sm text-emerald-100/70">
              <li><a href="#" class="hover:text-emerald-400 transition-colors">Sobre Nosotros</a></li>
              <li><a href="#" class="hover:text-emerald-400 transition-colors">Contacto</a></li>
              <li><a href="#" class="hover:text-emerald-400 transition-colors">Términos Legales</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold text-white mb-4">Contacto</h4>
            <ul class="space-y-3 text-sm text-emerald-100/70">
              <li class="flex items-center gap-2"><MessageSquareIcon class="w-4 h-4 text-emerald-500" /> soportesobracero@gmail.com</li>
              <li class="flex items-center gap-2"><MapPinIcon class="w-4 h-4 text-emerald-500" /> Temuco, Chile</li>
            </ul>
          </div>
        </div>
        <div class="border-t border-emerald-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold text-emerald-100/50">
          <p>© {{ new Date().getFullYear() }} SobraCero. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>

    <DonacionDonanteModal
        :isOpen="modalDetalle"
        :donacion="donacionSeleccionada"
        :badgeClass="donacionSeleccionada ? badgeClass(donacionSeleccionada.estado) : ''"
        mapId="mapa-donacion"
        @close="cerrarModal"
    />

    <PerfilModal
        :isOpen="modalPerfil"
        :perfil="perfil"
        @close="modalPerfil = false"
        @eliminar="eliminarCuenta"
        @guardar="guardarPerfil"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { donanteService } from '../services/donante.service';
import { authService } from '../services/auth.service';
import DonacionCard from '../components/common/DonacionCard.vue';
import DonacionDonanteModal from '../components/donante/DonacionDonanteModal.vue';
import PerfilModal from '../components/donante/PerfilModal.vue';
import {
  CameraIcon, HeartIcon, XIcon, MapPinIcon, KeyIcon, SearchIcon, BoxIcon, EditIcon, TrashIcon, CalendarIcon, CheckCircleIcon, ClockIcon, PlusIcon, LogOutIcon, SettingsIcon, MessageSquareIcon
} from 'lucide-vue-next';
import type { Donacion } from '../types';
import { useMap } from '../composables/useMap';

// 1. Importamos el composable
import { useAddressAutocomplete } from '../composables/useAddressAutocomplete';

const router = useRouter();
const seccion = ref('publicar');
const modalPerfil = ref(false);
const modalDetalle = ref(false);
const donacionSeleccionada = ref<Donacion | null>(null);
const donacionEditandoId = ref<number | null>(null);

// 2. Instanciamos el autocompletado
const { sugerencias, mostrarSugerencias, buscarDirecciones, formatearDireccion } = useAddressAutocomplete();

const perfil = reactive({
  nombre: '',
  email: '',
  foto: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=200'
});

const form = reactive({
  tipo: '',
  kilos: 0,
  vencimiento: '',
  ubicacion: '',
  preview: ''
});

// 3. Función para seleccionar la ubicación del menú desplegable
const seleccionarUbicacion = (sug: any) => {
  form.ubicacion = formatearDireccion(sug);
  mostrarSugerencias.value = false;
};

const fechaMinima = computed(() => {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + 1);
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, '0');
  const day = String(fecha.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
});

const imagenArchivo = ref<File | null>(null);
const donaciones = ref<Donacion[]>([]);

// Formateador de fechas
const formatFecha = (fechaStr: string) => {
  if (!fechaStr) return '';
  try {
    const f = new Date(fechaStr);
    return f.toLocaleString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch(e) {
    return fechaStr;
  }
};

const cargarDonaciones = async () => {
  try {
    const data = await donanteService.getDonaciones();
    donaciones.value = data.map((d: any) => ({
      id: d.id,
      tipo: d.tipoAlimento || d.nombre,
      kilos: d.cantidadPorciones,
      vencimiento: d.horaLimiteRetiro ? d.horaLimiteRetiro.split('T')[0] : 'Sin fecha',
      publicado: new Date(d.fechaPublicacion || Date.now()),
      ubicacion: d.ubicacion || 'Sin ubicación',
      imagen: d.imagenUrl ? `/imagenes-sobracero/${d.imagenUrl}` : 'https://placehold.co/400x400/png',
      estado: d.estado ? d.estado.toLowerCase() : 'disponible',
      ong: d.razonSocialOng || '',
      fechaEntrega: d.fechaEntrega, // Capturamos el nuevo campo
      codigoRetiro: d.codigoRetiro  // Capturamos el nuevo campo
    }));
  } catch (error) {
    console.error("Error de conexión al cargar donaciones:", error);
  }
};

onMounted(() => {
  const datosUsuario = localStorage.getItem('usuario');
  if (datosUsuario) {
    const usr = JSON.parse(datosUsuario);
    perfil.nombre = usr.razonSocial || 'Mi Cuenta Donante';
    perfil.email = usr.email || '';
    if (usr.fotoUrl) {
      perfil.foto = `/imagenes-sobracero/${usr.fotoUrl}`;
    }
  }
  cargarDonaciones();
});

const searchQuery = ref('');

const listaFiltrada = computed(() => {
  let filtradas = donaciones.value;
  if (seccion.value === 'historial') {
    filtradas = filtradas.filter((d: any) => d.estado === 'entregado');
  } else {
    filtradas = filtradas.filter((d: any) => d.estado !== 'entregado');
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    filtradas = filtradas.filter((d: any) => {
      const matchTipo = d.tipo.toLowerCase().includes(q);
      const matchOng = d.ong && d.ong.toLowerCase().includes(q);
      return matchTipo || matchOng;
    });
  }

  return filtradas;
});

// Paginación
const currentPage = ref(1);
const itemsPerPage = 9;
const totalPages = computed(() => Math.ceil(listaFiltrada.value.length / itemsPerPage));

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return listaFiltrada.value.slice(start, start + itemsPerPage);
});

watch([seccion, searchQuery], () => {
  currentPage.value = 1;
});

const handleImagen = (e: any) => {
  const file = e.target.files[0];
  if (file) {
    imagenArchivo.value = file;
    form.preview = URL.createObjectURL(file);
  }
};

const crearDonacion = async () => {
  try {
    const formData = new FormData();
    formData.append('tipoAlimento', form.tipo);
    formData.append('porciones', form.kilos.toString());
    formData.append('horaLimite', `${form.vencimiento}T23:59:59`);
    formData.append('ubicacion', form.ubicacion);

    if (imagenArchivo.value) {
      formData.append('imagen', imagenArchivo.value);
    }

    if (donacionEditandoId.value) {
      await donanteService.modificarDonacion(donacionEditandoId.value, formData);
      Swal.fire('¡Actualizado!', 'La donación ha sido modificada.', 'success');
    } else {
      await donanteService.crearDonacion(formData);
      Swal.fire('¡Publicado!', 'La donación está disponible para las ONG.', 'success');
    }

    await cargarDonaciones();
    seccion.value = 'mis-donaciones';
    limpiarForm();
  } catch (error: any) {
    console.error("Error al publicar/modificar:", error);
    Swal.fire('Error', error.message || 'No se pudo guardar la donación.', 'error');
  }
};

const abrirEditarDonacion = (item: any) => {
  form.tipo = item.tipo;
  form.kilos = item.kilos;
  form.vencimiento = item.vencimiento;
  form.ubicacion = item.ubicacion;
  form.preview = item.imagen;
  donacionEditandoId.value = item.id;
  seccion.value = 'publicar';
};

const cancelarEdicion = () => {
  limpiarForm();
  seccion.value = 'mis-donaciones';
};

const eliminarDonacion = async (item: Donacion) => {
  const result = await Swal.fire({
    title: '¿Eliminar donación?',
    text: "Esta acción no se puede deshacer.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#a8a29e',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (result.isConfirmed) {
    try {
      await donanteService.eliminarDonacion(item.id);
      Swal.fire('Eliminada', 'La donación fue eliminada.', 'success');
      cargarDonaciones();
    } catch (error: any) {
      Swal.fire('Error', error.message || 'No se pudo eliminar la donación.', 'error');
    }
  }
};

const validarCodigoRetiro = async (item: Donacion) => {
  const { value: codigo } = await Swal.fire({
    title: 'Validar Retiro',
    input: 'text',
    inputLabel: 'Ingresa el código proporcionado por la ONG',
    inputPlaceholder: 'Ej: DON-XXXXXX',
    showCancelButton: true,
    confirmButtonColor: '#059669',
    cancelButtonColor: '#a8a29e',
    confirmButtonText: 'Confirmar Entrega',
    cancelButtonText: 'Cancelar'
  });

  if (codigo) {
    try {
      await donanteService.validarRetiro(codigo.toUpperCase());
      Swal.fire('¡Entregado!', 'La donación ha sido entregada y movida al historial.', 'success');
      cargarDonaciones();
    } catch (error: any) {
      console.error(error);
      Swal.fire('Código Inválido', error.message || 'El código no coincide con esta reserva.', 'error');
    }
  }
};

const limpiarForm = () => {
  form.tipo = '';
  form.kilos = 0;
  form.vencimiento = '';
  form.preview = '';
  form.ubicacion = '';
  imagenArchivo.value = null;
  donacionEditandoId.value = null;
};

const abrirConfiguracion = () => modalPerfil.value = true;

const mapDonacion = useMap();

const abrirDetalle = async (item: Donacion) => {
  donacionSeleccionada.value = item;
  modalDetalle.value = true;
  await nextTick();
  await mapDonacion.initMap('mapa-donacion', item.ubicacion);
};

const destruirMapa = () => {
  mapDonacion.destroyMap();
};

const cerrarModal = () => {
  modalDetalle.value = false;
  destruirMapa();
};

const cerrarSesion = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  router.push('/login');
};

const eliminarCuenta = async () => {
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: "Si eliminas tu cuenta, no podrás revertir esto. Tus registros históricos se mantendrán por seguridad, pero tu cuenta quedará desactivada de forma permanente.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#a8a29e',
    confirmButtonText: 'Sí, eliminar cuenta',
    cancelButtonText: 'Cancelar'
  });

  if (result.isConfirmed) {
    try {
      await authService.eliminarCuenta();
      Swal.fire('Cuenta Eliminada', 'Tu cuenta ha sido eliminada correctamente.', 'success');
      cerrarSesion();
    } catch (error: any) {
      console.error(error);
      Swal.fire('Error', error.message || 'No se pudo eliminar la cuenta.', 'error');
    }
  }
};

const guardarPerfil = async (perfilActualizado: any) => {
  try {
    const formData = new FormData();
    formData.append('razonSocial', perfilActualizado.nombre);
    formData.append('email', perfilActualizado.email);

    if (perfilActualizado.nuevaImagen) {
      formData.append('foto', perfilActualizado.nuevaImagen);
    }

    const res = await authService.actualizarPerfil(formData);
    Swal.fire('Perfil Actualizado', 'Tus datos se guardaron correctamente', 'success');

    const usr = JSON.parse(localStorage.getItem('usuario') || '{}');
    usr.razonSocial = res.usuario.razonSocial;
    usr.email = res.usuario.email;
    if (res.usuario.fotoUrl) {
      usr.fotoUrl = res.usuario.fotoUrl;
      perfil.foto = `/imagenes-sobracero/${res.usuario.fotoUrl}`;
    }
    localStorage.setItem('usuario', JSON.stringify(usr));

    delete perfilActualizado.previewImagen;
    delete perfilActualizado.nuevaImagen;

    modalPerfil.value = false;
  } catch (error: any) {
    Swal.fire('Error', error.message || 'No se pudo actualizar el perfil', 'error');
  }
};

const badgeClass = (estado: string) => {
  let baseClass = "text-[10px] font-bold uppercase px-2 py-1 rounded-md tracking-wider h-fit ";
  if (estado === 'disponible' || estado === 'publicado') return baseClass + "bg-emerald-100 text-emerald-800";
  if (estado === 'reservado') return baseClass + "bg-blue-100 text-blue-800";
  if (estado === 'entregado') return baseClass + "bg-emerald-100 text-emerald-800";
  return baseClass + "bg-stone-100 text-stone-700";
};

const tabClass = (active: boolean) => `
  px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all border
  ${active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'}
`;

const navClass = (active: boolean) => `
  px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all
  ${active ? 'bg-white text-emerald-700 shadow-sm border border-stone-200' : 'text-stone-600 hover:text-emerald-700 hover:bg-stone-100 border border-transparent'}
`;
</script>