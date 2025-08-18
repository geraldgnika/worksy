const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'storage/');
  },
  
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const extension_constraints = (req, file, cb) => {
  const allowed_filetypes = ['image/jpg', 'image/jpeg', 'image/png'];
  
  if (allowed_filetypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only .jpg, .jpeg and .png, filetypes are allowed.'), false);
  }
};

const upload = multer({ storage, extension_constraints });

module.exports = upload;
