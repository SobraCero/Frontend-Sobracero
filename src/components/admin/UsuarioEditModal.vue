<template>
  <GenericModal :isOpen="isOpen" @close="$emit('close')" maxWidthClass="max-w-md">
    <h3 class="text-2xl font-black text-slate-900 mb-6">Editar Usuario</h3>
    <form @submit.prevent="$emit('guardar')" class="space-y-4">
      <div>
        <label class="text-xs font-bold text-stone-500 uppercase tracking-wider">Razón Social</label>
        <input v-model="form.razonSocial" type="text" class="w-full bg-stone-50 border border-stone-200 text-stone-700 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
      </div>
      <div>
        <label class="text-xs font-bold text-stone-500 uppercase tracking-wider">Correo</label>
        <input v-model="form.email" type="email" class="w-full bg-stone-50 border border-stone-200 text-stone-700 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
      </div>
      <div>
        <label class="text-xs font-bold text-stone-500 uppercase tracking-wider">Teléfono</label>
        <input v-model="form.telefono" type="text" class="w-full bg-stone-50 border border-stone-200 text-stone-700 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
      </div>
      <div>
        <label class="text-xs font-bold text-stone-500 uppercase tracking-wider">Dirección</label>
        <input v-model="form.direccion" type="text" class="w-full bg-stone-50 border border-stone-200 text-stone-700 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
      </div>
      <div>
        <label class="text-xs font-bold text-stone-500 uppercase tracking-wider">Nueva Contraseña (Opcional)</label>
        <input v-model="form.password" type="text" placeholder="Dejar en blanco para no cambiar" class="w-full bg-stone-50 border border-stone-200 text-stone-700 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
      </div>
      <div class="flex gap-3 mt-6">
        <button type="button" @click="$emit('close')" class="flex-1 py-3 bg-stone-200 text-stone-700 font-bold rounded-xl hover:bg-stone-300 transition-colors">Cancelar</button>
        <button type="submit" class="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors">Guardar</button>
      </div>
    </form>
  </GenericModal>
</template>

<script setup lang="ts">
import GenericModal from '../common/GenericModal.vue';

defineProps<{
  isOpen: boolean;
  form: any;
}>();

defineEmits(['close', 'guardar']);
</script>
