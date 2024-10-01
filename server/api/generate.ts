import { generateTickets } from '~/utils/ticketGenerator';
import { H3Error, createError } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const numSets = parseInt(body.numSets, 10) || 1;

    if (isNaN(numSets) || numSets < 1 || numSets > 10) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Number of sets must be a number between 1 and 10.',
      });
    }

    const tickets = await generateTickets(numSets);
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