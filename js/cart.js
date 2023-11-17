const shippingType = document.querySelectorAll('input[name="envio"]');
const creditCardRadio = document.getElementById("creditCard");
const transferRadio = document.getElementById("bankTransfer");
const card = document.getElementById("card");
const code = document.getElementById("code");
const date = document.getElementById("date");
const transferField = document.getElementById("cardNumber");
let cart = [];
let newTotalCost = 0;


function updateLocalStorage() { //Función para actualizar el carrito del local storage
  let localCart = [];
  for (let i = 1; i < cart.length; i++) { //Recorremos el carrito y le vamos cargando los items al carrito del local storage
    localCart.push(cart[i]);
    
  }
  localStorage.setItem("cart", JSON.stringify(localCart));
}

function updateTotalCost() { //Función para actualizar el costo total de todos los productos
  let totalCost = 0;
  newTotalCost = 0;
  for (let i = 0; i < cart.length; i++) {  //Recorremos el carrito y vamos incrementando el monto total según el subtotal de cada producto
    newTotalCost += (cart[i].unitCost * cart[i].count);
  }
  totalCost = newTotalCost;

  const totalCostHtml = document.getElementById("subtotalGeneral");
  totalCostHtml.textContent = `Total: $${newTotalCost.toFixed(2)}`;
}

async function getCartItems() { //Función para obtener los items del carrito
  try {
    
    let response = await fetch("https://japceibal.github.io/emercado-api/user_cart/25801.json");
    let info = await response.json();
    let preloadedItem = info.articles;
    let cartHTML = ""
    cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.unshift(preloadedItem[0]);

    for (let i = 0; i < cart.length; i++) { //Recorremos los productos del carrito y generamos una fila para cada producto
      cartHTML += `
      <tr id="cartRow${cart[i].id}">
        <td><img src="${cart[i].image}" width="80px" class="cartImg"></td>
        <td>${cart[i].name}</td>
        <td>${cart[i].currency} ${cart[i].unitCost}</td>
        <td><input type="number" id="cartCount${cart[i].id}" value="${cart[i].count}" class="cartCant" data-index="${i}" min="1" required></td>
        <td id ="cartSub${cart[i].id}">${cart[i].currency} ${(cart[i].unitCost * cart[i].count)}</td>
        <td><button class="btn btn-danger remove-item" data-index="${i}">Eliminar</button></td>
      </tr>`;
    }

    document.getElementById("cartList").innerHTML += cartHTML;

    const removeButtons = document.querySelectorAll(".remove-item"); //Obtenemos los botones para eliminar los productos

    removeButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const index = event.target.getAttribute("data-index");
        console.log(index);
        console.log(cart.length);
        console.log(cart);
        // Elimina la fila de la tabla con el índice correspondiente
        if (index >= 0 && index < cart.length) {
          // Elimina la fila de la tabla
          const row = document.getElementById(`cartRow${cart[index].id}`);
          if (row) {
            row.remove();
      
            cart.splice(index, 1);
      
            updateTotalCost();
            updateLocalStorage();
          }
        }
      });
    });

    function updateSubtotal(event) { //Función para actualizar el subtotal de cada producto
      const input = event.target;
      const index = input.getAttribute('data-index');
      const cant = document.getElementById(`cartCount${cart[index].id}`);
      const subTotal = document.getElementById(`cartSub${cart[index].id}`);


      let count = parseInt(cant.value);
      if (count < 0) {
        count = 0;
      }
      const unitCost = cart[index].unitCost;

      subTotal.textContent = `${cart[index].currency} ${count * unitCost}`;
      cant.value = count;
      cart[index].count = count;

      updateLocalStorage()
      updateTotalCost();
    }

    for (let i = 0; i < cart.length; i++) { //Recorremos los inputs de cantidad de cada elemento para añadirle el escuchador de eventos
      const cant = document.getElementById(`cartCount${cart[i].id}`);
      cant.addEventListener('input', updateSubtotal);
    }

    updateTotalCost();

  } catch (error) {
    console.error("Error al obtener los detalles del producto:", error);
  }
}



