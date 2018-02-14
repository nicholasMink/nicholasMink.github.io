'use strict';

let emailBtn = document.querySelector('.emailBtn');
let eName = document.querySelector('.name');
let eAddress = document.querySelector('.fname');
let eMessage = document.querySelector('.message');
let emailForm = document.querySelector('form');
let submitMsg = document.querySelector('.submitMessage');

emailBtn.addEventListener('click', function(el) {
  el.preventDefault();
  let emailValid = /(.+)@(.+){2,}\.(.+){2,}/.test(eAddress.value);
  if( eName.value.length < 1 || !emailValid || eMessage.value.length < 1 ) {
    console.log("Missing field!");
    document.querySelector('.labelMessage').style.color = "#4E5669";
    eMessage.style.boxShadow = "";
    document.querySelector('.labelAddress').style.color = "#4E5669";
    eAddress.style.boxShadow = "";
    document.querySelector('.labelName').style.color = "#4E5669";
    eName.style.boxShadow = "";
    invalidForm(emailValid);
  }
  else {
    console.log("All fields okay.")
    sendEmail();
    thankYou();
  }
});

function invalidForm( isValidEmail ) {
  if (eMessage.value.length < 1) {
    document.querySelector('.labelMessage').style.color = "#f38b78";
    eMessage.style.boxShadow = "0 3px 15px rgba(243, 139, 120, .75)";
    eMessage.focus();
  }
  if (!isValidEmail) {
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