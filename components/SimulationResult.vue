<template>
  <div class="bg-white rounded-lg shadow-md p-6 mb-8">
    <h2 class="text-2xl font-semibold mb-4 text-green-600">Simulated Extraction</h2>
    <div class="flex flex-col sm:flex-row justify-between">
      <div class="mb-4 sm:mb-0">
        <h3 class="font-semibold text-gray-700">Main Numbers:</h3>
        <div class="flex flex-wrap gap-2">
          <TicketNumber v-for="number in result.mainNumbers" :key="number" :number="number" :is-winner="true" />
        </div>
      </div>
      <div>
        <h3 class="font-semibold text-gray-700">Euro Numbers:</h3>
        <div class="flex flex-wrap gap-2">
          <TicketNumber v-for="number in result.euroNumbers" :key="number" :number="number" :is-winner="true" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ticket } from '~/types/ticket';
import TicketNumber from './TicketNumber.vue';

interface Props {
  result: Ticket;
}

defineProps<Props>();
</script>