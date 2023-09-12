const { User } = require('./models');

module.exports = {
  receiveOnePhotoPerDay: async (userId, currentTime) => {

    try {
      const user = await User.findOne({ where: { user_id: userId } });

      if (user) {
        // User found, check the last photo timestamp
        const lastPhotoTimestamp = user.last_photo_timestamp;

        // Check if the photo is sent day before
        if (
            currentTime.getFullYear() === lastPhotoTimestamp.getFullYear() &&
            currentTime.getMonth() === lastPhotoTimestamp.getMonth() &&
            currentTime.getDate()-1 === lastPhotoTimestamp.getDate() 
        ) {
            return true; 

        } else {
            return false;
        }

      }else{
        return false;
      } 
      
    } catch (error) {
      console.error('Error checking and updating user photo limit:', error);
      return false;
    }
  },
};
