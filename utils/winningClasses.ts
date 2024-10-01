export const winningClasses = [
  { class: 1, main: 5, euro: 2 },
  { class: 2, main: 5, euro: 1 },
  { class: 3, main: 5, euro: 0 },
  { class: 4, main: 4, euro: 2 },
  { class: 5, main: 4, euro: 1 },
  { class: 6, main: 3, euro: 2 },
  { class: 7, main: 4, euro: 0 },
  { class: 8, main: 2, euro: 2 },
  { class: 9, main: 3, euro: 1 },
  { class: 10, main: 3, euro: 0 },
  { class: 11, main: 1, euro: 2 },
  { class: 12, main: 2, euro: 1 },
];

/**
 * Determines the winning class based on matched main and euro numbers.
 * Returns the class number or undefined if not a winner.
 */
export function determineWinClass(matchedMain: number, matchedEuro: number): number | undefined {
  const win = winningClasses.find(
    (wc) => wc.main === matchedMain && wc.euro === matchedEuro
  );
  return win?.class;
}
