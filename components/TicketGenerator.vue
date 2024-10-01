<template>
  <div>
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <div class="flex flex-col sm:flex-row items-center justify-between">
        <div class="w-full sm:w-1/3 mb-4 sm:mb-0 pr-0 sm:pr-2">
          <label for="ticketType" class="mb-2 block text-gray-700">Ticket Type:</label>
          <select
            id="ticketType"
            v-model="selectedTicketType"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Ticket Type"
          >
            <option v-for="type in ticketTypes" :key="type.label" :value="type">
              {{ type.label }} (€{{ type.price }})
            </option>
          </select>
        </div>
        <div class="w-full sm:w-1/3 mb-4 sm:mb-0 px-2">
          <label for="ticketCount" class="mb-2 block text-gray-700">Number of Tickets:</label>
          <input
            type="number"
            id="ticketCount"
            v-model.number="ticketCount"
            min="1"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Number of Tickets"
          />
        </div>
        <div class="w-full sm:w-1/3 pl-2">
          <label class="mb-2 block text-gray-700">Total Price:</label>
          <div class="flex items-center">
            <span class="text-lg font-semibold">€{{ totalPrice.toFixed(2) }}</span>
          </div>
        </div>
      </div>
      
      <!-- Add Total Winnings Display -->
      <div class="flex flex-col sm:flex-row items-center justify-between mt-4">
        <div class="w-full sm:w-1/3 mb-4 sm:mb-0 pr-0 sm:pr-2">
          <label class="mb-2 block text-gray-700">Total Winnings:</label>
          <div class="flex items-center">
            <span class="text-lg font-semibold">€{{ totalWinnings.toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <div class="flex justify-end mt-4">
        <button
          @click="generateTickets"
          class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mr-2"
        >
          Generate Tickets
        </button>
        <button
          @click="simulateExtraction"
          class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Simulate Extraction
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center text-gray-600">Processing...</div>
    <div v-else-if="error" class="text-center text-red-600">{{ error }}</div>
    <SimulationResult v-if="simulationResult" :result="simulationResult" />
    <div v-if="tickets.length" class="space-y-8">
      <div v-for="ticket in tickets" :key="ticket.id" class="bg-white rounded-lg shadow-md p-6">
        <TicketComponent :ticket="ticket" :ticket-number="ticket.id" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRuntimeConfig } from '#app'
import type { Ticket } from '~/types/ticket'
import SimulationResult from './SimulationResult.vue'
import TicketComponent from './Ticket.vue'
import { fetchLatestWinningData, calculateTotalWinnings } from '~/utils/winningManager'
import { determineWinClass } from '~/utils/winningClasses'

interface TicketType {
  label: string
  mainCount: number
  euroCount: number
  price: number
}

const ticketTypes: TicketType[] = [
  { label: 'System 5/2', mainCount: 5, euroCount: 2, price: 2.00 },
  { label: 'System 5/3', mainCount: 5, euroCount: 3, price: 6.00 },
  { label: 'System 5/4', mainCount: 5, euroCount: 4, price: 12.00 },
  { label: 'System 5/5', mainCount: 5, euroCount: 5, price: 20.00 },
  { label: 'System 5/6', mainCount: 5, euroCount: 6, price: 30.00 },
  { label: 'System 5/7', mainCount: 5, euroCount: 7, price: 42.00 },
  { label: 'System 5/8', mainCount: 5, euroCount: 8, price: 56.00 },
  { label: 'System 5/9', mainCount: 5, euroCount: 9, price: 72.00 },
  { label: 'System 5/10', mainCount: 5, euroCount: 10, price: 90.00 },
  { label: 'System 5/11', mainCount: 5, euroCount: 11, price: 110.00 },
  { label: 'System 5/12', mainCount: 5, euroCount: 12, price: 132.00 },
  { label: 'System 6/2', mainCount: 6, euroCount: 2, price: 12.00 },
  { label: 'System 6/3', mainCount: 6, euroCount: 3, price: 36.00 },
  { label: 'System 6/4', mainCount: 6, euroCount: 4, price: 72.00 },
  { label: 'System 6/5', mainCount: 6, euroCount: 5, price: 120.00 },
  { label: 'System 6/6', mainCount: 6, euroCount: 6, price: 180.00 },
  { label: 'System 6/7', mainCount: 6, euroCount: 7, price: 252.00 },
  { label: 'System 6/8', mainCount: 6, euroCount: 8, price: 336.00 },
  { label: 'System 6/9', mainCount: 6, euroCount: 9, price: 432.00 },
  { label: 'System 6/10', mainCount: 6, euroCount: 10, price: 540.00 },
  { label: 'System 6/11', mainCount: 6, euroCount: 11, price: 660.00 },
  { label: 'System 6/12', mainCount: 6, euroCount: 12, price: 792.00 },
  { label: 'System 7/2', mainCount: 7, euroCount: 2, price: 42.00 },
  { label: 'System 7/3', mainCount: 7, euroCount: 3, price: 126.00 },
  { label: 'System 7/4', mainCount: 7, euroCount: 4, price: 252.00 },
  { label: 'System 7/5', mainCount: 7, euroCount: 5, price: 420.00 },
  { label: 'System 7/6', mainCount: 7, euroCount: 6, price: 630.00 },
  { label: 'System 7/7', mainCount: 7, euroCount: 7, price: 882.00 },
  { label: 'System 7/8', mainCount: 7, euroCount: 8, price: 1176.00 },
  { label: 'System 8/2', mainCount: 8, euroCount: 2, price: 112.00 },
  { label: 'System 8/3', mainCount: 8, euroCount: 3, price: 336.00 },
  { label: 'System 8/4', mainCount: 8, euroCount: 4, price: 672.00 },
  { label: 'System 8/5', mainCount: 8, euroCount: 5, price: 1120.00 },
  { label: 'System 9/2', mainCount: 9, euroCount: 2, price: 252.00 },
  { label: 'System 9/3', mainCount: 9, euroCount: 3, price: 756.00 },
  { label: 'System 10/2', mainCount: 10, euroCount: 2, price: 504.00 },
  { label: 'System 11/2', mainCount: 11, euroCount: 2, price: 924.00 },
]

const selectedTicketType = ref<TicketType>(ticketTypes[0])
const ticketCount = ref<number>(1)
const totalPrice = computed(() => selectedTicketType.value.price * ticketCount.value)

const tickets = ref<Ticket[]>([])
const loading = ref(false)
const error = ref('')
const simulationResult = ref<Ticket | null>(null)
const totalWinnings = ref<number>(0)

const config = useRuntimeConfig()

const generateTickets = async () => {
  loading.value = true;
  error.value = '';
  tickets.value = [];
  totalWinnings.value = 0;
  simulationResult.value = null; // Reset simulation result

  try {
    const response = await fetch(`${config.public.apiBase}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ticketCount: ticketCount.value,
        mainCount: selectedTicketType.value.mainCount,
        euroCount: selectedTicketType.value.euroCount
      })
    });

    if (response.ok) {
      tickets.value = await response.json();
      // Remove the winning data calculation here, as we haven't simulated yet
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error generating tickets');
    }
  } catch (err: any) {
    console.error('Error:', err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const simulateExtraction = async () => {
  loading.value = true;
  error.value = '';
  simulationResult.value = null;
  totalWinnings.value = 0;

  try {
    const response = await fetch(`${config.public.apiBase}/simulate`, {
      method: 'GET'
    });

    if (response.ok) {
      simulationResult.value = await response.json();
      checkWinningNumbers();
      const winningData = await fetchLatestWinningData();
      if (winningData) {
        totalWinnings.value = calculateTotalWinnings(tickets.value, winningData);
      } else {
        console.warn('Unable to calculate total winnings: winning data not available');
      }
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error simulating extraction');
    }
  } catch (err: any) {
    console.error('Error:', err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

// components/TicketGenerator.vue
const checkWinningNumbers = () => {
  if (simulationResult.value && tickets.value.length > 0) {
    tickets.value.forEach(ticket => {
      // Reset previous winning information
      ticket.winningMainNumbers = undefined;
      ticket.winningEuroNumbers = undefined;
      ticket.winClass = undefined;

      const matchedMain = simulationResult.value!.mainNumbers.filter(num => ticket.mainNumbers.includes(num)).length;
      const matchedEuro = simulationResult.value!.euroNumbers.filter(num => ticket.euroNumbers.includes(num)).length;

      const winClass = determineWinClass(matchedMain, matchedEuro);

      if (winClass) {
        ticket.winClass = winClass;
      }

      // Mark winning main numbers
      ticket.winningMainNumbers = ticket.mainNumbers.filter(number => simulationResult.value!.mainNumbers.includes(number));

      // Mark winning euro numbers
      ticket.winningEuroNumbers = ticket.euroNumbers.filter(number => simulationResult.value!.euroNumbers.includes(number));
    });

    // Sort tickets: winners first, then by win class
    tickets.value.sort((a, b) => {
      if (a.winClass && !b.winClass) return -1;
      if (!a.winClass && b.winClass) return 1;
      if (a.winClass && b.winClass) return a.winClass - b.winClass;
      return 0;
    });
  }
};


const fetchLatestWinningData = async () => {
  try {
    const response = await fetch(`${config.public.apiBase}/fetchWinningData`);
    if (!response.ok) {
      console.error('Error fetching winning data:', error);
      const fallbackData = await response.json();
      console.log('Using fallback winning data:', fallbackData);
      return fallbackData;
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching winning data:', error);
    error.value = error instanceof Error ? error.message : 'An error occurred while fetching winning data';
    return null;
  }
};
</script>

<style scoped>
/* Add any necessary styles */
</style>