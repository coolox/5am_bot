const { User } = require('./models'); // Assuming you have a User model

module.exports = {
  receiveOnePhotoPerDay: async (userId, currentTime) => {

    try {
      // Find the user by userId
      const user = await User.findOne({ where: { user_id: userId } });
        console.log('cheaking:==>', user)

      if (user) {
        // User found, check the last photo timestamp
        const lastPhotoTimestamp = user.last_photo_timestamp;
        console.log('lastPhoto',lastPhotoTimestamp)
        // Check if the photo is sent on a different day
        if (
            currentTime.getFullYear() === lastPhotoTimestamp.getFullYear() &&
            currentTime.getMonth() === lastPhotoTimestamp.getMonth() &&
            currentTime.getDate()-1 === lastPhotoTimestamp.getDate() 
        ) {
            console.log('Im here')
            return true; 
         
        } else {
            return false;
        }

      }else{
        return false;
      } 
      
    } catch (error) {
      console.error('Error checking and updating user photo limit:', error);
      return false; // Handle the error as needed
    }
  },
};
