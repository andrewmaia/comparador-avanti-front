/** @format */
//https://plainenglish.io/blog/the-basic-vanilla-js-project-setup-9290dce6403f

// Selectors
const divPrincipal = document.getElementById("divPrincipal");
const btnComparar = document.getElementById("btnComparar");

// Event Listeners
btnComparar.addEventListener("click", apresentarMensagem);

// Functions
function apresentarMensagem(event) {
  //Nao faz subimit
  event.preventDefault();
  divPrincipal.classList.remove("naoAparecer");
  divPrincipal.classList.add("aparecer");
}
