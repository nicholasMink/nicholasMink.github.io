// index.js

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
  prjDisplay.style.display = "none";
  gitDisplay.style.display = "none";
  linkedInDisplay.style.display = "none";
  slackDisplay.style.display = "none";
  cpeDisplay.style.display = "block";
});

prj.addEventListener('click', function switchToProjects() {
  cpeDisplay.style.display = "none";
  gitDisplay.style.display = "none";
  linkedInDisplay.style.display = "none";
  slackDisplay.style.display = "none";
  prjDisplay.style.display = "block";
});

github.addEventListener('click', function switchToProjects() {
  cpeDisplay.style.display = "none";
  prjDisplay.style.display = "none";
  linkedInDisplay.style.display = "none";
  slackDisplay.style.display = "none";
  gitDisplay.style.display = "block";
});

linkedIn.addEventListener('click', function switchToProjects() {
  cpeDisplay.style.display = "none";
  prjDisplay.style.display = "none";
  slackDisplay.style.display = "none";
  gitDisplay.style.display = "none";
  linkedInDisplay.style.display = "block";
});

slack.addEventListener('click', function switchToProjects() {
  cpeDisplay.style.display = "none";
  prjDisplay.style.display = "none";
  gitDisplay.style.display = "none";
  linkedInDisplay.style.display = "none";
  slackDisplay.style.display = "block";
});