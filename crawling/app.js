/*
  pm2 start app.js / pm2 stop app.js : terminal에 log 못봄
  supervisor app.js : 코드 변경 때마다 crashing child 발생
*/
const express = require('express');
const app = express();

const cheerio = require('cheerio');   // HTML 데이터 parsing
const request = require('request');   // cheerio에서 parsing할 데이터 가져옴

app.get('/naverMain', function(req, res) {    // 미완성
  request('https://www.naver.com', function(error, response, body) {
    if(error) {
      throw error;
    }

    // console.log(body);
    const $ = cheerio.load(body);

    let arr1 = $("div ul li a .ah_k");   // json
    let arr2 = $("div > ul > li > a > .ah_k");  // json
    let arr3 = $("div ul li a .ah_k").children;     // undefined
    let arr4 = $("div > ul > li > a > .ah_k").children;     // undefined
    let arr5 = $("div.PM_CL_realtimeKeyword_rolling ul li").text();
    let arr6 = $("div.PM_CL_realtimeKeyword_rolling");
    

    let resultArr2 = [];
    for(let i=0; i<arr5.length; i++) {
      resultArr2.push(arr6[i]);
    }

    res.json("aa");

    // res.json(resultArr2);

    // res.json(arr6);
    // console.log(arr6[0].children[1]);
  });
});


const Iconv = require('iconv').Iconv;
const iconv = new Iconv('CP949', 'utf-8//translit//ignore');

app.get('/crawlingMoive', function(req, res, next) {        // complete
  let url = "https://movie.naver.com/movie/sdb/rank/rmovie.nhn";

  request({url, encoding: null}, function(error, response, body){
    let htmlDoc = iconv.convert(body).toString();
    let resultArr = [];

    const $ = cheerio.load(htmlDoc);
    let colArr = $(".tit3");
    for(let i = 0; i < colArr.length; i++) {
        resultArr.push(colArr[i].children[1].attribs.title);
    }

    res.json(resultArr);
  });
});


app.get('/kakao', function(req, res, next) {
  let options = {
    url : 'https://dapi.kakao.com/v2/search/book?query=%EA%B0%80&page=10',  // 검색어:가
    headers : {
      "Authorization" : "KakaoAK 623a9837c54aedc097d449c9ace8fe29"
    }
  };

  request(options, function(error, response, html) {
    if(error) {
      throw error;
    }

    res.json(html);

  });
});


app.get('/crawlingMelonChart', function(req, res, next) {   // html 깨짐
  let url = "https://www.melon.com/chart/index.htm";
  let options = {
    url: url,
    headers: {
      "Host": "www.melon.com",
      "Connection": "keep-alive",
      "Accept": "*/*",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
      "Cookie": "SCOUTER=z2td03g54vhfqe; PCID=15259616654209601434511; WMONID=go96_DW6f7S; PC_PCID=15259616654209601434511; POC=WP10",
    }
  }

  request(options, function(error, response, html) {
    // let contents = new Buffer(html, 'binary');
    // let htmlDoc = euckr2utf8.convert(contents).toString();

    if(error) {
      throw error;
    }
    
    if (!error) {
      var $ = cheerio.load(html);
      console.log("no error!!!");
      res.json(html);
    }

  });
});


const euckr2utf8 = new Iconv('EUC-KR', 'UTF-8');

app.get('/crawlingKyobo', function(req, res, next) {    // html만 가지고옴
  let url = "http://www.kyobobook.co.kr/index.laf";
  let options  = {
    encoding: "binary",
    method: "GET",
    uri: url
  };

  request(options, function(error, response, html) {
    let contents = new Buffer(html, 'binary');
    let result = euckr2utf8.convert(contents).toString();
  
    res.json(result);
  });
});

module.exports = app;

app.listen(3000, function() {
  console.log('Connected, 3000 port!');
});