<template>
  <div class="min-h-screen bg-[#fafaf9] flex flex-col md:flex-row text-slate-800 font-sans">
    <slot name="sidebar"></slot>
    
    <main class="flex-1 p-8 overflow-y-auto relative">
      <slot></slot>
    </main>

    <slot name="modals"></slot>
  </div>
</template>
