<template>
  <aside class="w-full md:w-72 bg-primary-600 text-white p-6 flex flex-col justify-between shadow-xl z-10 md:sticky md:top-0 md:h-screen">
    <div>
      <div class="flex items-center gap-1 mb-10">
        <img src="/logo-sobra-cero.png" alt="SobraCero" class="h-10 w-auto object-contain hover:scale-105 transition-transform brightness-0 invert" />
        <h1 class="text-xl font-black tracking-tight">Panel Receptor</h1>
      </div>
      <nav class="space-y-2">
        <button @click="$emit('update:seccion', 'explorar')" :class="navClass(seccion === 'explorar')">
          <BoxIcon class="w-5 h-5" /> Explorar Donaciones
        </button>
        <button @click="$emit('update:seccion', 'activa')" :class="navClass(seccion === 'activa')">
          <KeyIcon class="w-5 h-5" /> Mi Reserva Activa
        </button>
      </nav>
    </div>
    <div class="flex flex-col gap-2 mt-auto">
      <button @click="$emit('configurar')" class="flex items-center gap-3 p-4 hover:bg-white/10 rounded-2xl border border-transparent transition-all">
        <img :src="perfil.foto" class="w-10 h-10 rounded-full object-cover border-2 border-primary-200 shadow-sm" />
        <div class="text-left text-white">
          <p class="text-sm font-bold leading-tight">{{ perfil.nombre }}</p>
          <p class="text-[10px] text-primary-200 font-bold uppercase tracking-wider">Configurar Cuenta</p>
        </div>
        <SettingsIcon class="w-4 h-4 ml-auto text-primary-300" />
      </button>
      <button @click="$emit('cerrarSesion')" class="flex items-center gap-3 p-4 hover:bg-white/10 text-primary-100 hover:text-white rounded-2xl w-full transition-all group">
        <LogOutIcon class="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span class="text-sm font-bold">Cerrar Sesión</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { HeartIcon, BoxIcon, KeyIcon, XIcon, LogOutIcon, SettingsIcon } from 'lucide-vue-next';

defineProps<{
  seccion: string;
  perfil: { nombre: string; foto: string };
}>();

defineEmits(['update:seccion', 'configurar', 'cerrarSesion']);

const navClass = (active: boolean) => `
  w-full flex items-center gap-3 p-3.5 rounded-2xl text-sm font-bold transition-all shadow-sm
  ${active ? 'bg-white text-primary-600' : 'bg-white/10 text-white hover:bg-white/20'}
`;
</script>
