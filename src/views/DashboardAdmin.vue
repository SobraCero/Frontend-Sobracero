<template>
  <DashboardLayout>
    <template #sidebar>
      <AdminSidebar
          v-model:seccionActual="seccionActual"
          @cerrarSesion="cerrarSesion"
      />
    </template>

    <section v-if="seccionActual === 'usuarios'" class="animate-in fade-in duration-500">
      <header class="mb-6">
        <h2 class="text-3xl font-black text-stone-900">Gestión de Usuarios</h2>
        <p class="text-stone-500 mt-1">Administra cuentas, aprueba solicitudes y edita perfiles de ONGs y Donantes.</p>
      </header>

      <div class="flex gap-6 mb-6 border-b border-stone-200">
        <button @click="filtroUsuario = 'pendientes'" :class="['pb-3 text-sm font-bold border-b-2 transition-all', filtroUsuario === 'pendientes' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-stone-400 hover:text-stone-600']">
          Solicitudes Pendientes <span class="bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full text-xs ml-1">{{ usuariosPendientes.length }}</span>
        </button>
        <button @click="filtroUsuario = 'activos'" :class="['pb-3 text-sm font-bold border-b-2 transition-all', filtroUsuario === 'activos' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-stone-400 hover:text-stone-600']">
          Cuentas Activas <span class="bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full text-xs ml-1">{{ usuariosActivos.length }}</span>
        </button>
      </div>

      <div class="mb-6 relative max-w-xl">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <SearchIcon class="w-5 h-5 text-stone-400" />
        </div>
        <input
            v-model="searchUsuario"
            type="text"
            placeholder="Buscar por Razón Social, Email o RUT..."
            class="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none text-stone-700 placeholder-stone-400"
        >
      </div>

      <div v-if="cargando" class="flex justify-center py-20">
        <Loader2Icon class="w-10 h-10 text-emerald-600 animate-spin" />
      </div>

      <div v-else-if="usuariosFiltrados.length === 0" class="bg-white border border-stone-200 border-dashed rounded-3xl p-12 text-center mt-4">
        <UsersIcon class="w-16 h-16 text-stone-300 mx-auto mb-4" />
        <h3 class="text-xl font-bold text-stone-700">No hay usuarios en esta lista</h3>
        <p class="text-stone-500">Aún no hay registros que coincidan con este estado.</p>
      </div>

      <div v-else class="grid grid-cols-1 gap-4">
        <UsuarioCard
            v-for="usuario in usuariosFiltrados"
            :key="usuario.id"
            :usuario="usuario"
            :badgeRol="badgeRol(usuario.rol)"
            :badgeEstado="badgeEstado(usuario.estado)"
            @ver-mapa="abrirMapa"
            @ver-documento="abrirDocumento"
        >
          <template #acciones>
            <button v-if="usuario.estado === 'PENDIENTE'" @click="aprobar(usuario.id)" class="px-4 py-2 bg-emerald-600 text-white font-bold text-sm rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2">
              <CheckIcon class="w-4 h-4" /> Aprobar
            </button>
            <button @click="abrirModalEdicion(usuario)" class="px-4 py-2 bg-secondary-600 text-white font-bold text-sm rounded-xl hover:bg-secondary-700 transition-colors flex items-center gap-2">
              <EditIcon class="w-4 h-4" /> Editar
            </button>
            <button @click="eliminar(usuario.id, usuario.estado)" class="px-4 py-2 bg-red-600 text-white font-bold text-sm rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2">
              <TrashIcon class="w-4 h-4" /> {{ usuario.estado === 'PENDIENTE' ? 'Rechazar' : 'Eliminar' }}
            </button>
          </template>
        </UsuarioCard>
      </div>
    </section>

    <section v-else-if="seccionActual === 'donaciones'" class="animate-in fade-in duration-500">
      <header class="mb-8">
        <h2 class="text-3xl font-black text-stone-900">Monitoreo de Donaciones</h2>
        <p class="text-stone-500 mt-1">Revisa el estado global de todos los alimentos publicados en el sistema.</p>
      </header>

      <div class="mb-6 relative max-w-xl">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <SearchIcon class="w-5 h-5 text-stone-400" />
        </div>
        <input
            v-model="searchDonacion"
            type="text"
            placeholder="Buscar por Alimento, Local (Donante) o Ubicación..."
            class="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none text-stone-700 placeholder-stone-400"
        >
      </div>

      <div v-if="donacionesFiltradas.length === 0" class="bg-white border border-stone-200 border-dashed rounded-3xl p-12 text-center">
        <BoxIcon class="w-16 h-16 text-stone-300 mx-auto mb-4" />
        <h3 class="text-xl font-bold text-stone-700">No hay donaciones</h3>
        <p class="text-stone-500">Ningún alimento coincide con tu búsqueda.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DonacionCard
            v-for="item in donacionesFiltradas"
            :key="item.id"
            :item="item"
            :imagen="item.imagenUrl || 'https://placehold.co/400x400/png'"
            :titulo="item.tipoAlimento || item.nombre"
            :estado="item.estado"
            :badgeClass="badgeDonacion(item.estado)"
            @click-card="abrirDetalleDonacion"
        >
          <template #detalles-top>
            <div class="flex items-center gap-2 text-stone-600 mb-1">
              <BuildingIcon class="w-4 h-4 text-stone-400" />
              <p class="text-sm font-medium">Por: {{ item.donanteNombre || 'Local Donante' }}</p>
            </div>
            <div class="flex items-center gap-2 text-stone-600 mb-1">
              <BoxIcon class="w-4 h-4 text-stone-400" />
              <p class="text-sm font-medium">{{ item.cantidadPorciones }} kg/porc. disponibles</p>
            </div>
            <div class="flex items-center gap-2 text-stone-600 mb-1">
              <CalendarIcon class="w-4 h-4 text-stone-400" />
              <p class="text-sm font-medium">Límite/Venc: {{ item.horaLimiteRetiro ? item.horaLimiteRetiro.split('T')[0] : 'N/A' }}</p>
            </div>
            <div class="mt-3 flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 w-fit px-2.5 py-1.5 rounded-lg border border-emerald-100">
              <MapPinIcon class="w-3.5 h-3.5" />
              {{ item.ubicacion || 'Sin ubicación' }}
            </div>
          </template>
        </DonacionCard>
      </div>
    </section>

    <section v-else-if="seccionActual === 'historial'" class="animate-in fade-in duration-500">
      <header class="mb-8">
        <h2 class="text-3xl font-black text-stone-900">Historial Inmutable</h2>
        <p class="text-stone-500 mt-1">Registro permanente de los cambios de estado y retiros de alimentos (fines legales y salud pública).</p>
      </header>

      <div class="mb-6 relative max-w-xl">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <SearchIcon class="w-5 h-5 text-stone-400" />
        </div>
        <input
            v-model="searchHistorial"
            type="text"
            placeholder="Buscar por Local (Donante), ONG o Alimento..."
            class="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none text-stone-700 placeholder-stone-400"
        >
      </div>

      <div v-if="historialFiltrado.length === 0" class="bg-white border border-stone-200 border-dashed rounded-3xl p-12 text-center">
        <ActivityIcon class="w-16 h-16 text-stone-300 mx-auto mb-4" />
        <h3 class="text-xl font-bold text-stone-700">No hay registros</h3>
        <p class="text-stone-500">Aún no hay historial de cambios en las donaciones.</p>
      </div>

      <GenericTable v-else :headers="['Fecha y Hora', 'Local / Donante', 'Producto', 'Estado', 'ONG (Retiro)', 'Acciones']">
        <tr v-for="registro in historialFiltrado" :key="registro.id" class="hover:bg-stone-50 transition-colors">
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="font-bold text-stone-900">{{ new Date(registro.fechaCambio).toLocaleDateString() }}</div>
            <div class="text-xs text-stone-500">{{ new Date(registro.fechaCambio).toLocaleTimeString() }}</div>
          </td>
          <td class="px-6 py-4 font-medium text-stone-800">{{ registro.donanteNombre }}</td>
          <td class="px-6 py-4 font-bold text-emerald-700">{{ registro.donacionNombre }}</td>
          <td class="px-6 py-4">
            <span :class="badgeDonacion(registro.estadoNuevo)">{{ registro.estadoNuevo }}</span>
          </td>
          <td class="px-6 py-4">
            <span v-if="registro.ongNombre !== 'N/A'" class="text-stone-800 font-medium">{{ registro.ongNombre }}</span>
            <span v-else class="text-stone-400 italic text-xs">Sin ONG asignada</span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
            <button
                @click="abrirDetalleHistorial(registro)"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-xs font-bold shadow-sm"
            >
              <EyeIcon class="w-4 h-4" />
              Ver Detalle
            </button>
          </td>
        </tr>
      </GenericTable>
    </section>

    <template #modals>
      <UsuarioEditModal
          :isOpen="mostrarModal"
          :form="formEdicion"
          @close="mostrarModal = false"
          @guardar="guardarEdicion"
      />

      <MapaModal
          :isOpen="mostrarModalMapa"
          :usuario="usuarioMapa"
          mapId="mapa-admin"
          @close="cerrarMapa"
      />

      <DonacionAdminModal
          :isOpen="mostrarModalDonacion"
          :donacion="donacionSeleccionada"
          :badgeClass="donacionSeleccionada ? badgeDonacion(donacionSeleccionada.estado) : ''"
          mapId="mapa-donacion-admin"
          @close="cerrarModalDonacion"
          @eliminar="eliminarDonacion"
      />

      <HistorialDetalleModal
          :isOpen="isHistorialModalOpen"
          :registro="historialSeleccionado"
          @close="isHistorialModalOpen = false"
      />
    </template>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, nextTick } from 'vue';
