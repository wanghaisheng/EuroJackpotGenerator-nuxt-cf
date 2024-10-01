import { fetchStatistics } from './statisticsManager';
import { generateNumbersWithStats, generateRandomNumbers } from './numberGenerator';
import type { Ticket, TicketSet } from '~/types/ticket';
import type { StatisticsData } from '../types/statistics';

export async function generateTickets(numSets: number): Promise<TicketSet[]> {
  let statsData: StatisticsData | null = null;
  try {
    statsData = await fetchStatistics();
  } catch (error) {
    console.error('Failed to fetch statistics, using random generation:', error);
  }

  const generatedTickets = new Set<string>();
  const sets: TicketSet[] = [];

  for (let setIndex = 0; setIndex < numSets; setIndex++) {
    const tickets: Ticket[] = [];

    for (let ticketIndex = 0; ticketIndex < 12; ticketIndex++) {
      let mainNumbers: number[];
      let euroNumbers: number[];
      let ticketKey: string;
      let retries = 0;
      const MAX_RETRIES = 10;

      do {
        try {
          if (statsData) {
            mainNumbers = generateNumbersWithStats(5, statsData.numbers);
            euroNumbers = generateNumbersWithStats(2, statsData.additionalNumbers);
          } else {
            mainNumbers = generateRandomNumbers(5, 1, 50);
            euroNumbers = generateRandomNumbers(2, 1, 12);
          }
        } catch (error) {
          console.error('Error generating numbers, falling back to random:', error);
          mainNumbers = generateRandomNumbers(5, 1, 50);
          euroNumbers = generateRandomNumbers(2, 1, 12);
        }
        ticketKey = mainNumbers.join(',') + '|' + euroNumbers.join(',');
        retries += 1;

        if (retries > MAX_RETRIES) {
          throw new Error('Max retries exceeded while generating unique tickets.');
        }
      } while (generatedTickets.has(ticketKey));

      generatedTickets.add(ticketKey);

      tickets.push({
        mainNumbers: mainNumbers,
        euroNumbers: euroNumbers,
      });
    }

    sets.push({
      setNumber: setIndex + 1,
      tickets: tickets,
    });
  }

  return sets;
}