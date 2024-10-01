import { EurojackpotDrawType } from '~/types/eurojackpot';

function getISOWeekNumber(date: Date): number {
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.getTime();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }
  return 1 + Math.ceil((firstThursday - target.getTime()) / 604800000);
}

function getDrawDate(date: Date, type: EurojackpotDrawType): Date {
  const dayOfWeek = date.getDay();
  const drawDays = [2, 5]; // Tuesday and Friday
  let daysToAdjust: number;

  if (type === 'previous') {
    daysToAdjust = drawDays
      .map(drawDay => (dayOfWeek - drawDay + 7) % 7)
      .sort((a, b) => a - b)[0];
    daysToAdjust = daysToAdjust === 0 ? 7 : daysToAdjust; // If it's draw day, go to previous week
  } else {
    daysToAdjust = drawDays
      .map(drawDay => (drawDay - dayOfWeek + 7) % 7)
      .sort((a, b) => a - b)[0];
  }

  const drawDate = new Date(date);
  drawDate.setDate(date.getDate() + (type === 'previous' ? -daysToAdjust : daysToAdjust));
  return drawDate;
}

export function generateEurojackpotUrl(type: EurojackpotDrawType): string {
  const baseUrl = "https://www.lotto-bayern.de/getEurojackpotHistoricOdds?gckey=";
  const today = new Date();
  const drawDate = getDrawDate(today, type);
  const weekNumber = getISOWeekNumber(drawDate);
  const year = drawDate.getFullYear();
  const drawDay = drawDate.getDay();

  const gckey = `${year}-${weekNumber}-${drawDay}`;
  return `${baseUrl}${gckey}`;
}
