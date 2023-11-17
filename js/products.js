const ORDER_ASC_BY_COST = "AscCost";
const ORDER_DESC_BY_COST = "DescCost";
const ORDER_BY_SOLD_COUNT = "Cant.";
const minPrice = document.getElementById("rangeFilterCostMin");
const maxPrice = document.getElementById("rangeFilterCostMax");
let currentProductsArray = [];
let currentSortCriteria = undefined;
let minCount = undefined;
let maxCount = undefined;

//Función para ordenar los productos dependiendo de la criteria dada
function sortProducts(criteria, array) {
    let result = [];
    if (criteria === ORDER_ASC_BY_COST) {
        result = array.sort(function (a, b) {
            if (a.cost < b.cost) { return -1; }
            if (a.cost > b.cost) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_DESC_BY_COST) {
        result = array.sort(function (a, b) {
            if (a.cost > b.cost) { return -1; }
            if (a.cost < b.cost) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_BY_SOLD_COUNT) {
        result = array.sort(function (a, b) {
            let aCount = parseInt(a.soldCount);
            let bCount = parseInt(b.soldCount);

            if (aCount > bCount) { return -1; }
            if (aCount < bCount) { return 1; }
            return 0;
        });
    }
    return result;
}

function setProdID(id) { //Función que almacena el valor del id de un producto y redirige a product-info
    localStorage.setItem("prodID", id);
    window.location = "product-info.html"
}

function showProducts(){
    let htmlContentToAppend = "";
    for (let i = 0; i < currentProductsArray.length; i++) {
        let prod = currentProductsArray[i]; 
        //Si se indicó un rango de precio, se filtran los productos dentro de ese rango
        if (((minCount == undefined) || (minCount != undefined && parseInt(prod.cost) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(prod.cost) <= maxCount))) {
            htmlContentToAppend +=  `
            <div onclick="setProdID(${prod.id})" class="list-group-item list-group-item-action"> 
                <div class="row">
                    <div class="col-3">
                        <img src="` + prod.image + `" alt="product image" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <div class="mb-1">
                                <h4>`+ prod.name + " - " + prod.currency + " <span>" + prod.cost + `</span></h4> 
                                <p> `+ prod.description + `</p> 
                            </div>
                            <small class="text-muted">` + prod.soldCount + ` vendidos </small> 
                        </div>
                    </div>
                </div>
            </div>`; 
        }
        document.getElementById("list").innerHTML = htmlContentToAppend;
    }
}

function sortAndShowProducts(sortCriteria, productsArray){
    currentSortCriteria = sortCriteria;

    if (productsArray != undefined) {
        currentProductsArray = productsArray;
    }

    currentProductsArray = sortProducts(currentSortCriteria, currentProductsArray);

    //Muestra los productos ordenados
    showProducts();
}

document.addEventListener("DOMContentLoaded", function (e) {
    const catID = localStorage.getItem('catID')
    getJSONData(BASE_URL + CATEGORIES_URL + catID).then(function (resultObj) {
        if (resultObj.status === "ok") {
            document.getElementById("cat-name").innerHTML = resultObj.data.catName;
            currentProductsArray = resultObj.data.products;
            showProducts();
        }
    });

    document.getElementById("product-search").addEventListener("input", function () { //Funcionalidad para la barra de 
        const article_list = document.getElementsByClassName("list-group-item");
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

    document.getElementById("sortAsc").addEventListener("click", function () {
        sortAndShowProducts(ORDER_ASC_BY_COST);
    });

    document.getElementById("sortDesc").addEventListener("click", function () {
        sortAndShowProducts(ORDER_DESC_BY_COST);
    });

    document.getElementById("sortByCount").addEventListener("click", function () {
        sortAndShowProducts(ORDER_BY_SOLD_COUNT);
    });

    document.getElementById("clearRangeFilter").addEventListener("click", function () {
        document.getElementById("rangeFilterCostMin").value = "";
        document.getElementById("rangeFilterCostMax").value = "";

        minCount = undefined;
        maxCount = undefined;

        showProducts();
    });

    document.getElementById("rangeFilterCost").addEventListener("click", function () {
        //Obtengo el mínimo y máximo de los intervalos para filtrar por costo
        //de los productos.
        minCount = document.getElementById("rangeFilterCostMin").value;
        maxCount = document.getElementById("rangeFilterCostMax").value;

        if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0) {
            minCount = parseInt(minCount);
        }
        else {
            minCount = undefined;
        }

        if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0) {
            maxCount = parseInt(maxCount);
        }
        else {
            maxCount = undefined;
        }

        showProducts();
    });

});


