<template>
  <div class="bg-gray-50 rounded p-4 shadow">
    <h3 class="font-semibold mb-2 text-gray-700">Ticket {{ ticketNumber }}</h3>
    <div class="mb-2">
      <span class="font-medium text-sm">Main Numbers:</span>
      <div class="flex flex-wrap gap-1 mt-1">
        <TicketNumber
          v-for="number in ticket.mainNumbers"
          :key="number"
          :number="number"
          :is-winner="ticket.winningMainNumbers?.includes(number) || false"
        />
      </div>
    </div>
    <div>
      <span class="font-medium text-sm">Euro Numbers:</span>
      <div class="flex flex-wrap gap-1 mt-1">
        <TicketNumber
          v-for="number in ticket.euroNumbers"
          :key="number"
          :number="number"
          :is-winner="ticket.winningEuroNumbers?.includes(number) || false"
        />
      </div>
    </div>
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