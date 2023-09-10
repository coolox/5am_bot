const { User } = require('./models'); // Assuming you have a User model

module.exports = {
  calculateDaysSinceLastPhoto: async (userId) => {
    try {
      // Find the user by userId
      const user = await User.findOne({ where: { user_id: userId } });

      if (!user || !user.last_photo_timestamp) {
        return null; // User not found or no photo sent yet
      }

      // Calculate the time difference in milliseconds
      const currentTime = new Date();
      const lastPhotoTimestamp = user.last_photo_timestamp;
      const timeDifference = currentTime - lastPhotoTimestamp;

      // Calculate the number of days (1 day = 24 * 60 * 60 * 1000 milliseconds)
      const daysSinceLastPhoto = Math.floor(timeDifference / (24 * 60 * 60 * 1000));

      return daysSinceLastPhoto;
    } catch (error) {
      console.error('Error calculating days since last photo:', error);
      return null; // Handle the error as needed
    }
  },
};
