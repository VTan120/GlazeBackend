const express = require("express");
const connectionDB = require("./config/mongoDb");
const { userRouter } = require("./routes/userRoutes");
const dotenv = require("dotenv").config();
var cors = require('cors')

const app = express();

const server = app.listen(process.env.ACCESS_PORT, () => {
    console.log(`Server Running On Port: ${process.env.ACCESS_PORT}`);
})

connectionDB();


app.use(cors());

app.use(express.json());
app.use("/api/users/", userRouter);

//Handling Unhandled Prommise Rejection
process.on("unhandledRejection" , (err) => {
    console.log(`Unhandled Rejection: ${err.message}`);
    console.log("Shutting Down Server Due To Unhandled Prommise Rejection");

    server.close(() => {
        process.exit(1);
    });
});
