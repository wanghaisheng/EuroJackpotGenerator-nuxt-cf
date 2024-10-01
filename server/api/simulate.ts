import { generateRandomNumbers } from '~/utils/numberGenerator';
import { H3Error, createError } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    const mainNumbers = generateRandomNumbers(5, 1, 50);
    const euroNumbers = generateRandomNumbers(2, 1, 12);

    return {
      mainNumbers,
      euroNumbers
    };
  } catch (error) {
    console.error('Error simulating extraction:', error);
    if (error instanceof H3Error) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'An internal server error occurred.',
    });
  }
});