const fs = require('fs');

exports.saveAudio = (req, res) => {
  fs.rename(req.file.path, `./uploads/${req.file.originalname}`, err => {
    if (err) throw err;
    res.send('File uploaded and renamed');
  });
};
