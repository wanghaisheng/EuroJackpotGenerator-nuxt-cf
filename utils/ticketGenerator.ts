import { fetchStatistics } from './statisticsManager';
import { generateNumbersWithStats, generateRandomNumbers } from './numberGenerator';
import type { Ticket } from '~/types/ticket';
import type { StatisticsData } from '../types/statistics';

let ticketIdCounter = 1;

export async function generateTickets(
  ticketCount: number,
  mainCount: number,
  euroCount: number
): Promise<Ticket[]> {
  let statsData: StatisticsData | null = null;
  try {
    statsData = await fetchStatistics();
  } catch (error) {
    console.error('Failed to fetch statistics, using random generation:', error);
  }

  const generatedTickets = [];
  const uniqueTickets = new Set<string>();

  for (let i = 0; i < ticketCount; i++) {
    let mainNumbers: number[];
    let euroNumbers: number[];
    let ticketKey: string;
    let retries = 0;
    const MAX_RETRIES = 10;

    do {
      try {
        if (statsData) {
          mainNumbers = generateNumbersWithStats(mainCount, statsData.numbers);
          euroNumbers = generateNumbersWithStats(euroCount, statsData.additionalNumbers);
        } else {
          mainNumbers = generateRandomNumbers(mainCount, 1, 50);
          euroNumbers = generateRandomNumbers(euroCount, 1, 12);
        }
      } catch (error) {
        console.error('Error generating numbers, falling back to random:', error);
        mainNumbers = generateRandomNumbers(mainCount, 1, 50);
        euroNumbers = generateRandomNumbers(euroCount, 1, 12);
      }
      ticketKey = mainNumbers.join(',') + '|' + euroNumbers.join(',');
      retries += 1;

      if (retries > MAX_RETRIES) {
        throw new Error('Max retries exceeded while generating unique tickets.');
      }
    } while (uniqueTickets.has(ticketKey));

    uniqueTickets.add(ticketKey);

    generatedTickets.push({
      id: ticketIdCounter++, // Assign a unique ID for each ticket
      mainNumbers,
      euroNumbers
    });
  }

  return generatedTickets;
}