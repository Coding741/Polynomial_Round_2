const express = require('express');
const dotenv = require('dotenv');
const bodyParser =  require('body-parser');

// Set up Global configuration access
dotenv.config();

// create express object
const app = express();
app.use(express.json());
app.use(bodyParser({limit:'50mb'}))

const googleDrive = require('./routes/Google_Drive_Upload_Files');

app.get('/', (req, res) => res.send(' API Running'));
app.use('/googleDrive',googleDrive);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is up and running on ${PORT} ...`);
});
