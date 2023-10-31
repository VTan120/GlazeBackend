const asyncHandler = require("express-async-handler");
const Budget = require("../models/budgetModel");

const createBudgetYear = asyncHandler(async (req, res) => {
  const { storeId } = req.body;

  if(!storeId ){
    res.status(402);
    throw new Error("All Fields Are Mandatory");
  }

  try {
    // Check if a document with the same storeId and year already exists
    const existingYear = await Budget.find({storeId}).sort({year:-1}).select("year");

    var year;

    if (existingYear.length === 0) {
      const currentDate = new Date();
      year = currentDate.getFullYear();
    }
    else {
      year = existingYear[0].year +1;
    }

    // Create a new year document
    const newYear = new Budget({ storeId, year, months: [] });

    // Add all 12 months to the new year
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
  
      monthNames.forEach(monthName => {
        newYear.months.push({
          monthName,
          monthlyBudget: 0 // Initialize each month with an empty array of products
        });
      });

    // Save the new year document to the database
    await newYear.save();

    res.status(201).json({ message: 'Year created successfully'});
  } catch (error) {
    console.error(error);
    res.status(500);
    throw new Error("Internal Server Error");
  }
});



const addOrReplaceMonthlyBudget = asyncHandler(async (req, res) => {
    const { storeId, year, monthName, monthlyBudget } = req.body;

    if(!storeId || !year || !monthName || !monthlyBudget){
        res.status(402);
        throw new Error("All Fields Are Mandatory");
      }
  
    try {
      // Find the year document with the specified storeId and year
      const yearDocument = await Budget.findOne({ storeId, 'year': year });
  
      if (!yearDocument) {
        res.status(402);
        throw new Error("Year not found");
      }
  
      // Find the month within the year document
      const month = yearDocument.months.find(month => month.monthName === monthName);
  
      // Check if the product with the same name already exists in the month
      month.monthlyBudget = monthlyBudget;

      month.employeeId = req.user["employeeId"];

      month.lastUpdate = new Date()
  
      // Save the updated year document
      await yearDocument.save();
  
      res.status(200).json({ message: 'Budget updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500);
      throw new Error("Internal Server Error");
    }
});

const getAllBudgetYearsForStore = asyncHandler(async (req, res) => {
  const { storeId } = req.params;

  try {
    // Find all year documents for the specified storeId
    const years = await Budget.find({ storeId });

    res.status(200).json({ years });
  } catch (error) {
    console.error(error);
    res.status(500);
    throw new Error("Internal Server Error");
  }
});


const getOneBudgetYearForStore = asyncHandler(async (req, res) => {
  const { storeId, year } = req.params;

  try {
    // Find the year document with the specified storeId and year
    const yearDocument = await Budget.findOne({ storeId, 'year': parseInt(year) });

    if (!yearDocument) {
      res.status(500);
      throw new Error("Year Doesnt Exist For The Store");
    }

    res.status(200).json({ year: yearDocument });
  } catch (error) {
    console.error(error);
    res.status(500);
    throw new Error("Internal Server Error");
  }
});

  
  

module.exports={createBudgetYear, addOrReplaceMonthlyBudget, getAllBudgetYearsForStore, getOneBudgetYearForStore}
