<template>
  <div class="min-h-screen bg-[#fafaf9] flex flex-col text-slate-800 font-sans">
    <!-- Navbar Superior -->
    <nav class="bg-white border-b border-stone-200 sticky top-0 z-40 px-6 py-3 flex items-center justify-between shadow-sm">
      <div class="flex items-center gap-2 cursor-pointer" @click="seccion = 'explorar'">
        <img src="/logo-sobra-cero.png" alt="SobraCero" class="h-8 w-auto object-contain hover:rotate-12 transition-transform" />
        <h1 class="text-xl font-black tracking-tight text-emerald-900 hidden sm:block">SobraCero</h1>
      </div>
      
      <div class="hidden md:flex items-center gap-1 bg-stone-50 p-1 rounded-xl border border-stone-100">
        <button @click="seccion = 'explorar'" :class="navClass(seccion === 'explorar')">Explorar Donaciones</button>
        <button @click="seccion = 'activa'" :class="navClass(seccion === 'activa')">Mi Reserva</button>
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

    <!-- Main Content Wrapper -->
    <main class="flex-1 flex flex-col">
      <!-- Hero Banner -->
      <div class="relative overflow-hidden rounded-[2rem] mx-4 sm:mx-8 mt-6 mb-6 shadow-xl">
        <!-- Background Gradients -->
        <div class="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900"></div>
        <div class="absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-500/20 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/3"></div>
        <div class="absolute bottom-0 left-0 w-[300px] h-[300px] bg-teal-500/20 rounded-full blur-[60px] translate-y-1/3 -translate-x-1/3"></div>
        
        <!-- Subtle Pattern Overlay -->
        <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(rgba(255, 255, 255, 0.4) 2px, transparent 2px); background-size: 30px 30px;"></div>

        <div class="max-w-7xl mx-auto px-6 sm:px-10 py-10 sm:py-12 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div class="max-w-xl text-center lg:text-left">
            <h2 class="text-3xl sm:text-4xl font-black mb-3 text-white leading-tight tracking-tight">
              Bienvenida, <span class="text-emerald-400">{{ nombreUsuario }}</span>
            </h2>
            <p class="text-emerald-100/90 text-base sm:text-lg font-medium leading-relaxed">
              Explora alimentos disponibles para retiro en tu zona y gestiona tus reservas de manera sencilla.
            </p>
          </div>
        </div>
      </div>

      <div class="p-6 max-w-7xl mx-auto w-full flex-1">
        <section v-if="seccion === 'explorar'" class="animate-in fade-in duration-500">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
            <div>
              <h2 class="text-3xl font-black tracking-tight text-stone-900">Explorar Alimentos</h2>
              <p class="text-stone-500 text-sm mt-1">Alimentos disponibles para retiro cerca de ti</p>
            </div>
            <div class="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div class="relative w-full sm:w-80">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <SearchIcon class="w-5 h-5 text-stone-400" />
                </div>
                <input 
                  v-model="searchQuery" 
                  type="text" 
                  placeholder="Buscar por alimento o ubicación..." 
                  class="w-full pl-11 pr-4 py-2.5 bg-white border border-stone-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-stone-700"
                >
              </div>
            </div>
          </div>

          <div v-if="donacionesFiltradas.length === 0" class="text-center py-12">
            <BoxIcon class="w-12 h-12 text-stone-300 mx-auto mb-4" />
            <p class="text-stone-500 font-medium">No hay donaciones que coincidan con tu búsqueda o no hay disponibles en este momento.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <DonacionCard
              v-for="item in donacionesFiltradas"
              :key="item.id"
              :item="item"
              :imagen="item.imagen"
              :titulo="item.tipo"
              @click-card="abrirDetalle"
            >
              <template #detalles-top>
                <div class="flex items-center gap-2 text-stone-600 mb-1">
                  <BoxIcon class="w-4 h-4 text-stone-400" />
                  <p class="text-sm font-medium">{{ item.kilos }} kg/porc. disponibles</p>
                </div>
                <div class="flex items-center gap-2 text-stone-600 mb-1">
                  <CalendarIcon class="w-4 h-4 text-stone-400" />
                  <p class="text-sm font-medium">Límite/Venc: {{ item.vencimiento }}</p>
                </div>
                <div class="mt-3 flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 w-fit px-2.5 py-1.5 rounded-lg border border-emerald-100">
                  <MapPinIcon class="w-3.5 h-3.5" />
                  {{ item.ubicacion }}
                </div>
              </template>
            </DonacionCard>
          </div>
        </section>

        <section v-else-if="seccion === 'activa'" class="max-w-2xl mx-auto animate-in fade-in duration-500">
          <header class="mb-8 text-center">
            <h2 class="text-3xl font-black text-stone-900">Tu Reserva Actual</h2>
            <p class="text-stone-500 mt-2">Muestra este código al donante al momento de retirar el alimento.</p>
          </header>

          <div v-if="!reservaActiva" class="text-center py-12 bg-white rounded-[2rem] border border-stone-100 shadow-sm">
            <KeyIcon class="w-12 h-12 text-stone-300 mx-auto mb-4" />
            <p class="text-stone-500 font-medium">No tienes ninguna reserva activa en este momento.</p>
          </div>

          <div v-else class="bg-white rounded-[2.5rem] border border-stone-100 shadow-lg overflow-hidden">
            <div class="bg-emerald-600 p-8 text-center text-white">
              <p class="text-emerald-100 font-bold uppercase tracking-widest text-xs mb-2">Código de Retiro</p>
              <h1 class="text-5xl font-black tracking-widest">{{ reservaActiva.codigoRetiro }}</h1>
            </div>
            <div class="p-8">
              <h3 class="text-2xl font-black text-stone-800 mb-6">{{ reservaActiva.nombreDonacion || 'Donación' }}</h3>
              <div class="grid grid-cols-2 gap-4">

                <div class="bg-stone-50 p-4 rounded-2xl">
                  <p class="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Vencimiento</p>
                  <p class="font-bold text-stone-700 text-lg">{{ reservaActiva.horaLimite ? reservaActiva.horaLimite.split('T')[0] : 'Sin fecha' }}</p>
                </div>

                <div class="bg-stone-50 p-4 rounded-2xl">
                  <p class="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Estado</p>
                  <p class="font-bold text-emerald-600 text-lg uppercase">Reservado</p>
                </div>

                <div class="col-span-2 bg-stone-50 p-4 rounded-2xl">
                  <p class="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Dirección de retiro</p>
                  <p class="font-bold text-stone-700">{{ reservaActiva.direccion || 'Dirección no especificada' }}</p>
                </div>

                <div class="col-span-2 mt-2">
                  <button @click="cancelarReserva" class="w-full py-3 bg-red-50 text-red-600 font-bold rounded-xl border border-red-200 hover:bg-red-100 transition-colors flex justify-center items-center gap-2">
                    <XIcon class="w-5 h-5" /> Cancelar Reserva
                  </button>
                </div>

              </div>
            </div>
          </div>
        </section>
      </div>
    </main>

    <!-- Footer de Landing Page -->
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

    <!-- Modals -->
    <DonacionOngModal
      :isOpen="modalDetalle"
      :donacion="donacionSeleccionada"
      :reservaActiva="reservaActiva"
      mapId="mapa-ong"
      @close="cerrarModal"
      @reservar="reservarDonacion"
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
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { useMap } from '../composables/useMap';
import { ongService } from '../services/ong.service';
import { authService } from '../services/auth.service';
import DonacionCard from '../components/common/DonacionCard.vue';
import DonacionOngModal from '../components/ong/DonacionOngModal.vue';
import PerfilModal from '../components/donante/PerfilModal.vue';
import { LogOutIcon, HeartIcon, BoxIcon, MapPinIcon, XIcon, KeyIcon, CheckCircleIcon, SearchIcon, CalendarIcon, MessageSquareIcon } from 'lucide-vue-next';

