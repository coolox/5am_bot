const fs = require('fs');

// Function to create a folder for each user based on their ID
function createUserFolder(userId) {
  const userFolderPath = `./storage/${userId}`;

  if (!fs.existsSync(userFolderPath)) {
    fs.mkdirSync(userFolderPath);
  }
}

module.exports = {
  createUserFolder,
};
