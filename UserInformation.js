const { User } = require('./models');

module.exports = {
    userInformation: async (telegramBot, msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const info = await User.findOne({ where: { user_id: userId } });

        if (info) {
            telegramBot.sendMessage(chatId, `${info.user_name}! You complete ${info.days_in_row} days`);
          } else {
            // User already exists
            const replyMessage = "You are not registered. Please register by clicking the 'Start' button.";
            const keyboard = {
              keyboard: [
                [{ text: '/start' }]
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
 