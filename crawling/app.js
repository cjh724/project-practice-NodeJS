const express = require('express');
const app = express();

const cheerio = require('cheerio');   // HTML 데이터 parsing
const request = require('request');   // cheerio에서 parsing할 데이터 가져옴

app.get('/', function(req, res) {
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

    // res.json(resultArr2);

    res.json(arr6);
    console.log(arr6[0].children[1]);
  });
});


const Iconv = require('iconv').Iconv;
const iconv = new Iconv('CP949', 'utf-8//translit//ignore');

app.get('/test', function(req, res, next) {
  let url = "https://movie.naver.com/movie/sdb/rank/rmovie.nhn";

  request({url, encoding: null}, function(error, response, body){
    let htmlDoc = iconv.convert(body).toString();
    let resultArr = [];

    const $ = cheerio.load(htmlDoc);
    let colArr = $(".tit3");

    console.log("=====================");
    console.log(colArr[0].children[1]);
    console.log("@@@@@@@@@@@@@@@@@@@@@");
  });
});

app.get('/crawlingMoive', function(req, res, next) {
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

app.get('/crawlingMelonChart', function(req, res, next) {
  let url = "https://www.melon.com/chart/index.htm";
  
  request(url, function(error, response, html) {
    if(error) {
      throw error;
    }

    res.json(html);
  });
});


const euckr2utf8 = new Iconv('EUC-KR', 'UTF-8');

app.get('/crawlingKyobo', function(req, res, next) {
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