const router = useRouter();
const nombreUsuario = ref('');
const seccion = ref('explorar');
const modalDetalle = ref(false);
const modalPerfil = ref(false);
const donacionSeleccionada = ref<any>(null);
const mapOng = useMap();

const perfil = ref({
  nombre: '',
  email: '',
  foto: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=200'
});

const donacionesActivas = ref<any[]>([]);
const reservaActiva = ref<any>(null);
const searchQuery = ref('');

const donacionesFiltradas = computed(() => {
  if (!searchQuery.value) return donacionesActivas.value;
  const q = searchQuery.value.toLowerCase();
  return donacionesActivas.value.filter(d => 
    d.tipo.toLowerCase().includes(q) || 
    d.ubicacion.toLowerCase().includes(q)
  );
});

const cargarDonaciones = async () => {
  try {
    const data = await ongService.getCatalogo();
    donacionesActivas.value = data.map((d: any) => ({
      id: d.id,
      tipo: d.tipoAlimento || d.nombre,
      kilos: d.cantidadPorciones,
      vencimiento: d.horaLimiteRetiro ? d.horaLimiteRetiro.split('T')[0] : 'Sin fecha',
      ubicacion: d.ubicacion || 'Sin ubicación',
      imagen: d.imagenUrl ? `/imagenes-sobracero/${d.imagenUrl}` : 'https://placehold.co/400x400/png',
      estado: 'disponible'
    }));
  } catch (error) { console.error(error); }
};

