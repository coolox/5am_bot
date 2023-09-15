const { UserPhoto, User } = require('./models');
const fs = require('fs');
const { createUserFolder } = require('./userUtils');
const isSelfieAspect = require('./isSelfie'); 
const PhotoLimitChecker = require('./PhotoLimitChecker');

module.exports = {
    processIncomingPhoto: async (telegramBot, msg, isReady, notReady) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const photoTimestamp = msg.date;
    const timestamp = new Date(photoTimestamp * 1000)
      .toString()
      .replace(/[-TZ.]/g, '')
      .split('(')[0]
      .trim();

    if(isReady.get(userId)) {
      const user = await User.findOne({ where: { user_id: userId } });
      const offsetHours = user.timezoneOffset
      const hoursLimit= 20 + offsetHours
      console.log('hoursLimit', hoursLimit)
        // Check if the current time is within the allowed time range (4:50 AM - 5:07 AM)
        const currentTime = new Date(photoTimestamp * 1000);

        console.log('currentTimeHours', currentTime.getHours())
        console.log('currentTimeMin', currentTime.getMinutes())

        const isWithinTimeRange =
          (currentTime.getHours() === hoursLimit && currentTime.getMinutes() >= 0) || // 8:00 PM or later
          (currentTime.getHours() === hoursLimit+1 && currentTime.getMinutes() >= 0) || // 9:00 PM or later
          (currentTime.getHours() === hoursLimit+2 && currentTime.getMinutes() <= 50); // 10:50 PM or earlier
        if (!isWithinTimeRange) {
          telegramBot.sendMessage(chatId, 'You can only send a photo between 20 PM and 21:50 PM.');
          return;
        }

        const canSendPhoto = await PhotoLimitChecker.receiveOnePhotoPerDay(userId, currentTime);

        if (canSendPhoto) {
            createUserFolder(userId);

            // Get the file ID of the largest photo
            const largestPhoto = msg.photo[msg.photo.length - 1];
            const fileId = largestPhoto.file_id;

            // Get the file path and save it locally
            const filePath = await telegramBot.downloadFile(fileId, `./storage/${userId}`);

            // Define a new file name based on user ID and timestamp
            const newFileName = `${userId}_${timestamp}.jpg`;

            // Create a new file path with the updated name
            const photoLink = `/storage/${userId}/${newFileName}`;

            // Rename the file to the new name
            fs.renameSync(filePath, `./storage/${userId}/${newFileName}`);

            const photoWidth = largestPhoto.width;
            const photoHeight = largestPhoto.height;

            // Check if the photo's aspect ratio is within the range of a selfie
            const isSelfie = isSelfieAspect( photoWidth, photoHeight);

            if (!isSelfie) {
                telegramBot.sendMessage(
                  chatId,
                  'I accept only selfie. Please send a selfie using the front camera.'
                );
                return;
            }  

            // Store user data and photo link in the database
            UserPhoto.create({
              photo_link: photoLink,
              user_id: userId,
            })
            .then(() => {
              telegramBot.sendMessage(chatId, `Thank you! Your photo has been received on ${timestamp} and saved.`);
            })
            .catch((error) => {
              console.error('Error saving user data and photo link:', error);
              telegramBot.sendMessage(chatId, 'An error occurred while saving your photo. Please try again later.');
            });

            // Update the last timestamp for the user
            User.findOne({ where: { user_id: userId } })
            .then((user) => {
                if (user) {
                  user.last_photo_timestamp = currentTime;
                  user.days_in_row++;
                  return user.save();
                } else {
                  console.log(`User with user_id ${userId} not found.`);
                }
            })
            .catch((error) => {
                console.error('Error updating last_photo_timestamp:', error);
            });
              
            notReady(userId)
        } else {
        
        telegramBot.sendMessage(msg.chat.id, 'You can send only one photo per day.');
        }
    }
  },
};