import DashboardLayout from '../components/layout/DashboardLayout.vue';
import AdminSidebar from '../components/admin/AdminSidebar.vue';
import DonacionCard from '../components/common/DonacionCard.vue';
import UsuarioCard from '../components/admin/UsuarioCard.vue';
import GenericTable from '../components/common/GenericTable.vue';
import UsuarioEditModal from '../components/admin/UsuarioEditModal.vue';
import MapaModal from '../components/common/MapaModal.vue';
import DonacionAdminModal from '../components/admin/DonacionAdminModal.vue';
import HistorialDetalleModal from '../components/admin/HistorialDetalleModal.vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { useMap } from '../composables/useMap';
import { adminService } from '../services/admin.service';
import {
  ShieldCheckIcon, UsersIcon, LogOutIcon, CheckIcon, TrashIcon, EditIcon,
  MailIcon, PhoneIcon, MapPinIcon, Loader2Icon, FileTextIcon, XIcon, BoxIcon,
  ActivityIcon, ClockIcon, SearchIcon, BuildingIcon, CalendarIcon, EyeIcon // <-- Se agregó EyeIcon
} from 'lucide-vue-next';

const router = useRouter();

const seccionActual = ref('usuarios');
const cargando = ref(true);

const usuarios = ref<any[]>([]);
const filtroUsuario = ref('pendientes');
const searchUsuario = ref('');
const usuariosPendientes = computed(() => usuarios.value.filter(u => u.estado === 'PENDIENTE'));
const usuariosActivos = computed(() => usuarios.value.filter(u => u.estado !== 'PENDIENTE'));
const usuariosFiltrados = computed(() => {
  let list = filtroUsuario.value === 'pendientes' ? usuariosPendientes.value : usuariosActivos.value;
  if (!searchUsuario.value) return list;
  const q = searchUsuario.value.toLowerCase();
  return list.filter(u => {
    const razon = u.razonSocial ? u.razonSocial.toLowerCase() : '';
    const email = u.email ? u.email.toLowerCase() : '';
    const rut = u.rut ? u.rut.toLowerCase() : '';
    return razon.includes(q) || email.includes(q) || rut.includes(q);
  });
});

