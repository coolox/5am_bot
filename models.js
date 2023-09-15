const Sequelize = require('sequelize');
const sequelize = require('./sequelize');

const User = sequelize.define('user', {
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  user_name: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  timezoneOffset: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  last_photo_timestamp: {
    type: Sequelize.DATE,
  },
  days_in_row: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0, 
  },
});

const UserPhoto = sequelize.define('user_photos', {
  photo_id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  photo_link: {
    type: Sequelize.TEXT,
    allowNull: false,
  }
});



User.hasMany(UserPhoto, {
  foreignKey: 'user_id',
})
UserPhoto.belongsTo(User, {
  foreignKey: 'user_id',
});

module.exports = {UserPhoto, User};
