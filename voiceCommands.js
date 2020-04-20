var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent =
  SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var commands = ["up", "down", "right", "left", "forward", "back", "shoot"];
var grammar =
  "#JSGF V1.0; grammar commands; public <command> = " +
  commands.join(" | ") +
  " ;";

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.maxAlternatives = 2;

// var diagnostic = document.querySelector(".output");
var diagnostic = document.createElement("div");
diagnostic.style = "position: absolute; top:5vh;";
// var bg = document.querySelector("html");
// var hints = document.querySelector(".hints");

// var colorHTML = "";
// colors.forEach(function (v, i, a) {
//   console.log(v, i);
//   colorHTML +=
//     '<span style="background-color:' + v + ';"> ' + v + " </span>";
// });
hints = document.createElement("div");
hints.style =
  "position: absolute; top: 0; width: 100vw; background-color: rgba(0,0,0,0.5) color: white;";
hints.innerHTML = "Tap/click then say a command. Try 'up'";
document.body.append(hints);
document.body.append();

// document.body.onclick = function () {
//   recognition.start();
//   console.log("Ready to receive a command.");
// };

// document.addEventListener("keydown", () => {
//   recognition.start();
//   console.log("Enter to talk");
// });

recognition.onresult = function (event) {
  // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
  // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
  // It has a getter so it can be accessed like an array
  // The first [0] returns the SpeechRecognitionResult at the last position.
  // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
  // These also have getters so they can be accessed like arrays.
  // The second [0] returns the SpeechRecognitionAlternative at position 0.
  // We then return the transcript property of the SpeechRecognitionAlternative object
  let alts = [];
  let word = event.results[0][0].transcript;
  for (w in event.results[0]) {
    let wt = event.results[0][w].transcript;
    alts.push(wt);
    if (commands.includes(wt)) {
      word = wt;
      if (useCommand) {
        useCommand(word);
      }
      break;
    }
  }

  console.log(alts);

  diagnostic.textContent = "Result received: " + word + ".";
  // bg.style.backgroundColor = color;
  console.log("Confidence: " + event.results[0][0].confidence);
};

recognition.onspeechend = function () {
  recognition.stop();
};

recognition.onnomatch = function (event) {
  diagnostic.textContent = "I didn't recognise that command.";
};

recognition.onerror = function (event) {
  diagnostic.textContent = "Error occurred in recognition: " + event.error;
};
