const fs = require('fs');
const path = require('path');
const client = require('cheerio-httpcli');
const config = require('./config.js');
const firebase = require('firebase');
const moment = require('moment');
const email = require('./gmail.js');

firebase.initializeApp(config.firebase);

const interval = 1000;
setInterval(function() {
  // TODO: init();
}, interval);

function init() {
  client.fetch('https://store.nintendo.co.jp/category/NINTENDOSWITCH/HAC_S_KAYAA.html')
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
       let raw;
       if (lastHtml.html.indexOf(html) >= 0) {
         console.log('NO CHANGED');
         raw = email.makeBody('taroage@gmail.com', 'taroage@gmail.com', 'NOT CHANGED :(', 'RESULT: ' + html);
       } else {
         console.log('CHANGED??????!!');
         raw = email.makeBody(
           'taroage@gmail.com',
           'taroage@gmail.com',
           'OMG!!',
           `CHECK NOW!!: https://store.nintendo.co.jp/category/NINTENDOSWITCH/HAC_S_KAYAA.html\n
           RESULT: ` + html
         );
       }

       send(raw);
     });
   })
   .catch(function(error) {
     console.log('Error fetch: ' + error);
   });
 })
}


// Load client secrets from a local file.
function send(raw) {
  fs.readFile(path.join(__dirname, 'client_secret.json'), function processClientSecrets(err, content) {
    if (err) {
      console.log('Error loading client secret file: ' + err);
      return;
    }
    // Authorize a client with the loaded credentials, then call the
    // Gmail API.
    email.authorize(JSON.parse(content).web, email.sendMessage, raw);
  });
}

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
