<template>
  <div class="bg-gray-50 rounded p-4 shadow">
    <h3 class="font-semibold mb-2 text-gray-700">Ticket {{ ticketNumber }}</h3>
    <p class="text-sm"><span class="font-medium">Main Numbers:</span> {{ ticket.mainNumbers.join(', ') }}</p>
    <p class="text-sm"><span class="font-medium">Euro Numbers:</span> {{ ticket.euroNumbers.join(', ') }}</p>
  </div>
</template>

<script setup lang="ts">
import { Ticket } from '~/types/ticket';

interface Props {
  ticket: Ticket;
  ticketNumber: number;
}

defineProps<Props>();
</script>
