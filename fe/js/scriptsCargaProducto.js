let btnFormCargaProducto = document.getElementById("btnVerPrevisualizacion");
let btnSubirFirebase = document.getElementById("btnAgregarProductoStock");
let nuevoProducto = {};

function capturarFormulario() {
  let nameProduct = document.getElementById("nombreProducto").value;
  let categoryProduct = document.getElementById("categoryForm");
  let valueCategory =
    categoryProduct.options[categoryProduct.selectedIndex].text;
  let imageProduct = document.getElementById("imageForm").value;
  let priceProduct = document.getElementById("precioForm").value;
  let stockProduct = document.getElementById("stockForm").value;
  let idDelProducto = Math.floor(
    Math.random() * (99999999999999999 - 1 + 1) + 1
  );
  let idString = idDelProducto.toString();

  nuevoProducto = {
    name: nameProduct,
    id: idString,
    category: valueCategory,
    price: priceProduct,
    stock: stockProduct,
    image: imageProduct,
  };
}
function previsualizarCargaProducto() {
  btnSubirFirebase.style.display = "flex";
  let containerPrevisualizacion = document.getElementById(
    "previsualizacionProducto"
  );
  let modelo = `
    <div class="card h-100 cardPre">
      <div class="badge bg-dark text-white position-absolute" style="top: 0.5rem; right: 0.5rem">
        Sale
      </div>
      <img
        class="card-img-top"
        src="${nuevoProducto.image}"
        alt="..."
      />
      <div class="card-body p-4">
        <div class="text-center">
          <h5 class="fw-bolder">${nuevoProducto.name}</h5>
          $${nuevoProducto.price}
          <input id="inputCardProduct" class="inputCardProduct" type="number" value="1">
        </div>
      </div>
      <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
        <div class="text-center">
        <button  class="btn btn-outline-dark mt-auto">Comprar</button>
        </div>
      </div>
    </div>
 
  `;
  containerPrevisualizacion.innerHTML = modelo;
}
const subiendoAFire = btnSubirFirebase.addEventListener("click", (e) => {
  e.preventDefault();
  subirAFirebase();
});

async function subirAFirebase() {
  let producto = nuevoProducto;
  const modeloProducto = await (
    await fetch("/api/subirfirestore", {
      method: "post",
      body: JSON.stringify(producto),
      headers: {
        "Content-Type": "application/json",
      },
    })
  ).json();
}

const cargaProducto = btnFormCargaProducto.addEventListener("click", (e) => {
  e.preventDefault();
  capturarFormulario();
  previsualizarCargaProducto();
  console.log(nuevoProducto);
});
