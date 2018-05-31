// let http = require("http");

let express = require('express');
let app = express();
let request = require('request')

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

app.get("/", function (req, res) {
    return res.send('is GET');
})

app.post("/", function (req, res) {
    console.log('dopost')
    doPost(req.body)
    return;
})

app.post("/sample", function (req, res) {
    console.log('doSample')
    doSample()
    return;
})


function doPost(msg) {
}

function doSample() {
    // Imports the Google Cloud client library
    const Translate = require('@google-cloud/translate');

    // Your Google Cloud Platform project ID
    const projectId = 'project-id-1957904988521210417';

    const keyFilename = '';

    // Instantiates a client
    const translate = new Translate({
        projectId: projectId,
        keyFilename: keyFilename,
    });

    // The text to translate
    const text = 'Hello, world!';
    // The target language
    const target = 'zh';

    // Translates some text into Russian
    translate
        .translate(text, target)
        .then(results => {
            const translation = results[0];

            console.log(`Text: ${text}`);
            console.log(`Translation: ${translation}`);
        })
        .catch(err => {
            console.error('ERROR:', err);
        });
}
app.listen(80);