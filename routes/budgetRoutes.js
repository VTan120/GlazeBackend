const express = require("express");
const { validateTokenBearer, adminAuthorize, authorizeRoles } = require("../config/validateTokenBearer");
const { createBudgetYear, addOrReplaceMonthlyBudget, getOneBudgetYearForStore, getAllBudgetYearsForStore } = require("../controllers/budgetController");

const budgetRouter =express.Router();
budgetRouter.post("/add_budget_year",validateTokenBearer, adminAuthorize,createBudgetYear);
budgetRouter.put("/set_monthly_budget",validateTokenBearer, authorizeRoles("admin","super_admin","store_manager","sales_manager"),addOrReplaceMonthlyBudget);
budgetRouter.get("/get_one_budget_year/:storeId/:year",validateTokenBearer,authorizeRoles("admin","super_admin","store_manager","sales_manager"),getOneBudgetYearForStore);
budgetRouter.get("/get_all_budget_years/:storeId",validateTokenBearer,authorizeRoles("admin","super_admin","store_manager","sales_manager"),getAllBudgetYearsForStore);

module.exports = {budgetRouter};