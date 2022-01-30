const port = 8080;
const express = require("express");
const multer = require("multer");
const randomstring = require('randomstring');
var _ = require('underscore');
const app = express();
let router = require('express').Router();
let fs = require("fs");

var exec = require('child_process').exec;


function execute(command, callback){
    exec(command, function(error, stdout, stderr){ callback(stdout); });
};


/** START MULTER */
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "images/");
    },
    filename: function (req, file, cb) {
        let extension = (file.mimetype==="image/png")?"png":"jpg";
        let fileNameTest = randomstring.generate(10)+"."+extension; 
        while(fs.existsSync(fileNameTest)){
            fileNameTest = randomstring.generate(10)+"."+extension;
        }
        cb(null, fileNameTest);
    },
});

const limits = {
    files: 1, // allow only 1 file per request
    fileSize: 1024 * 1024 * 64, // 64 MB (max file size)
};

/**
 * File filter for multer.
 */
const fileFilter = function (req, file, cb) {
    // supported image file mimetypes
    var allowedMimes = ["image/jpeg", "image/pjpeg", "image/png", "image/gif"];

    if (_.includes(allowedMimes, file.mimetype)) {
        // allow supported image files
        cb(null, true);
    } else {
        // throw error for invalid files
        cb(
            new Error(
                `Invalid file type. Only ${allowedMimes.reduce(
                    (p, c) => (p += c + ", ")
                )} files are allowed.`
            )
        );
    }
};

/**
 * Creates a multer object for images.
 */
const upload = multer({
    storage: storage,
    limits: limits,
    fileFilter: fileFilter,
    preserveBody: true,
});

/**
 * Handle the upload of one image.
 */
var uploadImage = upload.single("file");


router.route("/upload/image")
.get((req, res) => {
    res.status(200);
    res.json({msg:"ok"});
})
.post(upload.single("file"), function (req, res) {
    // if (err) {
    //     console.log("error upload image : " + JSON.stringify(err.code));
    // } else {
    // }
    console.log("Image uploaded : ", req.file.filename);
    execute(`../eirbia_surf_core/test.py images/${req.file.filename}`, function(result){
        console.log(result);
        console.log(JSON.parse(result));
        res.status(200);
        res.json(JSON.parse(result));
    });
    // uploadImage(req2, res, (err) => {
    // });
});

/** END MULTER */

/**
 * Used to allow the call from front api.
 */
 app.use((req, res, next) => {
    let reqOrigin = req.headers ? (req.headers.origin ? req.headers.origin : "*") : "*";
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
    res.setHeader("Access-Control-Allow-Origin", reqOrigin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});

app.use(express.json({ limit: "100mb" }));
app.use(router);


/**
 * Main route.
 */
app.get("/", function (req, res) {
    res.status(200);
    res.json({
        msg: "EirbIA server started",
    });
});

app.get("/test", function (req, res) {
    execute("../eirbia_surf_core/test.py", function(result){
        console.log(result);
        console.log(JSON.parse(result));
        res.status(200);
        res.json(JSON.parse(result));
    });
});

app.listen(port, () => {
    console.log("App started on port: ", port);
});
