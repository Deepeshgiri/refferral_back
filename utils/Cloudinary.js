const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const stream = require('stream'); // Import the stream module
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Multer storage configuration (memory storage)
const storage = multer.memoryStorage();

// Multer upload instance
const upload = multer({ storage });

// Dynamic middleware to set folder
const dynamicUpload = (folder) => (req, res, next) => {
  req.folder = folder; // Set folder dynamically
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return next(err); // Pass error to error handler if any
    }
    console.log(req.file); // Log the uploaded file details

    try {
      if (req.file) {
        // Create a stream.PassThrough to pipe the file buffer to Cloudinary
        const bufferStream = new stream.PassThrough();
        bufferStream.end(req.file.buffer);

        // Upload the image to Cloudinary using upload_stream
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: req.folder || 'default', // Use folder from middleware or fallback to 'default'
            public_id: Date.now() + '-' + req.file.originalname.replace(/\s+/g, '_'), // Unique filename
            resource_type: 'auto', // Automatically detect file type (image, video, etc.)
          },
          (error, result) => {
            if (error) {
              return next(error); // Pass error to error handler
            }
           // console.log(result);
            req.file.cloudinary = result; // Add Cloudinary result to req.file
            next(); // Proceed to the next middleware
          }
        );

        // Pipe the buffer stream to the Cloudinary upload stream
        bufferStream.pipe(uploadStream);
      } else {
        next(new Error('No file uploaded')); // Handle case where no file is uploaded
      }
    } catch (error) {
      return next(error); // Handle errors during Cloudinary upload
    }
  });
};

module.exports = dynamicUpload;