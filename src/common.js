/** @format */

"use strict";

const rodape = document.getElementsByTagName("footer")[0];

window.addEventListener("load", carregarRodape);

function carregarRodape() {
  rodape.innerHTML = rodape.innerHTML.replace("ano", new Date().getFullYear());
}
