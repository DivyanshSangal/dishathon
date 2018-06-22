
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
const socket = io();
recognition.lang = 'en-US';
recognition.interimResults = false;

document.querySelector('button').addEventListener('click', () => {
	console.log('button cliked');
  recognition.start();
});

recognition.addEventListener('result', (e) => {
	console.log('recognition');
  let last = e.results.length - 1;
  let text = e.results[last][0].transcript;
	console.log(text);
  console.log('Confidence: ' + e.results[0][0].confidence);
	
	socket.emit('chat message', text);
});

socket.on('bot reply', function(replyText) {
	console.log(replyText);
  synthVoice(replyText);
});

function synthVoice(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance();
  utterance.text = text;
  synth.speak(utterance);
}

