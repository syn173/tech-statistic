const cheerio = require('cheerio');
const rp = require('request-promise');
const iconv = require('iconv-lite');
const _ = require('lodash');

const baseUrl = 'http://faq.fe.weimob.cn';

const rpap = rp.defaults({
  baseUrl,
  transform: (body) => {
    return cheerio.load(body);
  }
});

const count = {};
let pageLen;

function main(url = '/') {
 /* request.get(url, (error, res, body) => {
    console.log('code', res.statusCode);
    //const html = iconv.decode(res, 'utf-8');
    const $ = cheerio.load(body, {decodeEntities: false});
    const $articles = $('.list-group-item a');
    _.each($articles, (ele) => {
      console.log($(ele).attr('href'));
    });
  });*/

  /*rp(url).then((html) => {
    const $ = cheerio.load(html, {decodeEntities: false});
    const $articles = $('.list-group-item a');
    _.each($articles, (ele) => {
      console.log($(ele).attr('href'));
    });
  });*/

  rpap(url).then(($) => {
    const $articles = $('.list-group-item a');
    pageLen = $articles.length;
    _.each($articles, (ele) => {
      //console.log($(ele).attr('href'));
      getArticle($(ele).attr('href'));
    });
  })
}

let total = 0;

function getArticle(url) {
  rpap(url).then(($) => {
    --pageLen;
    total += $('h4 a').length;
    const $authors = $('h5 code');
    _.each($authors, (ele) => {
      const authorArr = $(ele).text().split('：');
      //console.log('author', authorArr);
      if (!count[authorArr[1]]) {
        count[authorArr[1]] = {
          '推荐人': 0,
          '作者': 0
        }
      }
      ++count[authorArr[1]][authorArr[0]];
    });
    if (0 === pageLen) {
      console.log('total', total);
      console.log(count);
    }
  });
}

main();