function updateTotalCost() {
  newTotalCost = 0;

  for (let i = 0; i < cart.length; i++) {
    newTotalCost += (cart[i].unitCost * cart[i].count);
  }
  totalCost = newTotalCost;

  const totalCostHtml = document.getElementById("subtotalGeneral");
  totalCostHtml.textContent = `Total: $${newTotalCost.toFixed(2)}`;
}


function updateLocalStorage() {
  let localCart = [];
  for (let i = 1; i < cart.length; i++) {
    localCart.push(cart[i]);

  }
  localStorage.setItem("cart", JSON.stringify(localCart));
}



document.addEventListener("DOMContentLoaded", async function () {
  await getCartItems();
});


//Área de validaciones de los checkbox de envío
shippingType.forEach(function (radio) {
  radio.addEventListener('change', function () {
    const shippingCostHtml = document.getElementById("shippingCost");
    const totalToPayHtml = document.getElementById("totalToPay");

    if (radio.checked) {
      if (radio.value === "Premium 2 a 5 días") {
        shippingPercentage = 15;
      } else if (radio.value === "Express 5 a 8 días") {
        shippingPercentage = 7;
      } else if (radio.value === "Standard 12 a 15 días") {
        shippingPercentage = 5;
      }

      //Calculamos el costo de envío y luego el total a pagar
      shippingCost = (newTotalCost * shippingPercentage) / 100; 
      totalToPay = newTotalCost + shippingCost; 

      shippingCostHtml.textContent = `$${shippingCost.toFixed(2)}`; 
      totalToPayHtml.textContent = `$${totalToPay.toFixed(2)}`;
    }
  });
});



//Nos aseguramos de que los campos de la opción no seleccionada se desactiven
creditCardRadio.addEventListener("change", () => {
  if (creditCardRadio.checked) {
    transferField.disabled = true;
    card.disabled = false;
    code.disabled = false;
    date.disabled = false;
  }
});

transferRadio.addEventListener("change", () => {
  if (transferRadio.checked) {
    card.disabled = true;
    code.disabled = true;
    date.disabled = true;
    transferField.disabled = false;
  }
});



function checkModalValidity(){
  const invalid = document.getElementById("modal-invalid-feedback");
  const valid = document.getElementById("modal-valid-feedback");
  const selectPayment = document.getElementById("selectedPayment");
  //Dependiendo de si se eligió tarjeta de crédito o transferencia, validamos los campos correspondientes
  if (creditCardRadio.checked){
    if (!card.value && !code.value && !date.value){
      invalid.style.display= "block";
      valid.style.display= "none";
      selectPayment.innerHTML= 'No ha seleccionado <a href="#paymentModal" data-bs-toggle="modal">Seleccionar</a>';
      return false;
    } else {
      valid.style.display= "block";
      invalid.style.display= "none";
      selectPayment.innerHTML = 'Tarjeta de Crédito <a href="#paymentModal" data-bs-toggle="modal">Seleccionar</a>';
      return true;
    }
  } else if (transferRadio.checked) {
      if(!transferField.value){
        invalid.style.display= "block";
        valid.style.display= "none";
        selectPayment.innerHTML= 'No ha seleccionado <a href="#paymentModal" data-bs-toggle="modal">Seleccionar</a>';
        return false;
      } else{
        valid.style.display= "block";
        invalid.style.display= "none";
        selectPayment.innerHTML= 'Transferencia <a href="#paymentModal" data-bs-toggle="modal">Seleccionar</a>';
        return true;
      }
  } else {
    invalid.style.display= "block";
    valid.style.display= "none";
    return false;
  }
  
} 



(function () {
  'use strict'
  const forms = document.querySelectorAll('.needs-validation');
  const successAlert = document.getElementById('success-alert');

  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        //Validamos el form y el modal
        console.log(form.checkValidity());

        if (!form.checkValidity()) {
          console.log("a");
          event.preventDefault()
          event.stopPropagation()
          checkModalValidity();
          //Validamos el modal cada vez que se cierre
          document.getElementById("modalClose").addEventListener("click", checkModalValidity);
          
        } else {
          //Si es válido, envía una alerta de éxito
          console.log("b");
          successAlert.style.display = 'block';
        }
        form.classList.add('was-validated')
      }, false)

      form.addEventListener('click', function (event) {
        if (event.target.classList.contains('remove-item')) {
          event.preventDefault();
        }
      });
    })
})();