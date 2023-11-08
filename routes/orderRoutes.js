const express = require("express");
const { validateTokenBearer, authorizeRoles, adminAuthorize } = require("../config/validateTokenBearer");
const { createOrder, approveOrder, getOrdersInStore, getProducts, rejectOrder, deleteOrder, editOrder, updateMaterialPrices, sendForBudgetApproval, getOrderBudgetDetails, uploadInvoiceImage, completeOrder, getCompletedOrdersInStore } = require("../controllers/orderController");
const { imageUpload } = require("../config/imageUpload");
const multer = require('multer');
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


const orderRouter = express.Router();

orderRouter.get("/get_products_list", validateTokenBearer, authorizeRoles("super_admin","admin","store_manager"), getProducts);
orderRouter.get("/get_store_completed_orders", validateTokenBearer, authorizeRoles("super_admin","admin","store_manager"), getCompletedOrdersInStore);
orderRouter.get("/get_order_budget_details/:orderId", validateTokenBearer, authorizeRoles("super_admin","admin","store_manager"), getOrderBudgetDetails);
orderRouter.get("/get_store_orders/:storeId", validateTokenBearer, authorizeRoles("super_admin","admin","store_manager"), getOrdersInStore);
orderRouter.post("/create_order", validateTokenBearer, authorizeRoles("super_admin","admin","store_manager"), createOrder);
orderRouter.post("/upload_invoice_image", validateTokenBearer, authorizeRoles("super_admin","admin","store_manager"), upload.single('image'), uploadInvoiceImage);
orderRouter.put("/edit_order", validateTokenBearer, authorizeRoles("super_admin","admin","store_manager"), editOrder);
orderRouter.put("/update_prices", validateTokenBearer, authorizeRoles("super_admin","admin","store_manager"), updateMaterialPrices);
orderRouter.put("/send_for_budget_approval", validateTokenBearer, authorizeRoles("super_admin","admin","store_manager"), sendForBudgetApproval);
orderRouter.put("/order_approval", validateTokenBearer, adminAuthorize, approveOrder);
orderRouter.put("/order_reject", validateTokenBearer, adminAuthorize, rejectOrder);
orderRouter.put("/complete_order", validateTokenBearer, authorizeRoles("super_admin","admin","store_manager"), completeOrder);
orderRouter.put("/delete_order", validateTokenBearer, authorizeRoles("super_admin","admin","store_manager"), deleteOrder);

module.exports = { orderRouter };