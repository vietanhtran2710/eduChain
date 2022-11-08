const multer = require('multer')
const path = require('path')

module.exports.uploadFile = () => {
    const fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './files/');
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + '[-]' + file.originalname)
        }
    });

    return multer({ storage: fileStorage})
}