const donaciones = ref<any[]>([]);
const searchDonacion = ref('');

const donacionesFiltradas = computed(() => {
  const activas = donaciones.value.filter(d => {
    const estado = (d.estado || '').toUpperCase();
    return estado !== 'ENTREGADO';
  });

  if (!searchDonacion.value) return activas;
  const q = searchDonacion.value.toLowerCase();
  return activas.filter(d => {
    const nombre = (d.tipoAlimento || d.nombre || '').toLowerCase();
    const donante = (d.donanteNombre || '').toLowerCase();
    const ubicacion = (d.ubicacion || '').toLowerCase();
    return nombre.includes(q) || donante.includes(q) || ubicacion.includes(q);
  });
});
const historialPublicaciones = ref<any[]>([]);
const searchHistorial = ref('');

const historialFiltrado = computed(() => {
  if (!searchHistorial.value) return historialPublicaciones.value;
  const q = searchHistorial.value.toLowerCase();
  return historialPublicaciones.value.filter(h => {
    const dNombre = h.donanteNombre ? h.donanteNombre.toLowerCase() : '';
    const ong = h.ongNombre ? h.ongNombre.toLowerCase() : '';
    const donNombre = h.donacionNombre ? h.donacionNombre.toLowerCase() : '';
    return dNombre.includes(q) || ong.includes(q) || donNombre.includes(q);
  });
});

