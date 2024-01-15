const port = process.env.PORT || 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { Console, log } = require("console");
require('dotenv').config();
const bcrypt = require("bcrypt");


const allowedOrigins = ['http://localhost:3000', 
 'http://localhost:5173','https://app.netlify.com/teams/nooranitehreen/overview'];

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); 
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});



//Database Connection With MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log("Connected to MongoDB");
 })
 .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
 });

//API Creation

app.get("/", (re, res) => {
    res.send("Express App is Running");
})

//Image Storage Engine

const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, 
});



//Creating Upload Endpoint for images
app.use('/images', express.static('upload/images'));

app.post("/upload", upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `/images/${req.file.filename}`
    });
});

//Schema for Creating Products

const Product = mongoose.model("Product", {
    id: {
        type: Number,
        require: true,
    },
    name: {
        type: String,
        require: true,
    },
    image: {
        type: String,
        require: true,
    },
    category: {
        type: String,
        require: true,
    },
    new_price: {
        type: Number,
        require: true,
    },
    old_price: {
        type: Number,
        require: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: true,
    },
});

app.post('/addproduct', async (req, res) => {
    let products = await Product.find({});
    let id;
    if(products.length > 0) {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id + 1;
    } else {
        id = 1;
    }
    const product = new Product({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
    });
    console.log(product);
    await product.save();
    console.log("Saved");
    res.json({
        success: true,
        name: req.body.name,
    });
});

//Creating API For deleting Products

app.post('/removeproduct', async (req, res) => {
    await Product.findOneAndDelete({id : req.body.id});
    console.log("Removed");
    res.json({
        success: true,
        name: req.body.name,
    })
});

//Creating API For Getting all products
app.get('/allproducts', async (req, res) => {
    let products = await Product.find({});
    console.log("All Products Fetched");
    res.send(products);
});

//Schema creating for User model

const Users = mongoose.model('Users', {
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    cartData: {
        type: Object,
    },
    role: {
        type: String, 
        default: 'user', 
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

//Creating Endpoint for registering the user
app.post('/signup', async (req, res) => {

    let check = await Users.findOne({email: req.body.email});
    if(check) {
        return res.status(400).json({successs: false, errors: "existing user found with same email address"})
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i] = 0;
        
    }

    const userCount = await Users.countDocuments();
    const role = userCount === 0 ? 'admin' : 'user';

    const user = new Users({
        name: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        cartData: cart,
        role: role,
    });

    await user.save();

    const data = {
        user: {
            id: user.id,
            role: user.role,
        }
    }

    const token = jwt.sign(data, process.env.JWT_SECRET);
    res.json({success: true, token})
});

//Creating endpoint for user login
app.post('/login', async (req, res) => {
    let user = await Users.findOne({email: req.body.email});
    if (user) {
        const passCompare = await bcrypt.compare(req.body.password, user.password);
        if (passCompare) {
            const data = {
                user: {
                    id: user.id,
                    role: user.role,
                }
            }
            const token = jwt.sign(data, process.env.JWT_SECRET);
            res.json({success: true, token});
        }
        else {
            res.json({success: false, errors: "Wrong Password"});
        }
    } else {
        res.json({success: false, errors: "Wrong Email Id"});
    }
});

//creating endpoint for newcollection data
app.get('/newcollections', async (req, res) => {
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("NewCollection Fetched");
    res.send(newcollection);
});

//Creating endpoint for popular in women section
app.get('/popularinwomen', async (req, res) => {
    let products = await Product.find({category: "women"});
    let popular_in_women = products.slice(0, 4);
    console.log("Popular in women fetched");
    res.send(popular_in_women);
});

//Creating middleware to fetch user
  const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    console.log("Received token:", token);
    if (!token) {
        res.status(401).send({errors: "Please authenticate using valid token"})
    } else {
        try {
           const data = jwt.verify(token, process.env.JWT_SECRET);
           req.user = data.user;
           console.log('User in fetchUser middleware:', req.user);
           next(); 
        } catch (error) {
            console.error('Token verification error:', error);
            res.status(401).send({errors: "please authenticate using a valid token"})
        }
    }
  };

// Extend fetchUser middleware to check user's role/permissions
const authorizeAdmin = (req, res, next) => {
    console.log('User in authorizeAdmin middleware:', req.user);
    if (req.user && req.user.role) {
        console.log("User is authorized as admin");
        next(); 
    } else {
        console.log("User is not authorized");
        res.status(401).send({ errors: "You are not authorized to perform this action" });
    }
};

//Creating endpoint for adding products in cartdata
app.post('/addtocart', fetchUser, authorizeAdmin, async (req, res) => {
    console.log("added", req.body.itemId);
    let userData = await Users.findOne({_id: req.user.id});
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({_id: req.user.id}, {cartData: userData.cartData});
    res.send({message: "Added"});
});

//Creating endpoint to remove product from cartdata
app.post('/removefromcart', fetchUser, authorizeAdmin, async (req, res) => {
    console.log("removed", req.body.itemId);
    let userData = await Users.findOne({_id: req.user.id});
    if (userData.cartData[req.body.itemId] > 0)
    userData.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate({_id: req.user.id}, {cartData: userData.cartData});
    res.send({message: "Removed"});
});

//Creating endpoint to get cartdata
app.post('/getcart', fetchUser, authorizeAdmin, async (req, res) => {
    console.log("GetCart");
    let userData = await Users.findOne({_id: req.user.id});
    res.json(userData.cartData);
});

app.listen(port,(error) => {
if (!error) {
    console.log("Server Running on Port "+port);
}
else{
    console.log("Error : "+error);
}
});