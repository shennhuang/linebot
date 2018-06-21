// let http = require("http");

let express = require('express');
let app = express();

let request = require('request')

let config = require('./config.json')

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Imports the Google Cloud client library
let Translate = require('@google-cloud/translate');

// Instantiates a client
let translate = new Translate({
    projectId: config.projectId,
    keyFilename: config.keyFilename,
});

app.get("/", function (req, res) {
    return res.send('is GET');
})


app.post("/sample", function (req, res) {
    console.log('doSample')
    doSample(req)
    return res.sendStatus(200);
})

function doSample(req) {

    // The text to translate
    const text = req.body.events[0].message.text;
    detectLanguage(text, function(target){
        let replyResult = '';

        let replyToken = req.body.events[0].replyToken
        let options = {
            method: 'POST',
            uri: 'https://api.line.me/v2/bot/message/reply',

            // 客制化 headers 內容，主要告訴 Line 收到的訊息格式和 Line Bot 的 Token
            headers: {
                'Content-Type': 'application/json',
                'Authorization': config.lineAuthorization
            },
            body: {
                // 告訴 Line 這個訊息回覆給誰
                replyToken: replyToken,
                messages: [{ type: 'text', text: replyResult }],
            },
            json: true,
        };
        if (target) {
            // 進行翻譯
            translateLanguage(text, target[0], replyResult, function(replyResult){
                translateLanguage(text, target[1], replyResult, function(replyResult){
                    
                    options.body.messages[0].text = replyResult
                    request(options, function (error, response, body) {
                        if (error) throw new Error(error);
        
                        // console.log(body);
                    });
                })
            })
        } else {
            options.body.messages[0].text = '語言偵測錯誤'
            request(options, function (error, response, body) {
                if (error) throw new Error(error);

                // console.log(body);
            });
        }
    })

    
}
function detectLanguage (text, callback){
    // 中文: zh-tw 英文: en 日文: ja
    let switchLanguage = ['zh-TW', 'en', 'ja'];
    let target = switchLanguage;

    translate
        .detect(text)
        .then(results => {
            let detections = results[0];
            detections = Array.isArray(detections) ? detections : [detections];
            detections = detections[0].language
            detections = detections.indexOf('zh') >= 0 ? 'zh-TW' : detections

            verifyTarget = target.indexOf(detections) >= 0 ? target.splice(target.indexOf(detections), 1) : -1 ;
            if (verifyTarget == -1) {
                target = false;
            }
            callback(target)
        })
        .catch(err => {
            console.error('ERROR:', err);
        });
}
function translateLanguage(text, target, replyResult, callback){
    translate
        .translate(text, target)
        .then(results => {
            translationText = results[0];

            target = target.indexOf('zh') >= 0 ? 'zh-TW' : target;
            targetLanguage = ''
            
            switch (target) {
                case 'en' :
                    targetLanguage = 'English:'
                    break;
                case 'ja' :
                    targetLanguage = '日本語:'
                    break;
                case 'zh-TW':
                    targetLanguage = '中文:'
                    break;
                default :
                    targetLanguage = 'fail'
            }
            if (targetLanguage !== 'fail') {
                replyResult += targetLanguage + "\n" + translationText + "\n\n"
            }
            

            callback(replyResult)
        })
    
}
app.listen(3333);