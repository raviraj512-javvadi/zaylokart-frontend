// backend/routes/uploadRoutes.js
import path from 'path';
import express from 'express';
import multer from 'multer';

const router = express.Router();

// Configure multer's storage engine to save files with unique names
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // Save files to the 'uploads' folder
  },
  filename(req, file, cb) {
    // Create a unique filename: fieldname-timestamp.extension
    cb(null, `<span class="math-inline">\{file\.fieldname\}\-</span>{Date.now()}${path.extname(file.originalname)}`);
  }
});

// Create the upload middleware from the storage engine
const upload = multer({ storage });

// Define the route. The middleware 'upload.single('image')' handles one file upload from a form field named 'image'.
router.post('/', upload.single('image'), (req, res) => {
  // If upload is successful, multer adds a 'file' object to the request.
  // We send back the path to the file, which the frontend will use.
  res.send({
    message: 'Image Uploaded Successfully',
    image: `/${req.file.path.replace(/\\/g, "/")}`, // We standardize the path to use forward slashes
  });
});

export default router;