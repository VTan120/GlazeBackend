const express = require("express");
const { validateTokenBearer, adminAuthorize } = require("../config/validateTokenBearer");
const { createNewProduct, editProduct, getProduct, getAllProducts, deleteProduct, getIngredients } = require("../controllers/productController");

const productRouter = express.Router();

productRouter.post("/add_product", validateTokenBearer, adminAuthorize, createNewProduct);
productRouter.put("/edit_product", validateTokenBearer, adminAuthorize, editProduct);
productRouter.get("/get_product/:name", validateTokenBearer, adminAuthorize, getProduct);
productRouter.get("/get_all_products", validateTokenBearer, adminAuthorize, getAllProducts);
productRouter.get("/get_ingredients", validateTokenBearer, adminAuthorize, getIngredients);
productRouter.put("/delete_product", validateTokenBearer, adminAuthorize, deleteProduct);


module.exports = { productRouter };