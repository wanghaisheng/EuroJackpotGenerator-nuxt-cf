export interface Ticket {
  mainNumbers: number[];
  euroNumbers: number[];
  winningMainNumbers?: number[];
  winningEuroNumbers?: number[];
}

export interface TicketSet {
  setNumber: number;
  tickets: Ticket[];
}