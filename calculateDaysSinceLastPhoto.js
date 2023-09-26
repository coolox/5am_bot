const { User } = require('./models');

module.exports = {
  calculateDaysSinceLastPhoto: async (userId) => {
    try {
      const user = await User.findOne({ where: { user_id: userId } });

      if (!user || !user.last_photo_timestamp) {
        return null;
      }

      // Calculate the time difference in milliseconds
      const currentTime = new Date();
      const lastPhotoTimestamp = user.last_photo_timestamp;
      const timeDifference = currentTime - lastPhotoTimestamp;
      const daysSinceLastPhoto = Math.floor(timeDifference / (24 * 60 * 60 * 1000));

      return daysSinceLastPhoto;
    } catch (error) {
      console.error('Error calculating days since last photo:', error);
      return null;
    }
  },
};
