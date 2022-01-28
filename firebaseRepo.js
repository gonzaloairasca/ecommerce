const {
  initializeApp,
  applicationDefault,
  cert,
} = require("firebase-admin/app");

const serviceAccount = require("./firebase-credentials.json");

const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");

initializeApp({
  credential: cert(serviceAccount),
  databaseURL: "",
});

const db = getFirestore();

async function agregarDatos(productoASubir) {
  console.log(productoASubir.id);

  const docRef = db.collection("products").doc(productoASubir.id);

  await docRef.set(productoASubir);
}

async function leerDatosPorCategoria() {
  const productsRef = db.collection("products");
  const snapshot = await productsRef.where("category", "==", "ropa").get();

  if (snapshot.empty) {
    console.log("No matching documents.");
    return;
  }
  const ropa = [];
  snapshot.forEach((doc) => {
    ropa.push(doc.data());
  });
  return ropa;
}

async function readProducts() {
  const productsRef = db.collection("products");
  const snapshot = await productsRef.get();
  const products = [];

  snapshot.forEach((doc) => {
    products.push(doc.data());
  });
  return products;
}

// leerDatosPorCategoria();

module.exports = {
  readProducts,
  leerDatosPorCategoria,
  agregarDatos,
};
