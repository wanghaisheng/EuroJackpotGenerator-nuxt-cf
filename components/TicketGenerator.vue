<template>
  <div>
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <div class="flex flex-col sm:flex-row items-center justify-between">
        <div class="w-full sm:w-1/2 mb-4 sm:mb-0 pr-0 sm:pr-2">
          <label for="numSets" class="mb-2 block text-gray-700">Generate tickets:</label>
          <div class="flex items-center">
            <input type="number" id="numSets" v-model="numSets" min="1" class="w-20 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500" aria-label="Number of sets">
            <button @click="generateTickets" class="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Generate</button>
          </div>
        </div>
        <div class="w-full sm:w-1/2 pl-0 sm:pl-2">
          <label class="mb-2 block text-gray-700">Simulate extraction:</label>
          <button @click="simulateExtraction" class="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">Simulate</button>
        </div>
      </div>
    </div>
    <div v-if="loading" class="text-center text-gray-600">Processing...</div>
    <div v-else-if="error" class="text-center text-red-600">{{ error }}</div>
    <SimulationResult v-if="simulationResult" :result="simulationResult" />
    <div v-if="tickets.length" class="space-y-8">
      <div v-for="set in tickets" :key="set.setNumber" class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-semibold mb-4 text-indigo-600">Set {{ set.setNumber }}</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Ticket
            v-for="(ticket, index) in set.tickets"
            :key="index"
            :ticket="ticket"
            :ticket-number="index + 1"
            :winning-numbers="simulationResult"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRuntimeConfig } from '#app'
import type { TicketSet, Ticket } from '~/types/ticket'
import SimulationResult from './SimulationResult.vue'

const config = useRuntimeConfig()
const numSets = ref(1)
const tickets = ref<TicketSet[]>([])
const loading = ref(false)
const error = ref('')
const simulationResult = ref<Ticket | null>(null)

const generateTickets = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await fetch(`${config.public.apiBase}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ numSets: numSets.value })
    })

    if (response.ok) {
      tickets.value = await response.json()
      checkWinningNumbers()
    } else {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Error generating tickets')
    }
  } catch (err) {
    console.error('Error:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const simulateExtraction = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await fetch(`${config.public.apiBase}/simulate`, {
      method: 'GET'
    })

    if (response.ok) {
      simulationResult.value = await response.json()
      checkWinningNumbers()
    } else {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Error simulating extraction')
    }
  } catch (err) {
    console.error('Error:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const checkWinningNumbers = () => {
  if (simulationResult.value && tickets.value.length > 0) {
    tickets.value.forEach(set => {
      set.tickets.forEach(ticket => {
        ticket.mainNumbers.forEach(number => {
          if (simulationResult.value?.mainNumbers.includes(number)) {
            ticket.winningMainNumbers = ticket.winningMainNumbers || []
            ticket.winningMainNumbers.push(number)
          }
        })
        ticket.euroNumbers.forEach(number => {
          if (simulationResult.value?.euroNumbers.includes(number)) {
            ticket.winningEuroNumbers = ticket.winningEuroNumbers || []
            ticket.winningEuroNumbers.push(number)
          }
        })
      })
    })
  }
}

watch(simulationResult, checkWinningNumbers)
watch(tickets, checkWinningNumbers)
</script>