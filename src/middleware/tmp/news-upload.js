const multer = require('multer');

const storage = multer.diskStorage({
    destination: './public/uploads/news/',
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + '-' + Date.now() + path.extname(file.originalname)
        );
    },
});



// Check File Type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Такие файлы загружать не разрешено!');
    }
}

exports.newsUpload = () => multer({
    storage: storage,
    limits: { fileSize: 20000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
}).fields([
    { name: 'news_url', maxCount: 1 },
]);