const { User } = require('./models');
const calculateDays = require('./calculateDaysSinceLastPhoto');
const dotenv = require('dotenv');
dotenv.config();

const adminGroup = process.env.ADMIN_GROUP_ID;

module.exports = {
    userInformation: async (telegramBot, msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const info = await User.findOne({ where: { user_id: userId } });

        if (info) {
            const daysPassed= await calculateDays.calculateDaysSinceLastPhoto(userId)

            if (daysPassed>1){
                telegramBot.sendMessage(chatId, `${info.user_name}! ${daysPassed} days passed from your last photo 😔`);
                // Send message to admin group
                telegramBot.sendMessage(adminGroup, `!!!! ${info.user_name} with user id ${userId} passed ${daysPassed} days. Take him out from the group`);
                
            } else{
                telegramBot.sendMessage(chatId, `${info.user_name}! You complete ${info.days_in_row} days`);
            }
            
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
 