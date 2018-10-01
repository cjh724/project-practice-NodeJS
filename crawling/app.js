const express = require('express');
const app = express();

const request = require('request');
const cheerio = require('cheerio');

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
    
    console.log(arr5);
  });
});


const Iconv = require('iconv').Iconv;
const iconv = new Iconv('CP949', 'utf-8//translit//ignore');

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
module.exports = app;

app.listen(3000, function() {
  console.log('Connected, 3000 port!');
});