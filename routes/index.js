var express = require('express');
var router = express.Router();
var request = require('sync-request');

var cloudinary = require( 'cloudinary' ).v2;

cloudinary.config({ 
  cloud_name: 'tounzitoun', 
  api_key: '193539541217214', 
  api_secret: '08tDDJZbvjpQrLu_xV_reonMkuE' 
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var uniqid = require('uniqid');
var fs = require('fs');

router.post('/upload', async function(req, res, next) {
 
 var imagePath = './tmp/'+uniqid()+'.jpg';

 var resultCopy = await req.files.avatar.mv(imagePath);
 if(!resultCopy) {

   var resultCloudinary = await cloudinary.uploader.upload(imagePath);

   var options = {
    json: {
      apiKey: '5c0a5d392c1745d2ae84dc0b1483bfd2',
      image: resultCloudinary.url,
    },
  };

  var resultDetectionRaw = await request('POST', 'https://lacapsule-faceapi.herokuapp.com/api/detect', options);
  var resultDetection = await resultDetectionRaw.body;
  resultDetection = await JSON.parse(resultDetection);
   
   var gender;
   var age;
 

    if (resultDetection.result) {
      gender = resultDetection.detectedFaces[0].gender === 'male' ? 'Homme' : 'Femme';

      age = resultDetection.detectedFaces[0].age + ' ans';

   }

    res.json({ url: resultCloudinary.url, gender, age });
 } else {
   res.json({error: resultCopy});
 }
 console.log("resultDetection",resultDetection)
 fs.unlinkSync(imagePath);
});

module.exports = router;