const mostrarModalMapa = ref(false);
const usuarioMapa = ref<any>(null);
const mapUsuario = useMap();
const mostrarModal = ref(false);
const usuarioIdEditando = ref<number | null>(null);
const formEdicion = reactive({ razonSocial: '', email: '', telefono: '', direccion: '', password: '' });

const mostrarModalDonacion = ref(false);
const donacionSeleccionada = ref<any>(null);
const mapDonacion = useMap();

// Variables y lógica para el nuevo Modal del Historial
const isHistorialModalOpen = ref(false);
const historialSeleccionado = ref<any>({});

const abrirDetalleHistorial = (registro: any) => {
  historialSeleccionado.value = registro;
  isHistorialModalOpen.value = true;
};

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

const abrirDocumento = async (url: string) => {
  try {
    const respuesta = await fetch(url, { headers: getHeaders() });
    if (!respuesta.ok) throw new Error('Error al descargar el documento');

    const blob = await respuesta.blob();
    const objectUrl = URL.createObjectURL(blob);
    window.open(objectUrl, '_blank');
  } catch (error) {
    console.error('Error abriendo documento:', error);
    Swal.fire('Error', 'No se pudo abrir el documento. Es posible que tu sesión haya expirado o no tengas permisos.', 'error');
  }
};

const cargarUsuarios = async () => {
  try {
    usuarios.value = await adminService.getUsuarios();
  } catch (error) {
    console.error('Error cargando usuarios:', error);
  } finally {
    cargando.value = false;
  }
};

const cargarDonaciones = async () => {
  try {
    const data = await adminService.getDonaciones();
    donaciones.value = data.map((d: any) => ({
      ...d,
      imagenUrl: d.imagenUrl ? `/imagenes-sobracero/${d.imagenUrl}` : 'https://placehold.co/400x400/png'
    }));
  } catch (error) {
    console.error('Error cargando donaciones:', error);
  }
};

const cargarHistorial = async () => {
  try {
    historialPublicaciones.value = await adminService.getHistorial();
  } catch (error) {
    console.error('Error cargando historial:', error);
  }
};

onMounted(() => {
  cargarUsuarios();
  cargarDonaciones();
  cargarHistorial();
});

const aprobar = async (id: number) => {
  const confirmacion = await Swal.fire({
    title: '¿Aprobar solicitud?',
    text: 'Se enviará un correo con el acceso.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#059669',
    confirmButtonText: 'Sí, aprobar'
  });

  if (!confirmacion.isConfirmed) return;

  try {
    await adminService.aprobarUsuario(id);
    Swal.fire('¡Aprobado!', 'El usuario ya tiene acceso.', 'success');
    await cargarUsuarios();
  } catch (error) { console.error(error); }
};

