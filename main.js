/* jshint node: true */
/* jshint esversion: 6*/

// set strict syntax
'use strict';

const jsftp = require('jsftp');
const zlib = require('zlib');
const readline = require('readline');
const { Writable } = require('stream');

const gunzip = zlib.createGunzip();
const rl = readline.createInterface({input: gunzip});

var ftp = new jsftp({
  host: 'ftp.ncdc.noaa.gov',
});

class ftpResultWriter extends Writable {
  constructor(options) {
    super(options);
  }
  _write(chunk, enc, callback) {
    var resultDiv = document.getElementById('result');
    resultDiv.text = resultDiv.text + chunk;
    callback();
  }
}

rl.on('line', (input) => {
  var data = input.split(',');
  data[1] = data[1].toString();
  data[1] = new Date(
    parseInt(data[1].substring(0,4)),
    parseInt(data[1].substring(4,6)) - 1,
    parseInt(data[1].substring(6,8))
  );
  data[1] = data[1].toDateString();
  data[3] = parseInt(data[3]) / 10.0;
  data[3] = data[3].toString();
  data = data.map( (e) => { return e.padStart(4); } ).join(' | ');
  console.log('received: ' + data);
});

var _exit = function() {
  ftp.raw('quit', function(err, data) {
    if (err) return console.error(err);

    console.log('Bye!');
    process.exit();
  });
};

var cwd = function() {
    ftp.raw('cwd', '/pub/data/ghcn/daily/by_year', function (err, data) {
      // console.log('code: ' + data.code);
      // console.log('text: ' + data.text);
      get_year();
    });
  };

var get_year = function() {
    ftp.get(year + '.csv.gz', function (err, socket) {
      if (err) return console.error(err);

      socket.pipe(gunzip);//.pipe(new ftpResultWriter());
      socket.on('close', function(err) {
        if (err) console.error('Error retrieving the file.');
        _exit();
      });
      socket.resume();
    });
  };

var run = function() {
  year = process.argv[2] || 1763;
  cwd();
};

var year;
run();
