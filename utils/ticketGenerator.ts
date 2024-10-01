import { fetchStatistics } from './statisticsManager';
import { generateNumbersWithStats, generateRandomNumbers } from './numberGenerator';
import { Ticket, TicketSet } from '~/types/ticket';

export async function generateTickets(numSets: number): Promise<TicketSet[]> {
  const statsData = await fetchStatistics();
  const generatedTickets = new Set<string>();
  const sets: TicketSet[] = [];

  for (let setIndex = 0; setIndex < numSets; setIndex++) {
    const tickets: Ticket[] = [];

    for (let ticketIndex = 0; ticketIndex < 12; ticketIndex++) {
      let mainNumbers: number[], euroNumbers: number[], ticketKey: string;

      do {
        if (statsData) {
          mainNumbers = generateNumbersWithStats(5, statsData.numbers);
          euroNumbers = generateNumbersWithStats(2, statsData.additionalNumbers);
        } else {
          mainNumbers = generateRandomNumbers(5, 1, 50);
          euroNumbers = generateRandomNumbers(2, 1, 12);
        }
        ticketKey = mainNumbers.join(',') + '|' + euroNumbers.join(',');
      } while (generatedTickets.has(ticketKey));

      generatedTickets.add(ticketKey);

      tickets.push({ mainNumbers, euroNumbers });
    }

    sets.push({ setNumber: setIndex + 1, tickets });
  }

  return sets;
}