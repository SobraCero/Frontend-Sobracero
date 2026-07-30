<template>
  <div class="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm text-stone-600">
        <thead class="bg-stone-50 text-stone-800 font-black uppercase text-[10px] tracking-wider border-b border-stone-200">
          <tr>
            <th v-for="h in headers" :key="h" scope="col" class="px-6 py-4" :class="h === 'Acciones' ? 'text-center' : ''">{{ h }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-stone-100">
          <slot></slot>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  headers: string[];
}>();
</script>
