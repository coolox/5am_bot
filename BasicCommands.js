const { User } = require('./models');
const UserInformation = require('./UserInformation');

module.exports = {
    handleBasicCommands: async (telegramBot, msg, addReady) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const messageText = msg.text;

    if (messageText === '📸 Take a Selfie') {
      telegramBot.sendMessage(chatId, 'Please take a selfie using the front camera and send it to me.');
      addReady(userId);

    } else if (messageText === 'Info') {
      UserInformation.userInformation(telegramBot, msg);
  
    } else if (messageText === 'Get Local Time') {
      const photoTimestamp = msg.date;
      const userId = msg.from.id;
      const user = await User.findOne({ where: { user_id: userId } });
      const offsetHours = user.timezoneOffset
      const userName = user.user_name
      
      const localTime = new Date(photoTimestamp * 1000);
      localTime.setHours(localTime.getHours() + offsetHours);

      const localTimeStr = localTime.toLocaleString();

      telegramBot.sendMessage(chatId, `${userName}, your local time is: ${localTimeStr}`);
    }
  },
};