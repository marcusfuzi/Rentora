const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const dataDir = path.join(__dirname, "data");
const dataFile = path.join(dataDir, "products.json");

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, "[]");
}

function readProducts() {
    try {
        return JSON.parse(
            fs.readFileSync(dataFile, "utf8")
        );
    } catch (error) {
        return [];
    }
}

function saveProducts(products) {
    fs.writeFileSync(
        dataFile,
        JSON.stringify(products, null, 2)
    );
}


/* =========================
   GET ALL PRODUCTS
========================= */

app.get("/api/products", (req, res) => {

    const products = readProducts();

    res.json(products);

});


/* =========================
   SEARCH PRODUCTS
========================= */

app.get("/api/products/search", (req, res) => {

    const q = String(
        req.query.q || ""
    )
        .trim()
        .toLowerCase();

    if (!q) {
        return res.json([]);
    }

    const products = readProducts();

    const results = products.filter(product => {

        const searchableText = [

            product.name,
            product.brand,
            product.model,
            product.variant,
            product.category,
            product.condition,
            product.owner,
            product.location

        ]
            .join(" ")
            .toLowerCase();

        return searchableText.includes(q);

    });

    res.json(results);

});


/* =========================
   GET SINGLE PRODUCT
========================= */

app.get("/api/products/:id", (req, res) => {

    const products = readProducts();

    const product = products.find(
        item =>
            String(item.id) ===
            String(req.params.id)
    );

    if (!product) {

        return res.status(404).json({
            message: "Equipment not found."
        });

    }

    res.json(product);

});


/* =========================
   ADD PRODUCT
========================= */

app.post("/api/products", (req, res) => {

    const {

        name,
        brand,
        model,
        variant,
        category,
        condition,
        listingType,
        rentPrice,
        salePrice,
        deposit,
        owner,
        location,
        description,
        image

    } = req.body;


    /* REQUIRED FIELDS */

    if (
        !name ||
        !brand ||
        !model ||
        !variant ||
        !listingType ||
        !owner
    ) {

        return res.status(400).json({
            message:
                "Please fill all required fields."
        });

    }


    /* RENT OR SELL ONLY */

    if (
        listingType !== "rent" &&
        listingType !== "sell"
    ) {

        return res.status(400).json({
            message:
                "Listing type must be Rent or Sell."
        });

    }


    /* RENT VALIDATION */

    if (
        listingType === "rent" &&
        (!rentPrice ||
            Number(rentPrice) <= 0)
    ) {

        return res.status(400).json({
            message:
                "Please enter a valid rental price."
        });

    }


    /* SELL VALIDATION */

    if (
        listingType === "sell" &&
        (!salePrice ||
            Number(salePrice) <= 0)
    ) {

        return res.status(400).json({
            message:
                "Please enter a valid selling price."
        });

    }


    const products = readProducts();


    const newProduct = {

        id: Date.now(),

        name,
        brand,
        model,
        variant,

        category:
            category || "Other",

        condition:
            condition || "Used",

        /*
          ONLY ONE LISTING TYPE
          rent OR sell
        */

        listingType,

        rentPrice:
            listingType === "rent"
                ? Number(rentPrice)
                : null,

        salePrice:
            listingType === "sell"
                ? Number(salePrice)
                : null,

        deposit:
            listingType === "rent"
                ? Number(deposit || 0)
                : null,

        owner,

        location:
            location || "",

        description:
            description || "",

        image:
            image || "",

        verifiedSeller: true,

        externalPrices: [],

        createdAt:
            new Date().toISOString()

    };


    products.push(newProduct);

    saveProducts(products);


    res.status(201).json({

        message:
            "Equipment listed successfully!",

        product: newProduct

    });

});


/* =========================
   DELETE PRODUCT
========================= */

app.delete("/api/products/:id", (req, res) => {

    const products = readProducts();

    const filteredProducts =
        products.filter(
            product =>
                String(product.id) !==
                String(req.params.id)
        );


    if (
        filteredProducts.length ===
        products.length
    ) {

        return res.status(404).json({
            message:
                "Equipment not found."
        });

    }


    saveProducts(filteredProducts);


    res.json({
        message:
            "Equipment deleted successfully."
    });

});


/* =========================
   SERVER
========================= */

app.listen(PORT, () => {

    console.log("");
    console.log("================================");
    console.log("        RENTORA SERVER");
    console.log("================================");
    console.log(
        `Server running at http://localhost:${PORT}`
    );
    console.log("================================");
    console.log("");

});