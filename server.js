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
    console.log(msg)
    // Line
    let CHANNEL_ACCESS_TOKEN = 'TvVIuHAxbM/g/+Oh8gfXoWlUZPB2L3BvMMcdBUOajs3juaWxCOQR3q1hakYhRWHmgMofj34PKZW+o6PL8GIwrNsKPgf857LTnLHsN75DqZAqiymqI6Vyyo73rqVr0NDJZYEVrmpSLIZl1ztxOh4pGwdB04t89/1O/w1cDnyilFU=';
    let PRINT_ACCESS_TOKEN = "ya29.c.El-_BcUqZr-01xARBjQexEMih8eYR03C9g7nMQBCFvr5vbrTDdurpePjICqNU1gf5epvlPGvBpnA1ywM4bT53dXcTNsm5AxkTo43PXC0HM4a-vOnmu2dvRw6ATXzngxM2g"
    let text = msg.events[0].message.text
    // 取出 replayToken 和發送的訊息文字
    let replyToken = msg.events[0].replyToken;
    let userMessage = msg.events[0].message.text;

    if (typeof replyToken === 'undefined') {
        return;
    }

    let url = 'https://translation.googleapis.com/language/translate/v2'
    let options = {
        method: 'POST',
        url,
        json: true,
        headers: {
            'content-Type': 'application/x-www-form-urlencoded',
            'authorization': "Bearer " + PRINT_ACCESS_TOKEN
        },
        form: {
            'q': 'hi',
            'source': 'en',
            'target': 'zh',
            'format': 'text'
        }
    }
    request(options, function (error, response, body) {
        if (error) {
            console.log(error)
            return
        }
        console.log(body)
    })
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