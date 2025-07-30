// server/utils/checkStaleDonations.js
import Donation from '../models/Donation.js';

export const markStaleDonationsAsFailed = async () => {
  const cutoff = new Date(Date.now() - 60 * 1000); // 1 minute ago

  try {
    const result = await Donation.updateMany(
      {
        paymentStatus: 'pending',
        createdAt: { $lt: cutoff },
      },
      {
        paymentStatus: 'failed',
      }
    );

    if (result.modifiedCount > 0) {
      console.log(`Marked ${result.modifiedCount} stale donations as failed.`);
    }
  } catch (err) {
    console.error('Error marking stale donations:', err.message);
  }
};
