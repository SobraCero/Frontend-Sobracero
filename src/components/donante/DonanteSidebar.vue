<template>
  <aside class="w-full md:w-72 bg-white border-r border-stone-200 p-6 flex flex-col justify-between z-10 md:sticky md:top-0 md:h-screen">
    <div>
      <div class="flex items-center gap-1 mb-10 group cursor-pointer">
        <img src="/logo-sobra-cero.png" alt="SobraCero" class="h-10 w-auto object-contain group-hover:rotate-12 transition-transform" />
        <h1 class="text-xl font-black tracking-tight text-emerald-900">SobraCero</h1>
      </div>
      <nav class="space-y-2">
        <button @click="$emit('update:seccion', 'publicar')" :class="navClass(seccion === 'publicar')">
          <PlusIcon class="w-5 h-5" /> Publicar Alimento
        </button>
        <button @click="$emit('update:seccion', 'mis-donaciones')" :class="navClass(seccion === 'mis-donaciones')">
          <BoxIcon class="w-5 h-5" /> Mis Donaciones
        </button>
        <button @click="$emit('update:seccion', 'historial')" :class="navClass(seccion === 'historial')">
          <HistoryIcon class="w-5 h-5" /> Historial de Entregas
        </button>
      </nav>
    </div>
    <div class="flex flex-col gap-2 mt-auto">
      <button @click="$emit('configurar')" class="flex items-center gap-3 p-4 hover:bg-stone-50 rounded-2xl border border-transparent hover:border-stone-200 transition-all">
        <img :src="perfil.foto" class="w-10 h-10 rounded-full object-cover border-2 border-emerald-100 shadow-sm" />
        <div class="text-left">
          <p class="text-sm font-bold leading-tight">{{ perfil.nombre }}</p>
          <p class="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Configurar Cuenta</p>
        </div>
        <SettingsIcon class="w-4 h-4 ml-auto text-stone-300" />
      </button>
      <button @click="$emit('cerrarSesion')" class="flex items-center gap-3 p-4 hover:bg-red-50 text-stone-500 hover:text-red-600 rounded-2xl border border-transparent transition-all group">
        <LogOutIcon class="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span class="text-sm font-bold">Cerrar Sesión</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { LeafIcon, PlusIcon, BoxIcon, HistoryIcon, SettingsIcon, LogOutIcon } from 'lucide-vue-next';

defineProps<{
  seccion: string;
  perfil: { nombre: string; foto: string };
}>();

defineEmits(['update:seccion', 'configurar', 'cerrarSesion']);

const navClass = (active: boolean) => `
  w-full flex items-center gap-3 p-3.5 rounded-2xl text-sm font-bold transition-all
  ${active ? 'bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-100' : 'text-stone-400 hover:text-stone-600 hover:bg-stone-50'}
`;
</script>
