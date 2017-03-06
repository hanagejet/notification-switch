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
  const html = buy_button.replace(/(\n|\t)/g, '');
  pushHtml(html)
  .then(function(response) {
    console.log('Post Successed!!');
    getLastHtml()
    .then(function(lastHtml) {
      if (lastHtml.indexOf(html) >= 0) {
        // TODO: send change e-mail!!
      }
      // TODO: send not change e-mail :(
    });
  })
  .catch(function(error) {
    console.log(error);
  });
})

const pushHtml = function(html) {
  return firebase.database().ref('data').push({
    html: html,
    createDateAt: moment().format(),
  });
};

const getLastHtml = function() {
  const lastHtml = [];
  return new Promise(function(resolve, reject) {
    firebase.database().ref('data').endAt().limitToLast(2).on('child_added', function(snapshot) {
      lastHtml.push(snapshot.val());
      return resolve(lastHtml[0]);
    });
  })
}
