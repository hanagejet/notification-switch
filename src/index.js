const client = require('cheerio-httpcli');
const config = require('./config.js');
const firebase = require('firebase');
const moment = require('moment');

firebase.initializeApp(config.firebase);

const fetch = client.fetch('https://store.nintendo.co.jp/category/NINTENDOSWITCH/HAC_S_KAYAA.html')
.then(function(result) {
  const $ = result.$; // jQuery Objects

  // Show response header
  console.log(result.response.headers);

  // Show Title
  console.log($('title').text());

  const buy_button = $('.content_area .add_area').html();
  pushHtml(buy_button);
})

const pushHtml = function(html) {
  firebase.database().ref('data').push({
    html: html,
    createDateAt: moment().format(),
  })
  .then(function(response) {
    console.log('Success!!');
  })
  .catch(function(error) {
    console.log(`Error Message: ${error}`);
  });
};
