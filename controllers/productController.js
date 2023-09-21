const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const RawMaterial = require("../models/rawMaterialModel");



//@desc Add new Recipie/Product
//@route POST /api/products/add_product
//@access Private
const createNewProduct = asyncHandler( async (req,res) => {
    const {name, recipe, chef} = req.body;
    //checking if all values are inserted
    if(!name || !recipe || !chef ){
        res.status(402);
        throw new Error("All Fields Are Mandatory");
    }

    //Checking duplicate materials
    const existingProduct = await  Product.findOne({name:name.toLowerCase()});
    if(existingProduct){
        res.status(402);
        throw new Error("Product Alteady Added");
    }

    //Create and save new raw material
    try {
        const newMaterial = new Product({
            name:name.toLowerCase(),
            recipe:recipe,
            chef:chef
        })
        await newMaterial.save();
        const products = await Product.find();
        res.status(200).json(products)
    } catch (error) {
        res.status(500);
        throw new Error("Internal Server Error");
    }
})

//@desc Edit Recipie/Product
//@route PUT /api/products/add_product
//@access Private
const editProduct = asyncHandler( async (req,res) => {
    const {id, name, recipe, chef} = req.body;
    //checking if all values are inserted
    if(!id || !name || !recipe || !chef ){
        res.status(402);
        throw new Error("All Fields Are Mandatory");
    }

    //Checking duplicate materials
    

    //Create and save new raw material
    try {
        const updatedDocument = await  Product.findByIdAndUpdate(id, {name:name.toLowerCase(), recipe, chef}, {new:true});
        if (!updatedDocument) {
          return res.status(404).json({ message: 'Document not found' });
        }

        const products = await Product.find();
        res.status(200).json(products)
      } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }

})

//@desc Delete Recipies/Products
//@route DELETE /api/products/delete_product
//@access Private
const deleteProduct = asyncHandler( async (req,res) => {
    const {_id} = req.body;

    if(!_id){
        res.status(402);
        throw new Error("All Fields Are Mandatory");
    }

    try {
        const product = await Product.deleteOne({_id});
        if(!product){
            res.status(404);
            throw new Error("Product Not Found");
        }
        const products = await Product.find();
        res.status(200).json(products)
    } catch (error) {
        res.status(500);
        throw new Error("Internal Server Error");
    }
})

//@desc Get All Recipies/Products
//@route GET /api/products/get_all_products
//@access Private
const getAllProducts = asyncHandler( async (req,res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products)
    } catch (error) {
        res.status(500);
        throw new Error("Internal Server Error");
    }
})

//@desc Get Recipie/Product
//@route GET /api/products/get_product/:name
//@access Private
const getProduct = asyncHandler( async (req,res) => {
    const name = req.params["name"].toLowerCase()
    try {
        const product = await Product.findOne({name});
        res.status(200).json(product)
    } catch (error) {
        res.status(404);
        throw new Error("Product Not Found");
    }
})

//@desc Get Ingredients
//@route GET /api/products/ingredients
//@access Private
const getIngredients = asyncHandler( async (req,res) => {
    try {
        const ingredients = await RawMaterial.find({}).select("englishName hindiName");
        if(!ingredients){
            res.status(404);
            throw new Error("Product Not Found");
        }
        res.status(200).json(ingredients)
    } catch (error) {
        res.status(500);
        throw new Error("Internal Server Error");
    }
})

module.exports = {createNewProduct, getAllProducts, getProduct, deleteProduct, editProduct, getIngredients}