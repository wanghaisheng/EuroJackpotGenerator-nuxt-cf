import { generateTickets } from '~/utils/ticketGenerator';
import { H3Error, createError } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const ticketCount = parseInt(body.ticketCount, 10) || 1;
    const mainCount = parseInt(body.mainCount, 10) || 5;
    const euroCount = parseInt(body.euroCount, 10) || 2;

    if (
      isNaN(ticketCount) ||
      ticketCount < 1 ||
      ticketCount > 1000 // You can set a reasonable upper limit
    ) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Number of tickets must be a number between 1 and 1000.',
      });
    }

    const tickets = await generateTickets(ticketCount, mainCount, euroCount);
    return tickets;
  } catch (error) {
    console.error('Error generating tickets:', error);
    if (error instanceof H3Error) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'An internal server error occurred.',
    });
  }
});