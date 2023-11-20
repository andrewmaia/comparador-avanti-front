/** @format */
//https://plainenglish.io/blog/the-basic-vanilla-js-project-setup-9290dce6403f
"use strict";

// Selectors
const txtEmail = document.getElementById("txtEmail");
const txtSugestao = document.getElementById("txtSugestao");
const btnEnviar = document.getElementById("btnEnviar");
const divMensagem = document.getElementById("divMensagem");
const divValidacaoEmail = document.getElementById("divValidacaoEmail");
const divValidacaoSugestao = document.getElementById("divValidacaoSugestao");

// Event Listeners
txtEmail.addEventListener("change", txtEmail_onChange);
txtSugestao.addEventListener("change", txtSugestao_onChange);
btnEnviar.addEventListener("click", enviar);

// Functions
function txtEmail_onChange(event) {
  validarEmail(event.target.value);
}

function txtSugestao_onChange(event) {
  validarSugestao(event.target.value);
}

function enviar(event) {
  let valido = true;
  event.preventDefault(); //Nao faz subimit

  if (!validarEmail(txtEmail.value)) {
    valido = false;
  }

  if (!validarSugestao(txtSugestao.value)) {
    valido = false;
  }

  if (!valido) return;

  const xhttp = new XMLHttpRequest();
  xhttp.onload = retornoEnvio;
  // eslint-disable-next-line no-undef
  xhttp.open("POST", `${backendDefaultUrl}/sugestao`);
  xhttp.send("Mensagem: " + txtSugestao.value + ". Email: " + txtEmail.value);
}
function retornoEnvio() {
  txtEmail.value = "";
  txtSugestao.value = "";
  btnEnviar.style.display = "none";
  divMensagem.style.display = "block";
}

function validarEmail(email) {
  const pattern =
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

  let valido = pattern.test(email);
  if (valido) {
    divValidacaoEmail.style.display = "none";
  } else {
    divValidacaoEmail.style.display = "block";
  }

  return valido;
}

function validarSugestao(sugestao) {
  let valido = sugestao.trim() !== "";
  if (valido) {
    divValidacaoSugestao.style.display = "none";
  } else {
    divValidacaoSugestao.style.display = "block";
  }

  return valido;
}
