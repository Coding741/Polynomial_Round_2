const fs = require('fs');
const os = require('os');
const {isNullOrUndefined} =require('util');
const validator = require("email-validator");
const dotenv = require('dotenv');
const mime = require('mime');
const { google } = require('googleapis');
const SCOPE = ['https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile']
// Set up Global configuration access
dotenv.config();

const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const CLIENT_ID=process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URIS = process.env.REDIRECT_URIS;
const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URIS
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
const drive = google.drive({
    version: 'v3',
    auth: oAuth2Client,
});
const getAuthURL= (req, res) => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPE,
    });
    console.log("authUrl==>",authUrl);
    return res.send(authUrl);
};
const getToken= (req, res) => {
    if (req.body.code == null) return res.status(400).send('Invalid Request');
    oAuth2Client.getToken(req.body.code, (err, token) => {
        if (err) {
            console.error('Error retrieving access token', err);
            return res.status(400).send('Error retrieving access token');
        }
        res.send(token);
    });
};
const getUserInfo = (req, res) => {
    if (req.body.token == null) return res.status(400).send('Token not found');
    oAuth2Client.setCredentials(req.body.token);
    const oauth2 = google.oauth2({ version: 'v2', auth: oAuth2Client });

    oauth2.userinfo.get((err, response) => {
        if (err) res.status(400).send(err);
        console.log(response.data);
        res.send(response.data);
    });
}
//Ability to upload any kind of files with a limit of 50 mb to Google drive.
const uploadFile = async (req ,res)=>{
    try {
            let filePath =!isNullOrUndefined(req.body.filePath)?req.body.filePath:null;
            if (!isNullOrUndefined(filePath)&&fs.existsSync(filePath)) {
                let stats = fs.statSync(filePath);
                let fileSizeInBytes = stats.size;
                // Convert the file size to megabytes 
                let fileSizeInMegabytes = fileSizeInBytes / (1024*1024);                       
                if(fileSizeInMegabytes>50){
                    throw "File Size is Above 50mb";
                }
                const fileMetadata = {
                    name: filePath.split("/").splice(-1).toString(),
                    mimeType: mime.getType(filePath),
                };
                const media = {
                    mimeType: mime.getType(filePath),
                    body: fs.createReadStream(filePath),
                };
                drive.files.create(
                    {
                        resource: fileMetadata,
                        media: media,
                        fields: "id",
                    },
                    (err, file) => {
                        if (err) {
                            console.error(err);
                            res.status(400).send(err)
                        } else {
                            res.send('Successful Upload')
                        }
                    }
                );
          } else {
            throw ('file not found!');
          }
    } catch (error) {
        res.send(error);
    }
}
// 2. Ability to get all the files and folder uploaded or create
const getDriveDetails = async (req ,res)=>{
    try {
            const pageSize = !isNullOrUndefined(req.body.pageSize)?req.body.pageSize: 10;
            const ret = await drive.files.list({
                pageSize: pageSize
            });
            const files = ret.data.files;
            if (files.length === 0) {
                console.log('No files found.');
                res.send(files);
            }else{
                files.map((file) => {
                console.log(`${file.name} (${file.id})`);
                });
                res.send(files);
            }  
    } catch (error) {
        res.send(error);
    }
}
// 3. Share the uploaded file with any Gmail users.

const shareFile = async (req ,res)=>{
    try {
        const email = !isNullOrUndefined(req.body.email)&&validator.validate(req.body.email)?req.body.email:null;
        const type =!isNullOrUndefined(req.body.type)?req.body.type:null;
        const role =!isNullOrUndefined(req.body.role)?req.body.role:null;
        const fileName =!isNullOrUndefined(req.body.fileName)?req.body.fileName:null;
        let fileId;
        const driveData = await drive.files.list({
            pageSize: 100
        });
        const files = driveData.data.files;
        console.log(fileName)
        if (files.length === 0) {
            console.log('No files found.');
            res.send(`${fileName} this file is not Present.`);
        }else{
            if(isNullOrUndefined(fileName)){
                throw "file Not Found";
            }
            let file = files.find((file) => file.name.toLocaleLowerCase()==fileName.toLocaleLowerCase());
            fileId=file.id;
            console.log(file);
        }
        
        if(!isNullOrUndefined(email)&&!isNullOrUndefined(type)&&!isNullOrUndefined(role)){
            const permission = {
                    type: type,
                    role: role,
                    emailAddress: email
                }
            const result = await drive.permissions.create({
                resource: permission,
                fileId: fileId,
                fields: 'id',
            });
            // permissionIds.push(result.data.id);
            console.log(`Inserted permission id: ${result.data.id}`);
            res.send(`Inserted permission id: ${result.data.id}`)
        }else{
            throw "email type or role some data wrong";
        }

    } catch (error) {
        console.log("Error::",error);
    }
}

module.exports ={getAuthURL,getToken,getUserInfo,uploadFile,getDriveDetails,shareFile}