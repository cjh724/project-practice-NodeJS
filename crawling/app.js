/*
  pm2 start app.js / pm2 restart app.js /pm2 stop app.js : terminal에 log 못봄
  supervisor app.js : 코드 변경 때마다 crashing child 발생
*/
const express = require('express');
const app = express();

const cheerio = require('cheerio');   // HTML 데이터 parsing
const request = require('request');   // cheerio에서 parsing할 데이터 가져옴

const urlencode = require('urlencode'); // 한글을 UTF-8로 변경(URL Encode)

// 사용자 정의 모듈
const makejsonbook = require('./usermodule/makejsonbook.js');

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

app.get('/kakao/all', function(req, res, next) {
  const searchArray = ["가", "나", "다", "라", "마"/*, "바", "사", "아", "자", "차", "카", "파", "타", "하"*/];
  let jsonList = [];
  
  for(let i = 0; i < searchArray.length; i++) {
    // var key = searchArray[i];
    var urlencodekey = urlencode(searchArray[i]);
    var options = {
      // url : '/kakao?key=' + key,
      url : 'https://dapi.kakao.com/v2/search/book?query=' + urlencodekey + '&page=50&size=50',
      headers : {
        "Authorization" : "KakaoAK 623a9837c54aedc097d449c9ace8fe29"
      }
    };
    
    request(options, function(error, response, html) {
      if(error) {
        throw error;
      }

      var result = makejsonbook(html);
      console.log("검색어 : " + searchArray[i] + ", 사용자 정의 모듈 출력 : " + result.title);

      // TODO
      // 1. insert MySQL Table
      // jsonList.add(result);

      // 2. init variable

    });
  }
  res.send("success");
});

app.get('/kakao', function(req, res, next) {
  
  let options = {
    url : 'https://dapi.kakao.com/v2/search/book?query=%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98',  // 검색어:알고리즘
    // url : 'https://dapi.kakao.com/v2/search/book?query=' + req.query.key,  // 검색어:알고리즘
    headers : {
      "Authorization" : "KakaoAK 623a9837c54aedc097d449c9ace8fe29"
    }
  };

  request(options, function(error, response, html) {
    if(error) {
      throw error;
    }
    console.log("url= " + options.url);

    const searchArray = ["가", "나", "다", "라", "마", "바", "사", "아", "자", "차", "카", "파", "타", "하"]; // utf-8로 변환 필요
    let authors = new Array(),
        barcode = new Array(),
        category = new Array(),
        contents = new Array(),
        datetime = new Array(),
        ebook_barcode = new Array(),
        isbn = new Array(),
        price = new Array(),
        publisher = new Array(),
        sale_price = new Array(),
        sale_yn = new Array(),
        status = new Array(),
        thumbnail = new Array(),
        title = new Array(),
        translators = new Array(),
        url = new Array();
    let is_end, pageable_count, total_count;

    var obj = JSON.parse(html);   // String -> object
    // console.log("타입확인 : ", typeof obj);
    // console.log("meta : ", obj.meta);
    // console.log("is_end : ", obj.meta.is_end);
    // console.log("pcount : ", obj.meta.pageable_count);
    // console.log("tcount : ", obj.meta.total_count);

    // console.log("Documents length : ", obj.documents.length);
    // console.log("첫번째 작가 : ", obj.documents[0].authors, obj.documents[0].authors.length);

    for(let i=0; i<obj.documents.length; i++) {
      // documents
      authors.push(obj.documents[i].authors);
      barcode.push(obj.documents[i].barcode);
      category.push(obj.documents[i].category);
      contents.push(obj.documents[i].contents);
      datetime.push(obj.documents[i].datetime);
      ebook_barcode.push(obj.documents[i].ebook_barcode);
      isbn.push(obj.documents[i].isbn);
      price.push(obj.documents[i].price);
      publisher.push(obj.documents[i].publisher);
      sale_price.push(obj.documents[i].sale_price);
      sale_yn.push(obj.documents[i].sale_yn);
      status.push(obj.documents[i].status);
      thumbnail.push(obj.documents[i].thumbnail);
      title.push(obj.documents[i].title);
      translators.push(obj.documents[i].translators);
      url.push(obj.documents[i].url);
    }

    // meta
    is_end = obj.meta.is_end;                 // 마지막페이지 여부(T/F)
    pageable_count = obj.meta.pageable_count; // total_count 중 노출가능 문서수
    total_count = obj.meta.total_count;       // 검색어에 검색된 문서수

    var resultJSON = {    // 검색어 "알고리즘"으로 할 시(다른것은 default)
      // meta
      total_count : total_count,
      pageable_count : pageable_count,
      is_end : is_end,

      // documents
      authors : authors,
      barcode : barcode,
      category : category,
      contents : contents,
      datetime : datetime,
      ebook_barcode : ebook_barcode,
      isbn : isbn,
      price : price,
      publisher : publisher,
      sale_price : sale_price,
      sale_yn : sale_yn,
      status : status,
      thumbnail : thumbnail,
      title : title,
      translators : translators,
      url : url
    };

    res.json(resultJSON);
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


const fs = require('fs');
const csv = require('fast-csv');
const stream = fs.createReadStream("test2.csv", {encoding : "utf8"});

app.get('/readCSV', function(req, res, next) {
  
  let csvStream = csv()
      .on("data", function(data) {
        // console.log(data[1]);
        let result = euckr2utf8.convert(data[1]).toString();
        console.log(result);
      })
      .on("end", function() {
        console.log("done");
      });
  
  stream.pipe(csvStream);


});


module.exports = app;

app.listen(3000, function() {
  console.log('Connected, 3000 port!');
});