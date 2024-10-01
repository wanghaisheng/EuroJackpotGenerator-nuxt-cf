export interface Ticket {
  id: number
  mainNumbers: number[];
  euroNumbers: number[];
  winningMainNumbers?: number[];
  winningEuroNumbers?: number[];
  winClass?: number; // Added property for win class
}

export interface TicketSet {
  setNumber: number;
  tickets: Ticket[];
}