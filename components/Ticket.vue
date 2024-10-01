<template>
  <div :class="['bg-gray-50 rounded p-4 shadow', isWinner ? 'bg-yellow-100' : '']">
    <h3 class="font-semibold mb-2 text-gray-700">
      Ticket {{ ticketNumber }}<span v-if="ticket.winClass"> - Winner class {{ ticket.winClass }}</span>
    </h3>
    <div class="mb-2">
      <span class="font-medium text-sm">Main Numbers:</span>
      <div class="flex flex-wrap gap-1 mt-1">
        <TicketNumber
          v-for="number in ticket.mainNumbers"
          :key="number"
          :number="number"
          :isWinner="ticket.winningMainNumbers?.includes(number) || false"
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
          :isWinner="ticket.winningEuroNumbers?.includes(number) || false"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Ticket } from '~/types/ticket'
import TicketNumber from './TicketNumber.vue'

interface Props {
  ticket: Ticket
  ticketNumber: number
}

const props = defineProps<Props>()

const isWinner = computed(() => !!props.ticket.winClass)
</script>