const eliminar = async (id: number, estado: string) => {
  const esPendiente = estado === 'PENDIENTE';
  const confirmacion = await Swal.fire({
    title: `¿Estás seguro de ${esPendiente ? 'rechazar' : 'eliminar'}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    confirmButtonText: 'Confirmar'
  });

  if (!confirmacion.isConfirmed) return;

  try {
    await adminService.eliminarUsuario(id);
    Swal.fire('¡Eliminado!', 'El registro ha sido borrado.', 'success');
    await cargarUsuarios();
  } catch (error) { console.error(error); }
};

const eliminarDonacion = async (id: number) => {
  const confirmacion = await Swal.fire({
    title: '¿Estás seguro de eliminar esta publicación?',
    text: 'Esta acción borrará la donación y sus datos asociados. No se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#9ca3af',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (!confirmacion.isConfirmed) return;

  try {
    await adminService.eliminarDonacion(id);
    Swal.fire('¡Eliminada!', 'La publicación ha sido borrada con éxito.', 'success');
    cerrarModalDonacion();
    await cargarDonaciones();
  } catch (error) {
    console.error(error);
    Swal.fire('Error', 'No se pudo eliminar la publicación.', 'error');
  }
};

const abrirModalEdicion = (usuario: any) => {
  usuarioIdEditando.value = usuario.id;
  formEdicion.razonSocial = usuario.razonSocial;
  formEdicion.email = usuario.email;
  formEdicion.telefono = usuario.telefono;
  formEdicion.direccion = usuario.direccion || '';
  formEdicion.password = '';
  mostrarModal.value = true;
};

const guardarEdicion = async () => {
  if (!usuarioIdEditando.value) return;
  try {
    await adminService.editarUsuario(usuarioIdEditando.value, formEdicion);
    Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Actualizado', showConfirmButton: false, timer: 2000 });
    mostrarModal.value = false;
    await cargarUsuarios();
  } catch (error) { console.error(error); }
};

const abrirMapa = async (usuario: any) => {
  usuarioMapa.value = usuario;
  mostrarModalMapa.value = true;
  await nextTick();
  await mapUsuario.initMap('mapa-admin', usuario.direccion);
};

const cerrarMapa = () => {
  mostrarModalMapa.value = false;
  mapUsuario.destroyMap();
  usuarioMapa.value = null;
};

const abrirDetalleDonacion = async (item: any) => {
  donacionSeleccionada.value = item;
  mostrarModalDonacion.value = true;
  await nextTick();
  await mapDonacion.initMap('mapa-donacion-admin', item.ubicacion);
};

const cerrarModalDonacion = () => {
  mostrarModalDonacion.value = false;
  mapDonacion.destroyMap();
  donacionSeleccionada.value = null;
};

const cerrarSesion = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  router.push('/login');
};

const badgeRol = (rol: string) => `text-[10px] font-black uppercase px-2 py-1 rounded-lg tracking-widest ${rol === 'ONG' ? 'bg-primary-100 text-primary-700' : 'bg-secondary-100 text-secondary-700'}`;
const badgeEstado = (estado: string) => `text-[10px] font-black uppercase px-2 py-1 rounded-lg tracking-widest ${estado === 'PENDIENTE' ? 'bg-red-100 text-red-700' : 'bg-primary-100 text-primary-700'}`;
const badgeDonacion = (estado: string) => {
  if (!estado) return "bg-gray-100 text-gray-700 text-[10px] font-black uppercase px-2 py-1 rounded-lg tracking-widest";
  const e = estado.toLowerCase();
  if (e === 'disponible' || e === 'publicado') return "bg-green-100 text-green-700 text-[10px] font-black uppercase px-2 py-1 rounded-lg tracking-widest";
  if (e === 'reservado') return "bg-primary-100 text-primary-700 text-[10px] font-black uppercase px-2 py-1 rounded-lg tracking-widest";
  return "bg-secondary-100 text-secondary-700 text-[10px] font-black uppercase px-2 py-1 rounded-lg tracking-widest";
};
</script>