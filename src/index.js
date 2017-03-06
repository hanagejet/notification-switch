const client = require('cheerio-httpcli');

client.fetch('https://store.nintendo.co.jp/category/NINTENDOSWITCH/HAC_S_KAYAA.html')
.then(function(result) {
  const $ = result.$; // jQuery Objects

  // Show response header
  console.log(result.response.headers);

  // Show Title
  console.log($('title').text());

  const buy_button = $('.content_area .add_area').html();
})
