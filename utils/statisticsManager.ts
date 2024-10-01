let cachedStats: any = null;
let lastFetchTime = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export async function fetchStatistics() {
  const now = Date.now();
  if (cachedStats && now - lastFetchTime < CACHE_DURATION) {
    return cachedStats;
  }

  try {
    const response = await fetch(
      'https://www.lotto-bayern.de/getEurojackpotStatisticsCounts?sorting=number',
      {
        headers: {
          Accept: 'application/json, text/plain, */*',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch statistics');
    }

    const statsData = await response.json();

    if (
      !statsData.numbers ||
      !statsData.additionalNumbers ||
      statsData.numbers.length === 0 ||
      statsData.additionalNumbers.length === 0
    ) {
      throw new Error('Invalid statistics data');
    }

    cachedStats = statsData;
    lastFetchTime = now;
    return statsData;
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return null;
  }
}
