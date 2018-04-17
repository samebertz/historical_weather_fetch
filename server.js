/* jshint node: true */
/* jshint esversion: 6 */

// core node HTTP module - contains HTTP server and client
var http = require('http');
// core node URL module - for URL resolution and parsing
var url = require('url');
// core node file system module - for file I/O
var fs = require('fs');
// core node path module - for working with file and directory paths
var path = require('path');
// directory name of the current module **NOT GLOBAL**, same as path.dirname() of __filename for said module
var baseDirectory = __dirname;   // or whatever base directory you want

// set port to listen to
var port = 30000;

// create an HTTP server
http.createServer(function (request, response) {
  // try handling the request
  try {
    // for POST requests
    if (request.method == 'POST') {
      // log that it was a POST method
      console.log("POST");
      // start building response body
      var body = '';
      // register "on data" callback
      request.on('data', function (data) {
        // append data to body
        body += data;
        // log current body - should contain data received so far
        console.log("Partial body: " + body);
      });
      // register "on end" callback for HTTP request
      request.on('end', function () {
        // log final body - should contain all data received
        console.log("Body: " + body);
        // write response HTTP headers - should be called before any calls to response.write() or response.end()
        response.writeHead(200, {'Content-Type': 'text/html'});
        // write response body - response.write(chunk[, encoding[, callback]])
        response.write(body, 'utf8');
        // notify server that all response headers and body have been sent - response.end([data]) makes implicit call to response.write([data]) first
        response.end('post received');
      });
    // for non-POST requests
    } else {
      // store parsed request URL, from [request] parameter in http.createServer() callback
      var requestUrl = url.parse(request.url);
      // need to use path.normalize so people can't access directories underneath baseDirectory
      var fsPath = baseDirectory+path.normalize(requestUrl.pathname);

      // write HTTP response headers
      response.writeHead(200);
      // open file at requested path as read stream
      var fileStream = fs.createReadStream(fsPath);
      // pipe the stream into the response
      fileStream.pipe(response);
      // register "on error" callback on file read stream
      fileStream.on('error',function(e) {
        // write HTTP error response header
        response.writeHead(404);     // assume the file doesn't exist
        // notify server that all response headers and body have been sent
        response.end();
      });
    }
  // on some error handling the request
  } catch(e) {
    // write HTTP response header for unknown error
    response.writeHead(500);
    // notify server that all response headers and body have been sent
    response.end();     // end the response so browsers don't hang
    // log error stacktrace to console
    console.log(e.stack);
  }
// set HTTP server to listen on [port]
}).listen(port);
// log port
console.log("listening on port "+port);
