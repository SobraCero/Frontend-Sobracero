<template>
  <aside class="w-full md:w-72 bg-slate-900 text-white p-6 flex flex-col justify-between shadow-xl z-10 md:sticky md:top-0 md:h-screen">
    <div>
      <div class="flex items-center gap-1 mb-10">
        <img src="/logo-sobra-cero.png" alt="SobraCero" class="h-10 w-auto object-contain hover:scale-105 transition-transform" />
        <h1 class="text-xl font-black tracking-tight">SobraCero Admin</h1>
      </div>
      <nav class="space-y-2">
        <button @click="$emit('update:seccionActual', 'usuarios')" :class="['w-full flex items-center gap-3 p-3.5 rounded-2xl text-sm font-bold transition-all', seccionActual === 'usuarios' ? 'bg-white/20 text-white' : 'text-stone-300 hover:bg-white/10 hover:text-white']">
          <UsersIcon class="w-5 h-5" /> Gestión de Usuarios
        </button>
        <button @click="$emit('update:seccionActual', 'donaciones')" :class="['w-full flex items-center gap-3 p-3.5 rounded-2xl text-sm font-bold transition-all', seccionActual === 'donaciones' ? 'bg-white/20 text-white' : 'text-stone-300 hover:bg-white/10 hover:text-white']">
          <BoxIcon class="w-5 h-5" /> Donaciones Generales
        </button>
        <button @click="$emit('update:seccionActual', 'historial')" :class="['w-full flex items-center gap-3 p-3.5 rounded-2xl text-sm font-bold transition-all', seccionActual === 'historial' ? 'bg-white/20 text-white' : 'text-stone-300 hover:bg-white/10 hover:text-white']">
          <ActivityIcon class="w-5 h-5" /> Historial de Publicaciones
        </button>
      </nav>
    </div>
    <div class="mt-auto">
      <button @click="$emit('cerrarSesion')" class="flex items-center gap-3 p-4 hover:bg-white/5 text-stone-300 hover:text-white rounded-2xl w-full transition-all group">
        <LogOutIcon class="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span class="text-sm font-bold">Salir</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ShieldCheckIcon, UsersIcon, BoxIcon, ActivityIcon, LogOutIcon } from 'lucide-vue-next';

defineProps<{
  seccionActual: string;
}>();

defineEmits(['update:seccionActual', 'cerrarSesion']);
</script>
