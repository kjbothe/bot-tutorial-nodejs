var HTTPS = require('https');
var cool = require('cool-ascii-faces');
var fs = require('fs');

var spamfile = "./allstar.txt"
var botID = process.env.BOT_ID;

function respond() {
  var request = JSON.parse(this.req.chunks[0]),
      botRegex = /^\/cool guy$/;

  if(request.text && botRegex.test(request.text)) {
    this.res.writeHead(200);
    postSpamfile();
    this.res.end();
  } else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}

function postMessage(botResponse) {
  var options, body, botReq;

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : botResponse
  };

  console.log('sending ' + botResponse + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}

function postSpamfile() {
  var i, j, text, lines, words;

  text = fs.readFileSync(spamfile, "utf8");
  lines = text.split("\n");

  for (i = 0; i < lines.length; i++) {
    setTimeout(postMessage, 500, lines[i]);
    //words = lines[i].split(" ");
    //for (j = 0; j < words.length; j++) {
      //setTimeout(postMessage.bind(null, words[j]), 500);
    //}
  }
}

exports.respond = respond;
