const express = require('express');
const keys = require('./keys/key');
const apiai = require('apiai')(keys.sessionId);

const app = express();
const Port = process.env.PORT || 3000;
const server = app.listen(Port)
const io = require('socket.io')(server);

io.on('connection', function(socket){
  console.log('a user connected');
});

app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));

app.get('/',(req,res) =>{
	res.sendFile('index.html');
})

io.on('connection', function(socket) {

  socket.on('chat message', (text) => {
    let apiaiReq = apiai.textRequest(text, {
      sessionId: "APIAI_SESSION_ID"
    });

    apiaiReq.on('response', (response) => {
      let aiText = response.result.fulfillment.speech;
      console.log(aiText);
      socket.emit('bot reply', aiText); // Send the result back to the browser!
    });

    apiaiReq.on('error', (error) => {
      console.log(error);
    });

    apiaiReq.end();
  });

});



