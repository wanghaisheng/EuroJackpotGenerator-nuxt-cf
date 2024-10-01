export interface Ticket {
  mainNumbers: number[];
  euroNumbers: number[];
}

export interface TicketSet {
  setNumber: number;
  tickets: Ticket[];
}