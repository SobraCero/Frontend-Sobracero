<template>
  <div class="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col md:flex-row gap-6 items-center hover:border-emerald-200 transition-colors">
    <div class="flex-1 w-full">
      <div class="flex items-center gap-3 mb-2">
        <span :class="badgeRol">{{ usuario.rol }}</span>
        <span :class="badgeEstado">{{ usuario.estado }}</span>
        <h3 class="text-lg font-black text-slate-900 ml-2">{{ usuario.razonSocial }}</h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4 p-5 bg-stone-50 rounded-2xl border border-stone-100 w-full">
        
        <!-- Contacto y RUT -->
        <div class="space-y-4">
          <div class="flex items-center gap-2.5 text-stone-700">
            <MailIcon class="w-4 h-4 text-emerald-600 shrink-0" />
            <span class="truncate">{{ usuario.email }}</span>
          </div>
          <div class="flex items-center gap-2.5 text-stone-700">
            <PhoneIcon class="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{{ usuario.telefono }}</span>
          </div>
          <div v-if="usuario.rut" class="flex items-center gap-2.5 text-stone-700">
            <CreditCardIcon class="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span class="font-bold text-stone-500 mr-1">RUT:</span>
              <span class="font-bold">{{ usuario.rut }}</span>
            </div>
          </div>
        </div>

        <!-- Responsable y Ubicación -->
        <div class="space-y-4">
          <div v-if="usuario.nombreResponsable" class="flex items-start gap-2.5 text-stone-700">
            <UserIcon class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span class="font-bold text-stone-500 block mb-0.5">Responsable:</span>
              <span>{{ usuario.nombreResponsable }}</span>
              <span v-if="usuario.cargoResponsable" class="text-stone-500 block text-xs mt-0.5">({{ usuario.cargoResponsable }})</span>
            </div>
          </div>

          <div v-if="usuario.direccion" class="flex items-start gap-2.5 text-stone-700">
            <MapPinIcon class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span>{{ usuario.direccion }}</span>
              <span v-if="usuario.comuna || usuario.region" class="text-stone-500 block text-xs mt-0.5">
                ({{ usuario.comuna }}{{ usuario.comuna && usuario.region ? ', ' : '' }}{{ usuario.region }})
              </span>
              <button @click="$emit('ver-mapa', usuario)" class="mt-1 text-emerald-600 hover:text-emerald-700 font-bold text-xs hover:underline flex items-center transition-colors">
                Ver en mapa →
              </button>
            </div>
          </div>
        </div>

        <!-- Documento -->
        <div v-if="usuario.documentoUrl" class="md:col-span-2 pt-4 mt-1 border-t border-stone-200">
          <button @click="$emit('ver-documento', usuario.documentoUrl)" class="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm">
            <FileTextIcon class="w-4 h-4" />
            Revisar Documento de Respaldo
          </button>
        </div>

      </div>
    </div>

    <div class="flex flex-wrap gap-2 w-full md:w-auto justify-end">
      <slot name="acciones"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MailIcon, PhoneIcon, MapPinIcon, FileTextIcon, UserIcon, CreditCardIcon } from 'lucide-vue-next';

defineProps<{
  usuario: any;
  badgeRol: string;
  badgeEstado: string;
}>();

defineEmits(['ver-mapa', 'ver-documento']);
</script>
