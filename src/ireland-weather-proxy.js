const http = require('http');
const https = require('https');
const config = require('./config.json');

http.createServer(onRequest).listen(9876);

function onRequest(client_req, client_res) {
  var options = {
    hostname: 'api.darksky.net',
    port: 443,
    path: `/forecast/${config.darkskyKey}${client_req.url}`,
    method: 'GET'
  };

  client_res.setHeader('Access-Control-Allow-Origin', '*');

  var proxy = https.request(options, function (res) {
    res.pipe(client_res, {
      end: true
    });
  });

  client_req.pipe(proxy, {
    end: true
  });
}
