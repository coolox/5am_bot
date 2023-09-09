const UserInformation = require('./UserInformation');

module.exports = {
    handleBasicCommands: (telegramBot, msg, addReady) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const messageText = msg.text;

    

    if (messageText === '📸 Take a Selfie') {
      telegramBot.sendMessage(chatId, 'Please take a selfie using the front camera and send it to me.');
      addReady(userId);
    } else if (messageText === 'Info') {

      UserInformation.userInformation(telegramBot, msg);
      //const infoMessage = 'To take a selfie, switch to the front camera and click the camera button. After taking the selfie, click the paperclip icon or use the "Attach File" option to send the photo.';
      //telegramBot.sendMessage(chatId, infoMessage);
    } else if (messageText === 'Get Local Time') {
      const photoTimestamp = msg.date;
      const localTime = new Date(photoTimestamp * 1000).toLocaleString();
      telegramBot.sendMessage(chatId, `The current local time is: ${localTime}`);
    }
  },
};