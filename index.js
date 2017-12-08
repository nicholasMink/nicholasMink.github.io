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
