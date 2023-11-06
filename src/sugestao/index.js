/** @format */
//https://plainenglish.io/blog/the-basic-vanilla-js-project-setup-9290dce6403f
"use strict";

// Selectors
const txtEmail = document.getElementById("txtEmail");
const txtSugestao = document.getElementById("txtSugestao");
const btnEnviar = document.getElementById("btnEnviar");
const divMensagem = document.getElementById("divMensagem");

// Event Listeners
btnEnviar.addEventListener("click", enviar);

// Functions
function enviar(event) {
  event.preventDefault(); //Nao faz subimit

  if (!validarEmail(txtEmail.value)) {
    alert("Forneça um email válido!");
    return;
  }

  if (txtSugestao.value.trim() === "") {
    alert("É necessário fornecer uma sugestão!");
    return;
  }

  const xhttp = new XMLHttpRequest();
  xhttp.onload = retornoEnvio;
  // eslint-disable-next-line no-undef
  xhttp.open("POST", `${backendDefaultUrl}/sugestao`);
  xhttp.send("Mensagem: " + txtSugestao.value + ". Email: " + txtEmail.value);
}
function retornoEnvio() {
  btnEnviar.style.display = "none";
  divMensagem.style.display = "block";
}

function validarEmail(email) {
  const pattern =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  return pattern.test(email);
}
