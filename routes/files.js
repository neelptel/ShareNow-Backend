const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const File = require('../models/file');
const { v4: uuidv4 } = require('uuid');

let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/') ,
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
      cb(null, uniqueName)
    } ,
  });
    
    let upload = multer({ storage, limits:{ fileSize: 1000000 * 1000 }, }).single('myfile'); //100mb
    
    router.post('/', (req, res) => {
      upload(req, res, async (err) => {
        if (err) {
          return res.status(500).send({ error: err.message });
        }
        const file = new File({
          filename: req.file.filename,
          uuid: uuidv4(),
          path: req.file.path,
          size: req.file.size
        });
        const response = await file.save();
        res.json({ file: `${process.env.APP_BASE_URL}/${response.uuid}` });
      });
    });

    //Email

    router.post('/send', async (req,res) =>{
      const {uuid, emailTo, emailFrom} = req.body;

      if(!uuid || !emailTo || !emailFrom) {
        return res.status(422).send({error: 'require all details'})
      }

      //get data from database
     const file = await File.findOne({uuid: uuid});
     if(file.sender){
      return res.status(422).send({error: 'Email Already Sent'});
     }

     file.sender = emailFrom;
     file.reciver = emailTo;
     file.response = await file.save();


     //Email Sending
     
     const sendMail = require('../services/email');

     sendMail({
      from: emailFrom,
      to: emailTo,
      subject:'ShareNow Easy File Share',
      text: `${emailFrom} shared a file with you`,
      html: require('../services/emailTemplate')({
        emailFrom: emailFrom,
        downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
        size: parseInt(file.size/1000) + 'KB',
        expires: '24 hrs',

      }),
     });
     return res.send({success: true});
     

    });



module.exports = router;