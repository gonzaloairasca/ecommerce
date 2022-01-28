const express = require("express");
const app = express();
const mercadopago = require("mercadopago");
const port = 3000;

app.use(express.json());

const firebaseRepo = require("./firebaseRepo");

let productsCopyCopy = [];

mercadopago.configure({
  access_token: "",
});

app.get("/api/products", async (req, res) => {
  res.send(await firebaseRepo.readProducts());
});
app.get("/api/ropa", async (req, res) => {
  res.send(await firebaseRepo.leerDatosPorCategoria());
});

app.post("/api/pay", async (req, res) => {
  const order = req.body;
  const ids = order.items.map((p) => p.id);
  const productsCopy = await repository.read();
  productsCopyCopy = productsCopy.map((p) => ({ ...p }));
  let preference = {
    items: [],
    back_urls: {
      success: "http://localhost:3000/feedback",
      failure: "http://localhost:3000/feedback",
      pending: "http://localhost:3000/feedback",
    },
    auto_return: "approved",
  };
  let error = false;
  ids.forEach((id) => {
    let product = productsCopy.find((p) => p.id === id);
    if (product.stock > 0) {
      product.stock--;
      preference.items.push({
        title: product.name,
        unit_price: +product.price,
        quantity: 1,
      });
    } else {
      error = true;
    }
  });
  if (error) {
    res.send("sin stock").statusCode(400);
  } else {
    const response = await mercadopago.preferences.create(preference);
    const preferenceId = response.body.id;
    await repository.write(productsCopy);
    order.date = new Date().toISOString();
    order.preferenceId = preferenceId;
    order.status = "pending";
    const orders = await repository.readOrders();
    orders.push(order);
    // await firebaseRepo.writeOrders(orders);
    res.send({ preferenceId });
  }
});

app.post("/api/subirfirestore", async (req, res) => {
  const productModel = req.body;
  await firebaseRepo.agregarDatos(productModel);
  res.send("llego la data");
});

app.get("/feedback", async (req, res) => {
  const payment = await mercadopago.payment.findById(req.query.payment_id);
  const merchantOrder = await mercadopago.merchant_orders.findById(
    payment.body.order.id
  );
  const preferenceId = merchantOrder.body.preference_id;
  const status = payment.body.status;
  // await repository.updateOrderByPreferenceId(preferenceId, status);
  // if (status === "rejected") {
  //   await repository.write(productsCopyCopy);
  // }
  console.log(productsCopyCopy);
  res.sendFile(require.resolve("./fe/index.html"));
});

app.use("/", express.static("fe"));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
