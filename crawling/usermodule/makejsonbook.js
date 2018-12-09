module.exports = function(html) {       // 검색한 키워드의 책정보를 json object로 만들어주는 사용자 정의 모듈
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
    is_end = obj.meta.is_end;
    pageable_count = obj.meta.pageable_count;
    total_count = obj.meta.total_count;

    var resultJSON = {
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

    return resultJSON;
};