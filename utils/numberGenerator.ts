import type { StatisticsData } from '../types/statistics';

export function generateNumbersWithStats(count: number, stats: StatisticsData['numbers'] | StatisticsData['additionalNumbers']): number[] {
  if (!stats || stats.length === 0) {
    console.warn('No valid statistics data provided. Falling back to random number generation.');
    return generateRandomNumbers(count, 1, count > 2 ? 50 : 12);
  }

  // Calculate total adjusted counts using square root to smooth probabilities
  const adjustedStats = stats.map(item => ({
    number: item.number,
    adjustedValue: Math.sqrt(item.value),
  }));

  // Filter out any invalid entries
  const validAdjustedStats = adjustedStats.filter(item => 
    Number.isInteger(item.number) &&
    Number.isFinite(item.adjustedValue) &&
    item.adjustedValue > 0
  );

  if (validAdjustedStats.length === 0) {
    console.warn('No valid adjusted statistics. Falling back to random number generation.');
    return generateRandomNumbers(count, 1, count > 2 ? 50 : 12);
  }

  // Initialize an empty array for cumulative distribution
  const cumulativeDistribution: { number: number; cumulative: number }[] = [];
  let cumulativeSum = 0;

  // Build the cumulative distribution sequentially
  for (const item of validAdjustedStats) {
    cumulativeSum += item.adjustedValue;
    cumulativeDistribution.push({
      number: item.number,
      cumulative: cumulativeSum,
    });
  }

  // Check if the cumulative distribution is valid
  if (cumulativeDistribution.length === 0 || !isFinite(cumulativeSum) || cumulativeSum <= 0) {
    console.warn('Invalid cumulative distribution. Falling back to random number generation.');
    return generateRandomNumbers(count, 1, count > 2 ? 50 : 12);
  }

  const totalAdjustedValue = cumulativeSum;

  const selectedNumbers = new Set<number>();

  while (selectedNumbers.size < count) {
    const rand = Math.random() * totalAdjustedValue;
    const selected = cumulativeDistribution.find(item => rand < item.cumulative)?.number;
    if (selected !== undefined) {
      selectedNumbers.add(selected);
    }
  }

  return Array.from(selectedNumbers).sort((a, b) => a - b);
}

export function generateRandomNumbers(count: number, min: number, max: number): number[] {
  const numbers: number[] = [];
  for (let i = min; i <= max; i++) {
    numbers.push(i);
  }

  // Shuffle the array using Fisher-Yates algorithm
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }

  return numbers.slice(0, count).sort((a, b) => a - b);
}