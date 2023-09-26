const express = require("express");
const { validateTokenBearer, authorizeRoles } = require("../config/validateTokenBearer");
const { createNewProduct, editProduct, getProduct, getAllProducts, deleteProduct, getIngredients } = require("../controllers/productController");

const productRouter = express.Router();

productRouter.post("/add_product", validateTokenBearer, authorizeRoles("super_admin", "admin","chef"), createNewProduct);
productRouter.put("/edit_product", validateTokenBearer, authorizeRoles("super_admin", "admin","chef"), editProduct);
productRouter.get("/get_product/:name", validateTokenBearer, authorizeRoles("super_admin", "admin","chef"), getProduct);
productRouter.get("/get_all_products", validateTokenBearer, authorizeRoles("super_admin", "admin","chef"), getAllProducts);
productRouter.get("/get_ingredients", validateTokenBearer, authorizeRoles("super_admin", "admin","chef"), getIngredients);
productRouter.put("/delete_product", validateTokenBearer, authorizeRoles("super_admin", "admin","chef"), deleteProduct);


module.exports = { productRouter };