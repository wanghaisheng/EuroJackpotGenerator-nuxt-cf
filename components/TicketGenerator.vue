<template>
  <div>
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <div class="flex flex-col sm:flex-row items-center justify-between">
        <label for="numSets" class="mb-2 sm:mb-0 text-gray-700">Enter the number of sets:</label>
        <div class="flex items-center">
          <input type="number" id="numSets" v-model="numSets" min="1" class="w-20 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500" aria-label="Number of sets">
          <button @click="generateTickets" class="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Generate</button>
        </div>
      </div>
    </div>
    <div v-if="loading" class="text-center text-gray-600">Generating tickets...</div>
    <div v-else-if="error" class="text-center text-red-600">{{ error }}</div>
    <div v-else-if="tickets.length" class="space-y-8">
      <div v-for="set in tickets" :key="set.setNumber" class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-semibold mb-4 text-indigo-600">Set {{ set.setNumber }}</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Ticket
            v-for="(ticket, index) in set.tickets"
            :key="index"
            :ticket="ticket"
            :ticket-number="index + 1"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRuntimeConfig } from '#app'
import { TicketSet } from '~/types/ticket'

const config = useRuntimeConfig()
const numSets = ref(1)
const tickets = ref<TicketSet[]>([])
const loading = ref(false)
const error = ref('')

const generateTickets = async () => {
  loading.value = true
  error.value = ''
  tickets.value = []

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
</script>