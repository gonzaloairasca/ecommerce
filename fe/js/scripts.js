let btnOrdenes = document.getElementById("btn-ordenes");

let productsList = [];
let carrito = [];
let total = 0;
let order = {
  items: [],
};

// agregar al carrito function

function mostrarVistaProducto() {
  let productId = localStorage.getItem(productId);
  const product = productsList.find((p) => p.id === productId);
  const sectionGeneral = document.getElementById("sectionGeneral");
  sectionGeneral.innerHTML = `
            <div class="container px-4 px-lg-5 my-5">
                <div class="row gx-4 gx-lg-5 align-items-center">
                    <div class="col-md-6"><img class="card-img-top mb-5 mb-md-0" src="${product.image}" alt="..." /></div>
                    <div class="col-md-6">
                        <div class="small mb-1">SKU: BST-498</div>
                        <h1 class="display-5 fw-bolder">${product.name}</h1>
                        <div class="fs-5 mb-5">
                            <span class="text-decoration-line-through">$45.00</span>
                            <span>${product.price}</span>
                        </div>
                        <p class="lead">Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium at dolorem quidem modi. Nam sequi consequatur obcaecati excepturi alias magni, accusamus eius blanditiis delectus ipsam minima ea iste laborum vero?</p>
                        <div class="d-flex">
                            <input class="form-control text-center me-3" id="inputQuantity" type="number" value="1" style="max-width: 3rem" />
                            <button  class="btn btn-outline-dark flex-shrink-0" type="button">
                                <i class="bi-cart-fill me-1"></i>
                                Agregar al carrito
                            </button>
                        </div>
                    </div>
                </div>
            </div>
  
  `;
}

function add(productId, price) {
  //esta parte encuentra el producto en la lista de productos(array) mediante el ID y lo nombra "product"
  const product = productsList.find((p) => p.id === productId);
  //Esto le resto 1 de stock al producto
  product.stock--;

  order.items.push(productsList.find((p) => p.id === productId));

  console.log(productId, price);

  //esto le suma un elemendo al carrito (array) segun el ID
  carrito.push(productId);

  //esto redefine la variable total y le suma: todo el que total ya tenia + el precio del nuevo producto
  total = total + price;
  console.log(carrito);
  console.log(order);

  displayProducts();
}

btnOrdenes.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("pepe");
  showOrder();
});

async function showOrder() {
  document.getElementById("page-content").style.display = "none";
  document.getElementById("order").style.display = "block";

  document.getElementById("order-total").innerHTML = `Total $${total}`;

  let productsHTML = "";
  order.items.forEach((p) => {
    productsHTML += `
    <tr>
    <td>1</th>
    <td><img src="${p.image}" class="imagen" alt="..." /> </td>
    <td>${p.name}</td>
    <td>$${p.price}</td>
  </tr>
    `;
  });
  document.getElementById("order-table").innerHTML = productsHTML;
}

let continuarCompraBtn = document.getElementById("continuarCompra");

continuarCompraBtn.addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("formCompra").style.display = "block";
  document.getElementById("btnConfPagar").style.display = "block";
  continuarCompraBtn.style.display = "none";
});

//funciona pagar (pay)
async function pay() {
  //le dice que intente algo...
  try {
    order.form = {
      nombre: document.getElementById("nameForm").value,
      email: document.getElementById("emailForm").value,
      tel: document.getElementById("telForm").value,
      pais: document.getElementById("paisForm").value,
      provincia: document.getElementById("provinciaForm").value,
      ciudad: document.getElementById("ciudadForm").value,
      direccion: document.getElementById("direccionForm").value,
      postal: document.getElementById("cpostalForm").value,
    };
    //este es el carrito que vamos a enviar al backend para descontar el stock
    const productsListCarrito = await (
      await fetch("api/pay", {
        method: "post",
        body: JSON.stringify(order),
        headers: {
          "Content-Type": "application/json",
        },
      })
    ).json();
    var script = document.createElement("script");
    // The source domain must be completed according to the site for which you are integrating.
    // For example: for Argentina ".com.ar" or for Brazil ".com.br".
    script.src =
      "https://www.mercadopago.com.ar/integrations/v1/web-payment-checkout.js";
    script.type = "text/javascript";
    script.dataset.preferenceId = productsListCarrito.preferenceId;
    document.getElementById("btnConfPagar").innerHTML = "";
    document.querySelector("#btnConfPagar").appendChild(script);
    //congelar form
    document.getElementById("nameForm").disabled = true;
    document.getElementById("emailForm").disabled = true;
    document.getElementById("telForm").disabled = true;
    document.getElementById("paisForm").disabled = true;
    document.getElementById("provinciaForm").disabled = true;
    document.getElementById("ciudadForm").disabled = true;
    document.getElementById("direccionForm").disabled = true;
    document.getElementById("cpostalForm").disabled = true;
  } catch {
    window.alert("sin stock");
  }
  carrito = [];
  total = 0;
  // await fetchProducts();
}
let confirmarCompraBtn = document.getElementById("confirmarCompra");

confirmarCompraBtn.addEventListener("click", (e) => {
  e.preventDefault();
  pay();
});

// let clickiada = `onclick="mostrarVistaProducto(${product.id}, ${product.price})"`

function displayProducts() {
  document.getElementById("page-content").style.display = "flex";
  document.getElementById("order").style.display = "none";
  //asina la variable que va a ser modelo para el html
  let productsHTML = "";
  //toma variable global product list y por cada uno de los product declara
  productsList.forEach((product) => {
    //asigna a la variable btnComprar un btn html standard funcionando
    let btnComprar = `<button onclick="vistaProducto(${product.id}, ${product.price})" class="btn btn-outline-dark mt-auto">Ver producto</button>`;
    let id = product.id;
    //condicion: si el producto tiene stock <= 0, entonces se reasigna la variable btnComprar desactivandose el boton.
    if (product.stock <= 0) {
      btnComprar = `<button
                  disabled
                  onclick="mostrarVistaProducto(${id}, ${product.price})"
                  class="btn btn-outline-dark mt-auto"
                  href="#"
                  >
                  Sin Stock
                  </button>`;
    }
    //se asigna a products HTML el card correspondiente al producto.
    productsHTML += `
    <div class="col mb-5">
      <div class="card h-100">
        
        <div
          class="badge bg-dark text-white position-absolute"
          style="top: 0.5rem; right: 0.5rem"
        >
          Sale
        </div>
        <img
          class="card-img-top"
          src="${product.image}"
          alt="..."
        />
        <div class="card-body p-4">
          <div class="text-center">
            <h5 class="fw-bolder">${product.name}</h5>
            <span class="text-muted text-decoration-line-through"
              >$50.00</span
            >
            $${product.price}
            <input id="inputCardProduct" class="inputCardProduct" type="number" value="1">
          </div>
        </div>
        <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
          <div class="text-center">
            ${btnComprar}
          </div>
        </div>
      </div>
    </div>`;
  });

  //inserta la lista de productos ya transformada a html, al documento html
  document.getElementById("page-content").innerHTML = productsHTML;
}

function vistaProducto(productId, price) {
  localStorage.setItem("productId", productId);
  localStorage.setItem("price", price);
  location.href = "vista-producto.html";
  console.log(productId);
}

//esta funcion asigna a la variable global productList  la respuesta del fetch a "api/products"

async function fetchProducts() {
  productsList = await (await fetch("/api/products")).json();

  displayProducts();
  console.log(productsList);
}

//asigna que en el window.onload se ejecute la funcion fetchProducts.
window.onload = async () => {
  await fetchProducts();
};
