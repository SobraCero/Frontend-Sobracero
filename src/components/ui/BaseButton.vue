<template>
  <button
    :class="[
      'inline-flex justify-center items-center gap-2 font-bold transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
      sizeClasses[size],
      variantClasses[variant],
      roundedClasses[rounded],
      { 'w-full': block }
    ]"
    :disabled="disabled || loading"
    v-bind="$attrs"
  >
    <slot name="icon-left"></slot>
    
    <span v-if="loading" class="animate-spin inline-block w-4 h-4 border-[2px] border-current border-t-transparent rounded-full mr-2"></span>
    
    <slot></slot>
    
    <slot name="icon-right"></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value: string) => ['primary', 'secondary', 'accent', 'danger', 'outline', 'ghost'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value: string) => ['sm', 'md', 'lg'].includes(value)
  },
  rounded: {
    type: String,
    default: 'xl',
    validator: (value: string) => ['sm', 'md', 'lg', 'xl', '2xl', 'full'].includes(value)
  },
  block: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const sizeClasses: Record<string, string> = {
  sm: 'py-1.5 px-3 text-xs',
  md: 'py-2.5 px-4 text-sm',
  lg: 'py-4 px-6 text-base'
};

const roundedClasses: Record<string, string> = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full'
};

const variantClasses: Record<string, string> = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-md shadow-primary-600/20',
  secondary: 'bg-secondary-900 text-white hover:bg-secondary-800 shadow-md shadow-secondary-900/20',
  accent: 'bg-accent-600 text-white hover:bg-accent-700 shadow-md shadow-accent-600/20',
  danger: 'bg-red-50 text-red-600 hover:bg-red-100',
  outline: 'border-2 border-base-200 bg-transparent text-base-600 hover:bg-base-50 hover:text-base-900 hover:border-base-300',
  ghost: 'bg-transparent text-base-500 hover:bg-base-100 hover:text-base-800'
};
</script>
