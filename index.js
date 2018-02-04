// index.js

// window
let fullScreen = document.querySelector('.fullView');

// buttons
let prj = document.getElementById('projects');
let codePen = document.getElementById('cpe');
let github = document.getElementById('git');
let linkedIn = document.getElementById('linked');
let slack = document.getElementById('slck');

// displays
let prjDisplay = document.querySelector('.recent');
let cpeDisplay = document.querySelector('.codepen');
let gitDisplay = document.querySelector('.github');
let linkedInDisplay = document.querySelector('.linkedIn');
let slackDisplay = document.querySelector('.slack');


codePen.addEventListener('click', function switchToCodepen() {
  hideAll();
  cpeDisplay.style.opacity = 0;
  cpeDisplay.style.display = "block";
  freshView(cpeDisplay);
});

prj.addEventListener('click', function switchToProjects() {
  hideAll();
  prjDisplay.style.opacity = 0;
  prjDisplay.style.display = "block";
  freshView(prjDisplay);
});

github.addEventListener('click', function switchToProjects() {
  hideAll();
  gitDisplay.style.opacity = 0;
  gitDisplay.style.display = "block";
  freshView(gitDisplay);
});

linkedIn.addEventListener('click', function switchToProjects() {
  hideAll();
  linkedInDisplay.style.opacity = 0;
  linkedInDisplay.style.display = "block";
  freshView(linkedInDisplay);
});

slack.addEventListener('click', function switchToProjects() {
  hideAll();
  slackDisplay.style.opacity = 0;
  slackDisplay.style.display = "block";
  freshView(slackDisplay);
});

function hideAll( ) {
  TweenMax.to(".recent, .codepen, .github, .linkedIn, .slack", .5, {opacity:0});
  cpeDisplay.style.display = "none";
  prjDisplay.style.display = "none";
  linkedInDisplay.style.display = "none";
  slackDisplay.style.display = "none";
  gitDisplay.style.display = "none";
}

function freshView( specialSection ) {
  TweenMax.to(".fullView", 1, {background:"background: url('./img/bg-pattern.svg')"});
  TweenMax.to(specialSection, 1, {opacity:1});
}

let emailBtn = document.querySelector('.emailBtn');
let eName = document.querySelector('.name');
let eAddress = document.querySelector('.fname');
let eMessage = document.querySelector('.message');
let emailForm = document.querySelector('form');
let submitMsg = document.querySelector('.submitMessage');

emailBtn.addEventListener('click', function(el) {
  el.preventDefault();
  if( eName.value.length < 1 || !eAddress.validity.valid || eMessage.value.length < 1 ) {
    console.log("Missing field!");
    document.querySelector('.labelMessage').style.color = "#4E5669";
    eMessage.style.boxShadow = "";
    document.querySelector('.labelAddress').style.color = "#4E5669";
    eAddress.style.boxShadow = "";
    document.querySelector('.labelName').style.color = "#4E5669";
    eName.style.boxShadow = "";
    invalidForm();
  }
  else {
    console.log("All fields okay.")
    sendEmail();
    thankYou();
  }
});

function invalidForm( ) {
  if (eMessage.value.length < 1) {
    document.querySelector('.labelMessage').style.color = "#f38b78";
    eMessage.style.boxShadow = "0 3px 15px rgba(243, 139, 120, .75)";
    eMessage.focus();
  }
  if (!eAddress.validity.valid) {
    console.log('Email invalid');
    document.querySelector('.labelAddress').style.color = "#f38b78";
    eAddress.style.boxShadow = "0 3px 15px rgba(243, 139, 120, .75)";
    eAddress.focus();
  }
  if (eName.value.length < 1) {
    document.querySelector('.labelName').style.color = "#f38b78";
    eName.style.boxShadow = "0 3px 15px rgba(243, 139, 120, .75)";
    eName.focus();
  }
}

function sendEmail() {
  $.ajax({
    url: "https://formspree.io/nicholas.mink@austincc.edu", 
    method: "POST",
    data: {
      message: eMessage.value,
      email: eAddress.value,
      name: eName.value
    },
    dataType: "json"
  });
  thankYou();
}
function thankYou( ) {
  emailForm.style.display = "none";
  let messageText = `<div><h2>Thanks ${eName.value},</h2><p>I'll be in touch shortly!</p></div>`;
  submitMsg.innerHTML = messageText;
}