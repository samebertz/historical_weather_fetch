'use strict';

window.onload = () => {

  var button_fetch = document.getElementById('fetch');
  button_fetch.onclick = (event) => {
    console.log();
  };

  // var xhr = new XMLHttpRequest();
  // xhr.responseType = 'blob';
  //
  // xhr.onload = function(event) {
  //   var blob = xhr.response;
  //     document.getElementById('results').innerHTML = blob.toString();
  // };
  //
  // xhr.open(null, 'ftp://ftp.ncdc.noaa.gov/pub/data/ghcn/daily/by_year', true, 'anonymous', '@anonymous');
  // xhr.send();

  // setTimeout(() => {
  //   document.getElementById('results').innerHTML = 'nope';
  // }, 5000);
};
