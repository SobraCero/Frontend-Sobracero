<template>
  <div v-if="isOpen" class="fixed inset-0 bg-stone-900/60 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm">
    <div :class="['bg-white rounded-[2rem] sm:rounded-[2.5rem] w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in zoom-in-95 duration-200', maxWidthClass]">
      <button @click="$emit('close')" class="absolute top-4 sm:top-6 right-4 sm:right-6 p-2 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors z-10">
        <XIcon class="w-5 h-5 text-stone-600" />
      </button>
      <div class="p-6 sm:p-8">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { XIcon } from 'lucide-vue-next';

withDefaults(defineProps<{
  isOpen: boolean;
  maxWidthClass?: string;
}>(), {
  maxWidthClass: 'max-w-md'
});

defineEmits(['close']);
</script>
