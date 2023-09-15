const UserRegistration = require('./UserRegistration');
const { User } = require('./models');
const BasicCommands = require('./BasicCommands');
const PhotoProcessing = require('./PhotoProcessing');
const { handleUserReply } = require('./UserReply'); 

//feature-branch

// Define a map to store the last timestamp of photos sent by each user
const isReady = new Map();
const addReady = (user)=>{
  isReady.set(user, true);
}
const notReady = (user)=>{
  isReady.delete(user);
}
const state = {}; 

module.exports = {
  start: (telegramBot) => {
    telegramBot.onText(/\/start/, async (msg) => {
  
    const chatId = msg.chat.id;
    const userId = msg.from.id;
   
    const existingUser = await User.findOne({ where: { user_id: userId } });
    
    if(!existingUser){
      telegramBot.sendMessage(chatId, 'Please enter the city you are living in:');
      state[userId] = { waitingForCity: true };
    }
    
   // UserRegistration.registerUser(telegramBot, msg);
});
  telegramBot.on('message', (msg) => {
    const userId = msg.from.id;
    const userState = state[userId] || {};

    if (userState.waitingForCity) {
      handleUserReply(telegramBot, msg, state, addReady, notReady);
    }
}); 

// Handle button presses
telegramBot.on('message', (msg) => {
  BasicCommands.handleBasicCommands(telegramBot, msg, addReady);
});

// Handle incoming photos
telegramBot.on('photo', async (msg) => {
  PhotoProcessing.processIncomingPhoto(telegramBot, msg, isReady, notReady);
})
  }}