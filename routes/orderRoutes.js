const express = require("express");
const { validateTokenBearer, authorizeRoles, adminAuthorize } = require("../config/validateTokenBearer");
const { createOrder, approveOrder, getOrdersInStore, getProducts, rejectOrder, deleteOrder, editOrder } = require("../controllers/orderController");

const orderRouter = express.Router();

orderRouter.get("/get_store_orders/:storeId", validateTokenBearer, authorizeRoles("super_admin","admin","store_manager"), getOrdersInStore);
orderRouter.get("/get_products_list", validateTokenBearer, authorizeRoles("super_admin","admin","store_manager"), getProducts);
orderRouter.post("/create_order", validateTokenBearer, authorizeRoles("super_admin","admin","store_manager"), createOrder);
orderRouter.put("/edit_order", validateTokenBearer, authorizeRoles("super_admin","admin","store_manager"), editOrder);
orderRouter.put("/order_approval", validateTokenBearer, adminAuthorize, approveOrder);
orderRouter.put("/order_reject", validateTokenBearer, adminAuthorize, rejectOrder);
orderRouter.put("/delete_order", validateTokenBearer, authorizeRoles("super_admin","admin","store_manager"), deleteOrder);

module.exports = { orderRouter };