const cargarReservaActiva = async () => {
  try {
    reservaActiva.value = await ongService.getReservaActiva();
  } catch (error) { 
    reservaActiva.value = null;
  }
};

onMounted(() => {
  const datosFormateados = localStorage.getItem('usuario');
  if (datosFormateados) {
    const usr = JSON.parse(datosFormateados);
    nombreUsuario.value = usr.razonSocial || 'ONG';
    perfil.value.nombre = usr.razonSocial || 'ONG';
    perfil.value.email = usr.email || '';
    if (usr.fotoUrl) {
      perfil.value.foto = `/imagenes-sobracero/${usr.fotoUrl}`;
    }
  }

  cargarDonaciones();
  cargarReservaActiva();
});

const reservarDonacion = async () => {
  try {
    await ongService.crearReserva(donacionSeleccionada.value.id);
    Swal.fire('¡Retiro Solicitado!', 'Tu código de retiro se generó exitosamente.', 'success');
    cerrarModal();
    await cargarDonaciones();
    await cargarReservaActiva();
    seccion.value = 'activa';
  } catch (error) {
    Swal.fire('Error', 'La donación ya no está disponible.', 'error');
  }
};

const cancelarReserva = async () => {
  if (!reservaActiva.value) return;

  const result = await Swal.fire({
    title: '¿Cancelar reserva?',
    text: "La donación volverá a estar disponible para otras ONGs. Esta acción no se puede deshacer.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#a8a29e',
    confirmButtonText: 'Sí, cancelar',
    cancelButtonText: 'Volver'
  });

  if (result.isConfirmed) {
    try {
      await ongService.cancelarReserva(reservaActiva.value.id);
      Swal.fire('Reserva Cancelada', 'La reserva ha sido cancelada exitosamente.', 'success');
      reservaActiva.value = null;
      seccion.value = 'explorar';
      await cargarDonaciones();
    } catch (error: any) {
      Swal.fire('Error', error.message || 'No se pudo cancelar la reserva.', 'error');
    }
  }
};

const abrirDetalle = async (item: any) => {
  donacionSeleccionada.value = item;
  modalDetalle.value = true;
  await nextTick();
  await mapOng.initMap('mapa-ong', item.ubicacion);
};

const cerrarModal = () => {
  modalDetalle.value = false;
  mapOng.destroyMap();
  donacionSeleccionada.value = null;
};

const cerrarSesion = () => {
  localStorage.removeItem('usuario');
  localStorage.removeItem('token');
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

const abrirConfiguracion = () => modalPerfil.value = true;

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
    
    // Actualizar localStorage
    const usr = JSON.parse(localStorage.getItem('usuario') || '{}');
    usr.razonSocial = res.usuario.razonSocial;
    usr.email = res.usuario.email;
    if (res.usuario.fotoUrl) {
      usr.fotoUrl = res.usuario.fotoUrl;
      perfil.value.foto = `/imagenes-sobracero/${res.usuario.fotoUrl}`;
    }
    localStorage.setItem('usuario', JSON.stringify(usr));
    
    nombreUsuario.value = res.usuario.razonSocial;
    
    // Cleanup preview
    delete perfilActualizado.previewImagen;
    delete perfilActualizado.nuevaImagen;
    
    modalPerfil.value = false;
  } catch (error: any) {
    Swal.fire('Error', error.message || 'No se pudo actualizar el perfil', 'error');
  }
};

const navClass = (active: boolean) => `
  px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all
  ${active ? 'bg-white text-emerald-700 shadow-sm border border-stone-200' : 'text-stone-600 hover:text-emerald-700 hover:bg-stone-100 border border-transparent'}
`;
</script>