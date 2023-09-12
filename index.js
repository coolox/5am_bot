const TelegramBot = require('node-telegram-bot-api');
const bot = require('./bot');
const dotenv = require('dotenv');
dotenv.config();
const token = process.env.BOT_TOKEN;
const sequelize = require('./sequelize');


// Sync the model with the database 
sequelize.sync()
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch((error) => {
    console.error('Error creating database & tables:', error);
  });

// Create a new instance of the Telegram Bot API
const telegramBot = new TelegramBot(token, { polling: true });

// Start the bot
bot.start(telegramBot);
