// crons/ticketReservations.js
const cron = require('node-cron');
const { processExpiredReservations } = require('../controllers/ticketController');

// Run every minute to check for expired reservations
cron.schedule('* * * * *', async () => {
  try {
    const result = await processExpiredReservations();
    if (result.success && result.processedCount > 0) {
      console.log(`Successfully processed ${result.processedCount} expired ticket reservations`);
    }
  } catch (error) {
    console.error('Ticket reservation cron job error:', error);
  }
});

console.log('Ticket reservation expiration cron job scheduled');