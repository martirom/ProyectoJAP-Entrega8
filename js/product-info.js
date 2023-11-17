const prodID = localStorage.getItem('prodID');
let currentProduct = [];
let currentProductComments = [];

function redirectRelProd(prodID) {
    localStorage.setItem("prodID", prodID);
    window.location = "product-info.html"
}

function showProductInfo(){
    // Array con las imagenes
    const productImages = currentProduct.images;
    let carouselImages = '';

    // Bucle que recorre el array y genera el codigo html para las imagenes del carousel, se le coloca la clase 'active' al elemento 0 del array
    for (let i = 0; i < productImages.length; i++) {
        carouselImages += `
            <div class="carousel-item ${i === 0 ? 'active' : ''}">
                <img class="d-block imgsProduct" src="${productImages[i]}" alt="imgsProduct">
            </div>
        `;
    }

    let productHTML = `
        <h1 class="pTitle">${currentProduct.name}</h1>
        <button class="buy-button">Comprar</button>
        <p class="pProducts"><span>Precio:</span> ${currentProduct.currency} ${currentProduct.cost}</p>
        <p class="pProducts"><span>Descripción:</span> ${currentProduct.description}</p>
        <p class="pProducts"><span>Categoria:</span> ${currentProduct.category}</p>
        <p class="pProducts"><span>Vendidos:</span> ${currentProduct.soldCount}</p>
            
        <div id="carouselExampleControls" class="carousel carousel-dark slide" data-bs-ride="carousel">
            <div class="carousel-inner imgsProductFlex">
                ${carouselImages}
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>
        `;
        document.getElementById("containerInfo").innerHTML = productHTML;


        
        let relProds = currentProduct.relatedProducts;
        let relProdsHTML = "";
        for (let i = 0; i < relProds.length; i++) {
            relProdsHTML += ` <div id="relProd" onclick="redirectRelProd(${relProds[i].id})"><p><img id="imgRelProds" src="${relProds[i].image}"> ${relProds[i].name}</p></div>`
        }
        document.getElementById("relatedContainer").innerHTML = relProdsHTML;
}


function createStarRating(rating) {
    const maxRating = 5;
    let starHTML = "";
    for (let i = 1; i <= maxRating; i++) {
        if (i <= rating) {
            starHTML += '<span class="fa fa-star checked"></span>';
        } else {
            starHTML += '<span class="fa fa-star"></span>';
        }
    }
    return starHTML;
}


document.getElementById("comment-submit").addEventListener("click", function () {

    const newComment = document.getElementById("new-comment");
    const ratesSelect = document.getElementById("rates");
    const userName = localStorage.getItem('loggedUser');
    const date = new Date(); // Obtenemos la Fecha Actual creando un nuevo objeto Date
    const year = date.getFullYear(); // Obtenemos el Año
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Obtenemos el mes y usamos .padStart(2, '0') para que el minimo de la cadena sea 2 digitos en caso de tener un solo digito se añade un 0 adelante.
    const day = String(date.getDate()).padStart(2, '0'); // Obtenemos el dia
    const hours = String(date.getHours()).padStart(2, '0'); // Obtenemos la hora
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Obtenemos los minutos
    const seconds = String(date.getSeconds()).padStart(2, '0'); // Obtenemos los segundos
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`; // Creamos el string de la fecha formateada

    const submittedComment = {comment: {product: parseInt(prodID), score: parseInt(ratesSelect.value), description: newComment.value, user: userName, dateTime: formattedDate}};
    postJSONData((BASE_URL + PRODUCT_INFO_COMMENTS_URL + prodID), submittedComment);
    

    newComment.value = "";
    ratesSelect.selectedIndex = 0;
});

function showComments(){
    let productscommentsHTML = "";

    for (let i = 0; i < currentProductComments.length; i++) {
        let comment = currentProductComments[i];
        let starRating = createStarRating(comment.score);
        productscommentsHTML += `
        <div class="commentsContainer">
            <p class="pComment">${comment.user} - ${comment.dateTime} - ${starRating}</p>
            <p class="pComment">${comment.description}</p>
            </div>
        `;
    }
    document.getElementById("container-comments").innerHTML = productscommentsHTML;

}



document.addEventListener("DOMContentLoaded", function (e) {
    
    getJSONData(BASE_URL + PRODUCT_INFO_URL + prodID).then(function (resultObj) {
        if (resultObj.status === "ok") {
            currentProduct = resultObj.data;
            showProductInfo();
        }
    });
    getJSONData(BASE_URL + PRODUCT_INFO_COMMENTS_URL + prodID).then(function (resultObj) {
        if (resultObj.status === "ok") {
            currentProductComments = resultObj.data;
            showComments();
        }
    });
});


// Sección para agregar producto al carrito

document.getElementById("addToCart").addEventListener("click", function () {
    const prodID = localStorage.getItem("prodID");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const conversionRate = 43; // 1 USD = 43 UYU
    if (prodID !== null) {

        // Aquí obtenemos información del producto
        const URL = `${URL_BASE}${prodID}.json`;
        fetch(URL)
            .then((response) => response.json())
            .then((article) => {

                const newItem = { id: prodID, name: article.name, count: 1, unitCost: article.cost, currency: article.currency, image: article.images[0] };

                if (newItem.currency === "UYU") {
                    newItem.currency = "USD";
                    newItem.unitCost = Math.round(newItem.unitCost / conversionRate);
                }
                const index = cart.findIndex(item => item.id === newItem.id);

                if (index !== -1) {
                    cart[index].count += 1;
                } else {
                    cart.push(newItem);
                }
                // Agregamos el producto al carrito
                localStorage.setItem("cart", JSON.stringify(cart));
                // Redirige al usuario a la página del carrito
                window.location.href = "cart.html";
                // Desplegamos un mensaje de confirmación
                document.getElementById("addToCartMessage").style.display = "block";

            })
            .catch((error) => {
                console.error("Error al obtener detalles del producto:", error);
            });
    }
});

