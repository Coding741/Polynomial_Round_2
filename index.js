const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const dotenv = require('dotenv');
const bodyParser =  require('body-parser');

// Set up Global configuration access
dotenv.config();

const CLIENT_ID=process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URIS;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
console.log(REFRESH_TOKEN);
const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client,
  });

const filePath = path.join(__dirname, 'bansi.png');
console.log(filePath);
async function uploadFile() {
  try {
    const response = await drive.files.create({
      requestBody: {
        name: 'bansi.png', //This can be name of your choice
        mimeType: 'image/png',
      },
      media: {
        mimeType: 'image/png',
        body: fs.createReadStream(filePath),
      },
    });

    console.log(response.data);
  } catch (error) {
      console.log("err")
    console.log(error.message);
  }
}

uploadFile();


// drive.files.list({
//         pageSize: 100,
        
//     }, (err, response) => {
//         if (err) {
//             console.log('The API returned an error: ' + err);
//             return res.status(400).send(err);
//         }
//         const files = response.data.files;
//         console.log(files)
//         if (files.length) {
//             console.log('Files:');
//             files.map((file) => {
//                 console.log(`${file.name} (${file.id})`);
//             });
//         } else {
//             console.log('No files found.');
//         }
//         // /res.send(response.data);
//     });
