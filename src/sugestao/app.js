/** @format */
//https://plainenglish.io/blog/the-basic-vanilla-js-project-setup-9290dce6403f
"use strict";

const backendDefaultUrl =
  "https://4noc3xgwa0.execute-api.us-east-1.amazonaws.com/Prod";

// Selectors
const txtEmail = document.getElementById("txtEmail");
const txtSugestao = document.getElementById("txtSugestao");
const btnEnviar = document.getElementById("btnEnviar");
const divMensagem = document.getElementById("divMensagem");
const rodape = document.getElementsByTagName("footer")[0];

// Event Listeners
window.addEventListener("load", carregarRodape);
btnEnviar.addEventListener("click", enviar);

// Functions
function enviar(event) {
  event.preventDefault(); //Nao faz subimit

  if (txtEmail.value === "") {
    alert("É necessário fornecer um email!");
    return;
  }

  if (txtSugestao.value === "") {
    alert("É necessário fornecer uma sugestão!");
    return;
  }

  const xhttp = new XMLHttpRequest();
  xhttp.onload = retornoEnvio;
  xhttp.open("POST", `${backendDefaultUrl}/sugestao`);
  xhttp.send("Mensagem: " + txtSugestao.value + ". Email: " + txtEmail.value);
}
function retornoEnvio() {
  btnEnviar.style.display = "none";
  divMensagem.style.display = "block";
}

function carregarRodape() {
  rodape.innerHTML = rodape.innerHTML.replace("ano", new Date().getFullYear());
}
