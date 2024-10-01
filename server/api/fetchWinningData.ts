import { H3Error, createError } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    const url = generateNearestEurojackpotUrl();
    console.log('Fetching winning data from:', url);

    const response = await fetch(url, { 
      headers: { Accept: 'application/json' },
      timeout: 10000 // 10 seconds timeout
    });

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      // Attempt to read and log the error response body
      const errorBody = await response.text();
      console.error('Error response body:', errorBody);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Winning data fetched successfully');
    return data;
  } catch (error) {
    console.error('Error fetching winning data:', error);
    
    // Implement fallback mechanism
    const fallbackData = getFallbackWinningData();
    console.log('Using fallback winning data');
    
    return fallbackData;
  }
});

function generateNearestEurojackpotUrl() {
  const baseUrl = "https://www.lotto-bayern.de/getEurojackpotHistoricOdds?gckey=";

  // Get the current date
  const today = new Date();

  // Helper function to get the previous draw date (Tuesday or Friday)
  function getPreviousDrawDate(date) {
      const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      const drawDays = [2, 5]; // Tuesday and Friday

      // Calculate days since last draw day
      const daysSinceLastDraw = drawDays
          .map(drawDay => (dayOfWeek - drawDay + 7) % 7)
          .sort((a, b) => a - b)[0];

      const lastDrawDate = new Date(date);
      lastDrawDate.setDate(date.getDate() - daysSinceLastDraw);
      return lastDrawDate;
  }

  // Function to get ISO week number
  function getISOWeekNumber(date) {
      const target = new Date(date.valueOf());
      const dayNr = (date.getDay() + 6) % 7;
      target.setDate(target.getDate() - dayNr + 3);
      const firstThursday = target.getTime();
      target.setMonth(0, 1);
      if (target.getDay() !== 4) {
          target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
      }
      const weekNumber = 1 + Math.ceil((firstThursday - target) / 604800000);
      return weekNumber;
  }

  const lastDrawDate = getPreviousDrawDate(today);
  const weekNumber = getISOWeekNumber(lastDrawDate);
  const year = lastDrawDate.getFullYear();
  const drawDay = lastDrawDate.getDay(); // 2 for Tuesday, 5 for Friday

  const gckey = `${year}-${weekNumber}-${drawDay}`;
  const fullUrl = `${baseUrl}${gckey}`;

  return fullUrl;
}

function getFallbackWinningData() {
  return {
    eurojackpotGameCycle: {
      cycleNo: 0,
      cycleYear: new Date().getFullYear(),
      eventDate: Date.now(),
      eventWeekday: new Date().getDay(),
      key: "fallback",
      variantNo: 0,
    },
    eurojackpotOdds: [
      { amount: 10000000, numberOfWins: 0, winningClass: 1, sequence: 1, jackpot: true },
      { amount: 500000, numberOfWins: 0, winningClass: 2, sequence: 2, jackpot: false },
      { amount: 10000, numberOfWins: 0, winningClass: 3, sequence: 3, jackpot: false },
      { amount: 500, numberOfWins: 0, winningClass: 4, sequence: 4, jackpot: false },
      { amount: 50, numberOfWins: 0, winningClass: 5, sequence: 5, jackpot: false },
      { amount: 20, numberOfWins: 0, winningClass: 6, sequence: 6, jackpot: false },
      { amount: 10, numberOfWins: 0, winningClass: 7, sequence: 7, jackpot: false },
      { amount: 5, numberOfWins: 0, winningClass: 8, sequence: 8, jackpot: false },
      { amount: 2, numberOfWins: 0, winningClass: 9, sequence: 9, jackpot: false },
      { amount: 1, numberOfWins: 0, winningClass: 10, sequence: 10, jackpot: false },
      { amount: 0.5, numberOfWins: 0, winningClass: 11, sequence: 11, jackpot: false },
      { amount: 0.2, numberOfWins: 0, winningClass: 12, sequence: 12, jackpot: false },
    ],
    eurojackpotTurnover: [
      { amount: 50000000, jurisdiction: 0 },
    ],
  };
}