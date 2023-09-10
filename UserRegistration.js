const { User } = require('./models');
const UserInformation = require('./UserInformation');

module.exports = {
    registerUser: async (telegramBot, msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const firstName = msg.from.first_name;
    
        const currentTime = new Date(msg.date * 1000);
        const existingUser = await User.findOne({ where: { user_id: userId } });
    
        if (!existingUser) {
          // User does not exist, create a new user
          await User.create({
            user_id: userId,
            user_name: firstName,
            last_photo_timestamp: currentTime
          });
          await telegramBot.sendMessage(chatId, `${firstName}! User is created and ready to take a challenge`);
          UserInformation.userInformation(telegramBot, msg);
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
};