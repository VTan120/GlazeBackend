const asyncHandler = require("express-async-handler");
const Sales = require("../models/salesTargetModel");
const Product = require("../models/productModel");

const createSalesYear = asyncHandler(async (req, res) => {
  const { storeId } = req.body;

  if(!storeId ){
    res.status(402);
    throw new Error("All Fields Are Mandatory");
  }

  try {
    // Check if a document with the same storeId and year already exists
    const existingYear = await Sales.find({storeId}).sort({year:-1}).select("year");

    console.log(existingYear);

    var year;

    if (existingYear.length === 0) {
      const currentDate = new Date();
      year = currentDate.getFullYear();
    }
    else {
      year = existingYear[0].year +1;
    }

    // Create a new year document
    const newYear = new Sales({ storeId, year, months: [] });

    // Add all 12 months to the new year
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
  
      monthNames.forEach(monthName => {
        newYear.months.push({
          monthName,
          products: [] // Initialize each month with an empty array of products
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

const addMonthToYear = asyncHandler(async (req, res) => {
    const { storeId, year, monthName } = req.body;
  
    try {
      // Find the year document with the specified storeId and year
      const yearDocument = await Sales.findOne({ storeId, 'year': year });
  
      if (!yearDocument) {
        res.status(404);
        throw new Error("Year doesnt exists for this store");
      }
  
      // Check if the month with the same name already exists
      const existingMonth = yearDocument.months.find(month => month.monthName === monthName);
  
      if (existingMonth) {
        res.status(402);
        throw new Error("Month already exists for this year");
      }
  
      // Create a new month object
      const newMonth = {
        monthName,
        products: []
      };
  
      // Add the new month to the year document
      yearDocument.months.push(newMonth);
  
      // Save the updated year document
      await yearDocument.save();
  
      res.status(201).json({ message: 'Month added successfully', month: newMonth });
    } catch (error) {
        console.error(error);
        res.status(402);
        throw new Error("Internal Server Error");
    }
});

const addOrReplaceProductInMonth = asyncHandler(async (req, res) => {
    const { storeId, year, monthName, productName, quantity } = req.body;

    if(!storeId || !year || !monthName || !productName || !quantity){
        res.status(402);
        throw new Error("All Fields Are Mandatory");
      }
  
    try {
      // Find the year document with the specified storeId and year
      const yearDocument = await Sales.findOne({ storeId, 'year': year });
  
      if (!yearDocument) {
        res.status(402);
        throw new Error("Year not found");
      }
  
      // Find the month within the year document
      const month = yearDocument.months.find(month => month.monthName === monthName);
  
      // Check if the product with the same name already exists in the month
      const existingProductIndex = month.products.findIndex(product => product.name === productName);
  
      if (existingProductIndex !== -1) {
        // If the product exists, update its quantity
        month.products[existingProductIndex].quantity = quantity;
      } else {
        // If the product does not exist, add a new product
        month.products.push({ name: productName, quantity });
      }
  
      // Save the updated year document
      await yearDocument.save();
  
      res.status(200).json({ message: 'Product added or replaced successfully', product: { name: productName, quantity } });
    } catch (error) {
      console.error(error);
      res.status(500);
      throw new Error("Internal Server Error");
    }
});

const updateProductsInMonth = asyncHandler(async (req, res) => {
  const { storeId, year, monthName, products } = req.body;

  if(!storeId || !year || !monthName || !products){
      res.status(402);
      throw new Error("All Fields Are Mandatory");
    }

  try {
    // Find the year document with the specified storeId and year
    var yearDocument = await Sales.findOne({ storeId, 'year': year });

    if (!yearDocument) {
      res.status(402);
      throw new Error("Year not found");
    }

    // Find the month within the year document
    var month = yearDocument.months.find(month => month.monthName === monthName);

    month.products = [];

    for( i in products){
      const r = await Product.findOne({name:products[i].name});
      if(!r){
          res.status(402)
          throw new Error(`Unknown Product ${products[i].name}`);
      }

      month.products.push({
          name:products[i].name,
          quantity:products[i].quantity,
      });
    }

    // Save the updated year document
    await yearDocument.save();

    res.status(200).json({ message: 'Sales Target Updated' });
  } catch (error) {
    console.error(error);
    res.status(500);
    throw new Error("Internal Server Error");
  }
});

const removeProductFromMonth = asyncHandler( async (req, res) => {
    const { storeId, year, monthName, productName } = req.body;

    if(!storeId || !year || !monthName || !productName){
        res.status(402);
        throw new Error("All Fields Are Mandatory");
      }
  
    try {
      // Find the year document with the specified storeId and year
      const yearDocument = await Sales.findOne({ storeId, 'year': year });
  
      if (!yearDocument) {
        res.status(500);
        throw new Error("Year Not Found");
      }
  
      // Find the month within the year document
      const month = yearDocument.months.find(month => month.monthName === monthName);
  
      if (!month) {
        res.status(500);
        throw new Error("Month not found for this year");
      }
  
      // Find the index of the product in the month's products array
      const productIndex = month.products.findIndex(product => product.name === productName);
  
      if (productIndex !== -1) {
        // If the product exists, remove it from the month's products array
        month.products.splice(productIndex, 1);
  
        // Save the updated year document
        await yearDocument.save();
  
        res.status(200).json({ message: 'Product removed successfully'});
      } else {
        res.status(500);
        throw new Error("Product not found in the specified month");
      }
    } catch (error) {
      console.error(error);
      res.status(500);
      throw new Error("Internal Server Error");
    }
});

const getAllSalesYearsForStore = asyncHandler(async (req, res) => {
    const { storeId } = req.params;
  
    try {
      // Find all year documents for the specified storeId
      const years = await Sales.find({ storeId });
  
      res.status(200).json({ years });
    } catch (error) {
      console.error(error);
      res.status(500);
      throw new Error("Internal Server Error");
    }
});
  

const getOneSalesYearForStore = asyncHandler(async (req, res) => {
    const { storeId, year } = req.params;
  
    try {
      // Find the year document with the specified storeId and year
      const yearDocument = await Sales.findOne({ storeId, 'year': year });
  
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
  
  
  

module.exports={createSalesYear, addOrReplaceProductInMonth, removeProductFromMonth, getAllSalesYearsForStore, getOneSalesYearForStore, updateProductsInMonth}
