const express = require("express");
const bodyParser = require('body-parser');
const connectionDB = require("./config/mongoDb");
const { userRouter } = require("./routes/userRoutes");
const { rawMaterialRouter } = require("./routes/rawMaterialRoutes");
const dotenv = require("dotenv").config();
var cors = require('cors');
const adminRouter = require("./routes/adminRoutes");
const superAdminRouter = require("./routes/superAdminRoutes");
const errorHandler = require("./middleware/errorHandler");
const { trackingRouter } = require("./routes/trackingRoutes");
const { productRouter } = require("./routes/productRoutes");
const { storeRouter } = require("./routes/storeRoutes");
const { orderRouter } = require("./routes/orderRoutes");
const { budgetRouter } = require("./routes/budgetRoutes");
const { salesRouter } = require("./routes/salesRoutes");
const { packetRouter } = require("./routes/packetRoutes");
const { manufactureRouter } = require("./routes/manufacturingRoutes");
const { posRouter } = require("./routes/posRoutes");
const { rawMaterialInventoryRouter } = require("./routes/rawMaterialInventoryRoutes");

const app = express();



connectionDB();
// app.options('http://127.0.0.1:5001', cors())

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Headers', 'Set-Cookie')
//     res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:3000");
//     res.setHeader("Content-Type", "Accept");
//     res.header('Access-Control-Allow-Credentials', 'true');
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//     res.header('SameSite', 'none');
//     // res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   })

// app.options("/*", function(req, res, next){
//   // res.header('Access-Control-Allow-Origin', "http://localhost:3000");
//     res.header('Access-Control-Allow-Origin', "*");
//     // res.header('Access-Control-Allow-Credentials', 'true');
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//     res.header("Content-Type","application/json");
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Access-Control-Allow-Credentials');
//     res.sendStatus(200);
//   });

// app.use(cors(
//     {
//         origin: ['http://localhost:3000', 'https://www.google.com/', "http://127.0.0.1:3000"],
//         credentials: true
//     }
// ));

// const corsConfig = {
//     origin: ['http://localhost:3000', 'https://www.google.com/', "http://127.0.0.1:3000","http://127.0.0.2:3000", "*"],
//     // credentials: true,
//     optionsSuccessStatus: 200
//   };
  
  app.use(cors());
  // app.options('*', cors(corsConfig));

app.use(express.json());
app.use("/api/users/", userRouter);
app.use("/api/admin/", adminRouter);
app.use("/api/super_admin/", superAdminRouter);
app.use("/api/raw_materials/", rawMaterialRouter);
app.use("/api/products/", productRouter);
app.use("/api/tracking/",trackingRouter);
app.use("/api/stores/",storeRouter);
app.use("/api/orders/",orderRouter);
app.use("/api/sales/",salesRouter);
app.use("/api/budget/",budgetRouter);
app.use("/api/packets/",packetRouter);
app.use("/api/manufacture/",manufactureRouter);
app.use("/api/pos/",posRouter);
app.use("/api/raw_material_inventory/",rawMaterialInventoryRouter);

app.use(errorHandler)

const server = app.listen(process.env.ACCESS_PORT, () => {
    console.log(`Server Running On Port: ${process.env.ACCESS_PORT}`);
})
//Handling Unhandled Prommise Rejection
process.on("unhandledRejection" , (err) => {
    console.log(`Unhandled Rejection: ${err.message}`);
    console.log("Shutting Down Server Due To Unhandled Prommise Rejection");

    server.close(() => {
        process.exit(1);
    });
});
