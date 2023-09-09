const { UserPhoto, User } = require('./models');
const fs = require('fs');
const { createUserFolder } = require('./userUtils');

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

    // Check if the current time is within the allowed time range (4:50 AM - 5:07 AM)
    const currentTime = new Date(photoTimestamp * 1000);
    const isWithinTimeRange =
      (currentTime.getHours() === 1 && currentTime.getMinutes() >= 0) || // 4:50 AM or later
      (currentTime.getHours() === 1 && currentTime.getMinutes() <= 50); // 5:07 AM or earlier

    if (!isWithinTimeRange) {
      telegramBot.sendMessage(chatId, 'You can only send a photo between 4:50 AM and 5:07 AM.');
      return;
    }

    createUserFolder(userId);

    // Get the file ID of the largest photo
    const fileId = msg.photo[msg.photo.length - 1].file_id;

    // Get the file path and save it locally
    const filePath = await telegramBot.downloadFile(fileId, `./storage/${userId}`);

    // Define a new file name based on user ID and timestamp
    const newFileName = `${userId}_${timestamp}.jpg`;

    // Create a new file path with the updated name
    const photoLink = `/storage/${userId}/${newFileName}`;

    // Rename the file to the new name
    fs.renameSync(filePath, `./storage/${userId}/${newFileName}`);

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
      .then(() => {
        console.log(`Last photo timestamp updated for user ${userId}: ${timestamp}`);
      })
      .catch((error) => {
        console.error('Error updating last_photo_timestamp:', error);
      });
      notReady(userId)
    }
  },
};
