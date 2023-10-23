const express = require("express");
const { validateTokenBearer, adminAuthorize, authorizeRoles } = require("../config/validateTokenBearer");
const { createSalesYear, addOrReplaceProductInMonth, removeProductFromMonth, getAllSalesYearsForStore, getOneSalesYearForStore, updateProductsInMonth } = require("../controllers/salesController");

const salesRouter =express.Router();
//To create tracking
salesRouter.post("/add_sales_year",validateTokenBearer, adminAuthorize, createSalesYear);
salesRouter.put("/set_monthly_sales",validateTokenBearer,authorizeRoles("admin","super_admin","store_manager","sales_manager"),updateProductsInMonth);
salesRouter.put("/remove_sales_product",validateTokenBearer,authorizeRoles("admin","super_admin","store_manager","sales_manager"),removeProductFromMonth);
salesRouter.get("/get_one_sales_year/:storeId/:year",validateTokenBearer,authorizeRoles("admin","super_admin","store_manager","sales_manager"),getOneSalesYearForStore);
salesRouter.get("/get_all_sales_years/:storeId",validateTokenBearer,authorizeRoles("admin","super_admin","store_manager","sales_manager"),getAllSalesYearsForStore);

module.exports = {salesRouter};