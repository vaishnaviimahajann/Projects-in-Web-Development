const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params:{
  folder: 'airbnb_dev', // Optional: specify the folder where images will be stored
  allowed_Formats: ['jpg', 'png', 'jpeg'], // Optional: specify allowed image formats
  },
});

module.exports = {
    cloudinary,
    storage,
}