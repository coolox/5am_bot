const TelegramBot = require('node-telegram-bot-api');
const bot = require('./bot');
const dotenv = require('dotenv');
dotenv.config();
// Replace 'YOUR_API_TOKEN' with your actual Telegram bot API token
const token = process.env.BOT_TOKEN;

const sequelize = require('./sequelize');
const UserPhoto = require('./models');

// Sync the model with the database (this creates the table if it doesn't exist)
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
