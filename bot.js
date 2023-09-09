const {UserPhoto, User} = require('./models');
const fs = require('fs');
const { createUserFolder } = require('./userUtils');

// Define a map to store the last timestamp of photos sent by each user
const lastPhotoTimestamps = new Map();

module.exports = {
  start: (telegramBot, db) => {
    // Handle /start command
    telegramBot.onText(/\/start/, async (msg) => {
      const chatId = msg.chat.id;
      const userId = msg.from.id;
      const firstName = msg.from.first_name;
      const replyMessage = `Hello, ${firstName}! How can I assist you today?`;

      const existingUser = await User.findOne({ where: { user_id: userId } });

      if (!existingUser) {
        // User does not exist, create a new user
        await User.create({
          user_id: userId,
          user_name: firstName
        });
       await telegramBot.sendMessage(chatId, ` ${firstName}! user is created and rady to take a challenge`);
      }else{
        // Create a keyboard with buttons
      const keyboard = {
        keyboard: [
          [{ text: 'Get Local Time' }, { text: 'Info' }, 
          { text: '📸 Take a Selfie' }],
        ],
        resize_keyboard: true,
      };

      const options = {
        reply_markup: JSON.stringify(keyboard),
      };

      telegramBot.sendMessage(chatId, replyMessage, options);

      }
    });
      

    // Handle button presses
    telegramBot.on('message', (msg) => {
      const chatId = msg.chat.id;
      const messageText = msg.text;
      const photoTimestamp = msg.date;
      console.log('time of the message', new Date(photoTimestamp * 1000))
      if (messageText === '📸 Take a Selfie') {
        // Ask the user to send a photo
        telegramBot.sendMessage(chatId, 'Please take a selfie using the front camera and send it to me.');
      } else if (messageText === 'Info') {
        // Provide information on how to send a photo
        const infoMessage = 'To take a selfie, switch to the front camera and click the camera button. After taking the selfie, click the paperclip icon or use the "Attach File" option to send the photo.';
        telegramBot.sendMessage(chatId, infoMessage);
      } else if (messageText === 'Get Local Time') {
         // Get the current local time
        const localTime = new Date().toLocaleString();

        // Send the local time as a response
        telegramBot.sendMessage(chatId, `The current local time is: ${new Date(photoTimestamp * 1000)}`);
      }
    });

    // Handle incoming photos
    telegramBot.on('photo', async (msg) => {
    
      const chatId = msg.chat.id;
      const userId = msg.from.id;
      const photoTimestamp = msg.date;
      const timestamp = new Date(photoTimestamp * 1000)
      .toString()
      .replace(/[-TZ.]/g, '')
      .split('(')[0]
      .trim()
      
 // Check if the current time is within the allowed time range (4:50 AM - 5:07 AM)
 const currentTime = new Date(photoTimestamp * 1000);
 const isWithinTimeRange =
  (currentTime.getHours() === 23 && currentTime.getMinutes() >= 0) || // 4:50 AM or later
  (currentTime.getHours() === 23 && currentTime.getMinutes() <= 50); // 5:07 AM or earlier

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
        user_id: userId
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
            // Update the last_photo_timestamp for the found user
            user.last_photo_timestamp = currentTime;
            user.days_in_row++

            // Save the changes to the database
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
      });
  },
};
