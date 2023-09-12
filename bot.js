const UserRegistration = require('./UserRegistration');
const BasicCommands = require('./BasicCommands');
const PhotoProcessing = require('./PhotoProcessing');

// Define a map to check if user is ready to send the photo
const isReady = new Map();

const addReady = (user)=>{
  isReady.set(user, true);
}
const notReady = (user)=>{
  isReady.delete(user);
}

module.exports = {
  start: (telegramBot) => {
    // Handle /start command
    telegramBot.onText(/\/start/, async (msg) => {
      UserRegistration.registerUser(telegramBot, msg);
    });

    // Handle button presses
    telegramBot.on('message', (msg) => {
      BasicCommands.handleBasicCommands(telegramBot, msg, addReady);
    });

    // Handle incoming photos
    telegramBot.on('photo', async (msg) => {
      PhotoProcessing.processIncomingPhoto(telegramBot, msg, isReady, notReady);
    })
  }
}