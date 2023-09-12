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
      const localTime = new Date(photoTimestamp * 1000).toLocaleString();
      telegramBot.sendMessage(chatId, `The current local time is: ${localTime}`);
    }
  },
};