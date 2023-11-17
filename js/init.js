const BASE_URL = "http://localhost:3000"
const CATEGORIES_URL = "/cats/";
const PRODUCT_INFO_URL = "/prods/";
const PRODUCT_INFO_COMMENTS_URL = "/prodComment/";
const CART_INFO_URL = "/cart/";
const CART_BUY_URL = "/buy";
const PUBLISH_PRODUCT_URL = "/sell";
const EXT_TYPE = ".json";


let showSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function (url) {
  let result = {};
  showSpinner();
  return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function (response) {
      result.status = 'ok';
      result.data = response;
      hideSpinner();
      return result;
    })
    .catch(function (error) {
      result.status = 'error';
      result.data = error;
      hideSpinner();
      return result;
    });
}

let postJSONData = function(url){
  let result = {};
  showSpinner();
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(function (response) {
      result.status = 'ok';
      result.data = response;
      hideSpinner();
      return result;
    })
    .catch(function (error) {
      result.status = 'error';
      result.data = error;
      hideSpinner();
      return result;
    });
}

function enableDarkMode() {
  let main_body = document.body;
  let checkbox = document.getElementById("checkitem");
  main_body.classList.toggle("dark");
  localStorage.setItem("checkbox-status", checkbox.checked);

  //En caso de querer confirmar si el checkbox está "checked"
  if (document.getElementById("checkitem").checked) {
    console.log("checked");
  } else {
    console.log("Not checked");
  }

  //Guardamos el modo en localStorage
  if (main_body.classList.contains("dark")) {
    localStorage.setItem("dark-mode", "true");
  } else {
    localStorage.setItem("dark-mode", "false");
  }

  const checkboxStatus = localStorage.getItem("checkbox-status");
  if (checkboxStatus === "true") {
    checkbox.checked = true;
  } else {
    checkbox.checked = false;
  }

  //Obtener el modo actual
  if (localStorage.getItem("dark-mode") === "true") {
    main_body.classList.add("dark");
  } else {
    main_body.classList.remove("dark");
  }
}

// Obtenemos el estado del checkbox guardado en localStorage



document.addEventListener("DOMContentLoaded", () => {
  const loggedUser = localStorage.getItem("loggedUser");
  const displayUser = document.getElementById("userDisplayed");
  const logoutBtn = document.getElementById('logoutBtn');


  if (loggedUser) {
    displayUser.innerHTML = `User: ${loggedUser}`;
  } else {
    alert('Debes iniciar sesión para acceder a esta página.');
    window.location.href = 'login.html';
  }

  logoutBtn.addEventListener('click', function () {
    localStorage.removeItem('loggedUser');
    localStorage.removeItem('email');
    localStorage.removeItem('nombre');
    localStorage.removeItem('segundoNombre');
    localStorage.removeItem('apellido');
    localStorage.removeItem('segundoApellido');
    localStorage.removeItem('telefono');
    localStorage.removeItem('userProfileImage');
    window.location.href = 'index.html';
  });

  enableDarkMode;

});
