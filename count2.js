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
    _.each($articles, (ele) => {
      console.log($(ele).attr('href'));
      getArticle($(ele).attr('href'));
    });
  })
}

function getArticle(url) {
  rpap(url).then(($) => {
    const $authors = $('h5 code');
    _.each($authors, (ele) => {
      const authorArr = $(ele).text().split('：');
      console.log('author', authorArr);
    });
  });
}

main();
