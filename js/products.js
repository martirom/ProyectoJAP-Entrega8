//Cambiamos el nombre a URL base, quitando así la referencia a solo 101.

const URL_BASE = "https://japceibal.github.io/emercado-api/cats_products/";
const article_list = document.getElementsByClassName("list-group-item");
const search = document.getElementById("product-search");
const minPrice = document.getElementById("rangeFilterCostMin");
const maxPrice = document.getElementById("rangeFilterCostMax");
const list = document.getElementById("list");
let catName = "";
let products = [];


async function getProducts() { //Función para obtener los productos de la API
    try {
        //Creamos una constante llamada catID, que tome la info desde el localStorage. 
        const catID = localStorage.getItem('catID')
        // Y otra constante, que modificara la URL a usar en las funciones, que tomara la categoría a la que el cliente haga click
        const URL = `${URL_BASE}${catID}.json`;

        let response = await fetch(URL);
        let info = await response.json();
        catName = info.catName;
        let array = info.products;
        //Obtenemos los productos y devolvemos el array
        return array;
    } catch (error) {
        //Desplegamos un error en caso de que el fetch no logre conectarse
        console.error("Error al obtener los productos:", error);
        return [];
    }
}


function setProdID(id) { //Función que almacena el valor del id de un producto y redirige a product-info
    localStorage.setItem("prodID", id);
    window.location = "product-info.html"
}


function generateHTML(id, image, name, currency, cost, desc, soldCount) { //Función para generar el HTML que muestra los productos
    //Con el atributo onclick nos aseguramos de que al hacer click se llame a la función setProdID, con el id del producto correspondiente como parámetro
    return `
    <div onclick="setProdID(${id})" class="list-group-item list-group-item-action"> 
        <div class="row">
            <div class="col-3">
                <img src="` + image + `" alt="product image" class="img-thumbnail">
            </div>
            <div class="col">
                <div class="d-flex w-100 justify-content-between">
                    <div class="mb-1">
                        <h4>`+ name + " - " + currency + " <span>" + cost + `</span></h4> 
                        <p> `+ desc + `</p> 
                    </div>
                    <small class="text-muted">` + soldCount + ` vendidos </small> 
                </div>
            </div>
        </div>
    </div>`;
}



document.getElementById("rangeFilterCost").addEventListener("click", async function () { //Función para filtrar los productos un rango de precio
    let articles = await getProducts(); //Obtenemos los productos
    htmlContentToAppend = "";
    for (const article of articles) { //Con un for recorremos los artículos
        if (article.cost <= maxPrice.value && article.cost >= minPrice.value) { //Verificamos si el artículo está dentro del rango de precio indicado
            //Generamos el HTML con los datos del producto que coincide
            htmlContentToAppend += generateHTML(article.id, article.image, article.name, article.currency, article.cost, article.description, article.soldCount);
        }
        list.innerHTML = htmlContentToAppend; //Añadimos el HTML a la lista de productos
    }
});

async function showProducts() {
    try {
        let array = await getProducts();
        let htmlContentToAppend = "";


        let filteredArray = array.slice(); // Array inicial sin filtrar

        document.getElementById("sortAsc").addEventListener("click", function () {
            // Ordena el array por precio de forma ascendente
            filteredArray = array.slice().sort((a, b) => a.cost - b.cost);
            renderProducts(filteredArray);
        });

        document.getElementById("sortDesc").addEventListener("click", function () {
            // Ordena el array por precio de forma descendente
            filteredArray = array.slice().sort((a, b) => b.cost - a.cost);
            renderProducts(filteredArray);
        });

        document.getElementById("sortByCount").addEventListener("click", function () {
            // Sin filtro, se usa el array original
            filteredArray = array.slice().sort((a, b) => b.soldCount - a.soldCount);
            renderProducts(filteredArray);
        });

        // Función para renderizar los productos en el HTML
        function renderProducts(products) {
            htmlContentToAppend = "";

            document.getElementById("cat-name").innerHTML = catName;

            for (let i = 0; i < products.length; i++) {
                let category = products[i];
                htmlContentToAppend += generateHTML(category.id, category.image, category.name, category.currency, category.cost, category.description, category.soldCount);
            }
            list.innerHTML = htmlContentToAppend;
        }

        // Muestra productos con el nuevo array filtrado
        renderProducts(array);

    } catch (error) {
        console.error("Error al mostrar los productos:", error);
    }
}

document.getElementById("clearRangeFilter").addEventListener("click", function () { //Función que deshace los filtros aplicados y muestra el array original
    minPrice.value = "";
    maxPrice.value = "";

    showProducts(products);
});


search.addEventListener("input", function () { //Funcionalidad para la barra de 
    const searchTerm = search.value.toLowerCase();
    for (const article of article_list) { //Con un for recorremos los productos
        //Obtenemos el título y descripción de cada producto
        const title = article.querySelector('h4').textContent.toLowerCase();
        const description = article.querySelector('p').textContent.toLowerCase();
        if (title.includes(searchTerm) || description.includes(searchTerm)) { //Verificamos si el nombre o descripción del producto coincide con la búsqueda
            article.style.display = 'block';
        } else { //Si coincide, mostramos el producto, y si no, lo ocultamos
            article.style.display = 'none';
        }
    }
});

showProducts();



