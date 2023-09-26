const UserRegistration = require('./UserRegistration');
const ct = require('countries-and-timezones');
const cityTimezones = require('city-timezones');


module.exports = {
  handleUserReply: async (telegramBot, msg, state) => {
    const userId = msg.from.id;
    const chatId = msg.chat.id;
    const userReply = msg.text.trim();
    const userState = state[userId] || {};
    const city = cityTimezones.lookupViaCity(userReply)[0]

    if (userState.waitingForCity) {

            if (city!== undefined) {
            const timezone = ct.getTimezone(city.timezone);
            const timezoneOffset = timezone.utcOffset / 60;
            console.log('timezoneOffset==>',timezoneOffset )
           
           await UserRegistration.registerUser(telegramBot, msg, timezoneOffset);
            } else {
            // Handle the case where the city is not recognized or timezone cannot be determined
            telegramBot.sendMessage(chatId, 'Sorry, I couldn\'t determine your timezone based on the provided city, please try again');
            } 
            delete state[userId];
        }
  },
};
