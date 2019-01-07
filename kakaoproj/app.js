// npm install express request urlencode
const express = require('express');
const request = require('request');
const urlencode = require('urlencode'); // 한글을 UTF-8로 변경(URL Encode)
const app = express();

app.get('/getBook', function(req, res, next) {
    // 1. android에서 책제목 가지고 올 예정
    const bookTitle = ["해를품은달", "위대한개츠비", "나미야잡화점의기적"];       // 예시로 일단 세권만

    for(let i=0; i<bookTitle.length; i++) {
        let urlencodekey = urlencode(bookTitle[i]);

        let options = {
            url : 'https://dapi.kakao.com/v3/search/book?query=' + urlencodekey + '&page=1&size=1',
            headers : {
                "Authorization" : "KakaoAK 623a9837c54aedc097d449c9ace8fe29"
            }
        };
        
        request(options, function(error, response, html) {
            if(error) {
                throw error;
            }

            let obj = JSON.parse(html);   // String -> object
            let title = new Array(),
                contents = new Array(),
                thumbnail = new Array();

            for(let j=0; j<obj.documents.length; j++) {
                title.push(bookTitle[i]);       // android에서 가져온 책제목을 그대로 씀
                contents.push(obj.documents[j].contents);
                thumbnail.push(obj.documents[j].thumbnail);
            }

            let resultJSON = {
                title : title,
                contents : contents,
                thumbnail : thumbnail
            };
            
            // 2. resultJSON을 android로 넘길 예정
            console.log(resultJSON.title + " ===== " + resultJSON.contents + " ///// " +resultJSON.thumbnail);
        });
    }

    res.json("success");
});

module.exports = app;

app.listen(3000, function() {
    console.log('Connected, 3000 port!');
});