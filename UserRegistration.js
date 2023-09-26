const { User } = require('./models');
const UserInformation = require('./UserInformation');


module.exports = {
    registerUser: async (telegramBot, msg, timezoneOffset) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const firstName = msg.from.first_name;
        const currentTime = new Date(msg.date * 1000);
        const existingUser = await User.findOne({ where: { user_id: userId } });
        
       if (!existingUser) {
        
          await User.create({
            user_id: userId,
            user_name: firstName,
            timezoneOffset: timezoneOffset,
            last_photo_timestamp: currentTime,
          }); 
         
          const replyMessage = `${firstName}! User is created and ready to take a challenge`;
          const keyboard = {
            keyboard: [
              [{ text: 'Get Local Time' }, { text: 'Info' }],
              [{ text: '📸 Take a Selfie' }],
            ],
            resize_keyboard: true,
          };

          const options = {
            reply_markup: JSON.stringify(keyboard),
          };

          await telegramBot.sendMessage(chatId, replyMessage, options);
        } else {
          // User already exists
          const replyMessage = `Hello, ${firstName}! How can I assist you today?`;
          const keyboard = {
            keyboard: [
              [{ text: 'Get Local Time' }, { text: 'Info' }],
              [{ text: '📸 Take a Selfie' }],
            ],
            resize_keyboard: true,
          };

          const options = {
            reply_markup: JSON.stringify(keyboard),
          };

          telegramBot.sendMessage(chatId, replyMessage, options);
        } 
      }
    }
