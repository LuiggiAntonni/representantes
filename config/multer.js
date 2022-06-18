const multer = require('multer');
const path = require('path')
const crypto = require('crypto')

const caminho = path.resolve(__dirname, '..', 'public', 'images')
module.exports = {
    dest: caminho,
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, caminho)
        },
        filename: (req, file, callback) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) callback(err);

                const fileName = `${hash.toString('hex')}-${file.originalname}`;

                callback(null, fileName)
            })
        },
    }),
    limits: {
        fileSize: 3 * 1024 * 1024
    },
    fileFilter: (req, file, callback) => {
        const allowedMimes = [
            'image/jpeg',
            'image/pjepeg',
            'image/png'
        ]

        if (allowedMimes.includes(file.mimetype)) {
            callback(null, true);
        } else {
            callback(new Error('Tipo do arquivo invalido.'))
        }
    }
}