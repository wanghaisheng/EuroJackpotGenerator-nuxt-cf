export const winningClasses = [
  { class: 101, main: 5, euro: 2 },
  { class: 102, main: 5, euro: 1 },
  { class: 103, main: 5, euro: 0 },
  { class: 104, main: 4, euro: 2 },
  { class: 105, main: 4, euro: 1 },
  { class: 106, main: 3, euro: 2 },
  { class: 107, main: 4, euro: 0 },
  { class: 108, main: 2, euro: 2 },
  { class: 109, main: 3, euro: 1 },
  { class: 110, main: 3, euro: 0 },
  { class: 111, main: 1, euro: 2 },
  { class: 112, main: 2, euro: 1 },
]

/**
 * Determines the winning class based on matched main and euro numbers.
 * Returns the class number or undefined if not a winner.
 */
// utils/winningClasses.ts
export function determineWinClass(matchedMain: number, matchedEuro: number): number | undefined {
    const win = winningClasses.find(
      (wc) => wc.main === matchedMain && wc.euro === matchedEuro
    );
    return win?.class;
  }
  