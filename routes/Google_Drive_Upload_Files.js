const  router =  require('express').Router();

const googleDrive = require('../controller/Google_Drive_Upload_Files_Controller');

router.get('/getAuthURL',googleDrive.getAuthURL);

router.post('/getToken',googleDrive.getToken);

router.post('/getUserInfo',googleDrive.getUserInfo);

router.post('/uploadFile',googleDrive.uploadFile);

router.post('/getDriveDetails',googleDrive.getDriveDetails);

router.post('/shareFile',googleDrive.shareFile);

module.exports = router;