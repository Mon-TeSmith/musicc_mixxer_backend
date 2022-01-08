const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const { resolve } = require('path');
const { rejects } = require('assert');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

// Mongo URI
const mongoURI = 'mongodb+srv://tay:databases@capstonefinal.1mfi7.mongodb.net/capstoneFinal?retryWrites=true&w=majority';

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

// Init gfs
let gfs;

// Init stream
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
})

// Create storage engine
const storage = new GridFsStorage({
    url: mongoURI,
    file: (_req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if(err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({ storage });

// @route GET /
// @description Loads form
app.get('/' , (_req, res) => {
    res.render('index');
});

// @route POST /upload
// @description Uploads file to DB
app.post('/upload', upload.single('file'), (_req, res) => {

    // res.json({file: req.file});
    res.redirect('/');
});

// @route GET / files
// @desc Display all files in JSON
app.get('/files', (_req,res) => {
    gfs.files.find().toArray((_err, files) => {
        // Check if files
        if(!files || files.length === 0) {
            return res.status(404).json({
                err: 'No files exist'
            });
        }

        // Files exist
        return res.json(files);
    });
});

// @route GET / files/: filename
// @desc Display all files in JSON
app.get('/file/:filename', (_req,res) => {
    gfs.files.findOne({filename: req.params.filename }, (err, file) => {
        // Check if file
        if(!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exist'
            });
        } 
        // File exists
        return res.json(file);
    });
});


const port = 5000

app.listen(port, () => console.log(`Server started on port ${port}`));