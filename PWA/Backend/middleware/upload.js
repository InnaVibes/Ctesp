const fs = require('fs');
const path = require('path');

module.exports = async (req, next) => {
  try {
    // to declare some path to store your converted image
    const image = 'images/'+ Date.now() + ".png";
    const pathfile = path.join(__dirname, '/../' + image);
    const imgdata = req.body.base64image;

    // to convert base64 format into random filename
    const base64Data = imgdata.replace(/^data:([A-Za-z-+/]+);base64,/, "");

    fs.writefilesync(pathfile, base64Data, { encoding: "base64" });

    return image;
  } catch (e) {
    console.log(e);
    next(e);
  }
};