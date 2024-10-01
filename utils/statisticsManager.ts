import type { StatisticsData } from '~/types/statistics';

let cachedStats: StatisticsData | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

const isValidData = (data: any): data is StatisticsData => 
  data?.numbers?.length > 0 && data?.additionalNumbers?.length > 0;

export async function fetchStatistics(): Promise<StatisticsData | null> {
  const now = Date.now();
  if (cachedStats && now - lastFetchTime < CACHE_DURATION) {
    return cachedStats;
  }

  try {
    const response = await fetch(
      'https://www.lotto-bayern.de/getEurojackpotStatisticsCounts?sorting=number',
      { headers: { Accept: 'application/json, text/plain, */*' } }
    );

    if (!response.ok) throw new Error('Failed to fetch statistics');

    const statsData = await response.json();
    if (!isValidData(statsData)) throw new Error('Invalid statistics data');

    cachedStats = statsData;
    lastFetchTime = now;
    return statsData;
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return null;
  }
}