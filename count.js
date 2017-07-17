const cheerio = require('cheerio');
const http = require('http');
const iconv = require('iconv-lite');
const _ = require('lodash');
const escaper = require('true-html-escape');

const homeUrl = 'http://faq.fe.weimob.cn';

function request(url) {
  return new Promise((resolve) => {
    var chunks = []
    http.get(url, (res) => {
      res.on('data', (chunk) => {
        chunks.push(chunk);
      });

      res.on('end', () => {
        const html = iconv.decode(Buffer.concat(chunks), 'utf-8');
        const $ = cheerio.load(html, {decodeEntities: false});
        resolve($);
      });
    })
  });
}

function getIndex(url) {
  request(url).then(($) => {
    //const html = iconv.decode(Buffer.concat(chunks), 'utf-8');
    //const $ = cheerio.load(html, {decodeEntites: false});
    const $articles = $('.list-group-item a');
    console.log($articles.length);
    _.each($articles, (ele) => {
      getArticle(url + $(ele).attr('href'));
      console.log($(ele).attr('href'));
    })
  });
}

const statistics = {};

function getArticle(url) {
  console.log('url', url);
  request(url).then(($) => {
    const $authors = $('h5 code');
    console.log($authors.length);
    _.each($authors, (ele) => {
      const author = $(ele).text().split('：');
      console.log('author', author);
    })
  })
}

getIndex(homeUrl);
