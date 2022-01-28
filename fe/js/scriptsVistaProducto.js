let productsList = [];
let ropa = [];

async function mostrarVistaProducto() {
  let productId = localStorage.getItem("productId");
  const product = await productsList.find((p) => p.id === productId);
  const sectionGeneral = document.getElementById("sectionGeneral");
  let btnComprar = `<button  class="btn btn-outline-dark flex-shrink-0" type="button" onclick="add(${product.id},${product.price})">
                    <i class="bi-cart-fill me-1"></i>
                    Agregar al carrito
                    </button>`;

  if (product.stock <= 0) {
    btnComprar = `<button disabled class="btn btn-outline-dark flex-shrink-0" type="button" onclick="add(${product.id},${product.price})">
  <i class="bi-cart-fill me-1"></i>
  Sin Stock
</button>`;
  }

  sectionGeneral.innerHTML = `
              <div class="container px-4 px-lg-5 my-5">
                  <div class="row gx-4 gx-lg-5 align-items-center">
                      <div class="col-md-6"><img class="card-img-top mb-5 mb-md-0" src="${product.image}" alt="..." /></div>
                      <div class="col-md-6">
                          <div class="small mb-1">SKU: BST-498</div>
                          <h1 class="display-5 fw-bolder">${product.name}</h1>
                          <div class="fs-5 mb-5">
                              <span class="text-decoration-line-through">$45.00</span>
                              <span>$${product.price}</span>
                          </div>
                          <div class="d-flex">
                              <input class="form-control text-center me-3" id="inputQuantity" type="number" value="1" style="max-width: 4rem" />
                              ${btnComprar}
                          </div>
                      </div>
                  </div>
              </div>
    
    `;
  traerProductosPorCategory(product.category);
}

function add(productId, price) {
  console.log(productId, price);
}

async function traerProductosPorCategory(product) {
  const ropas = await productsList.filter(
    (producto) => producto.category === product
  );
  pintarProductosRelacionados(ropas);
}

function pintarProductosRelacionados(ropas) {
  let modeloCard = "";

  ropas.forEach((product) => {
    modeloCard += `
<div class="col mb-5">
<div class="card h-100">
  <!-- Product image-->
  <img class="card-img-top" src="${product.image}" alt="..."
  />
  <!-- Product details-->
  <div class="card-body p-4">
    <div class="text-center">
      <!-- Product name-->
      <h5 class="fw-bolder">${product.name}</h5>
      <!-- Product price-->
  ${product.price}
    </div>
  </div>
  <!-- Product actions-->
  <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
    <div class="text-center">
      <a class="btn btn-outline-dark mt-auto" href="#">View options</a>
    </div>
  </div>
</div>
</div>`;
  });
  document.getElementById("productosRelacionados").innerHTML = modeloCard;
}
async function fetchProducts() {
  productsList = await (await fetch("api/products")).json();
  mostrarVistaProducto();
}

async function fetchRopa() {
  ropa = await (await fetch("api/ropa")).json();
}

window.onload = () => {
  fetchProducts();
  fetchRopa();
};
