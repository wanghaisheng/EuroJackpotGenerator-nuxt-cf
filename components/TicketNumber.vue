<template>
  <div :class="['inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold', isWinner ? 'bg-yellow-200 border-2 border-yellow-400' : 'bg-gray-200']">
    {{ number }}
  </div>
</template>

<script setup lang="ts">
interface Props {
  number: number;
  isWinner: boolean;
}

defineProps<Props>();
</script>
