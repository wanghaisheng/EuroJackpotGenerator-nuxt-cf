import { generateTickets } from '~/utils/ticketGenerator'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const numSets = parseInt(body.numSets) || 1

  try {
    const tickets = await generateTickets(numSets)
    return tickets
  } catch (error) {
    console.error('Error generating tickets:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate tickets.'
    })
  }
})
