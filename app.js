const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejs = require("ejs");
const ejsMate = require("ejs-mate");

const Listing = require("./models/listing");

const port = 8080;

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);


app.listen(port, () => {

    console.log(`App listening on port ${port}`);
})

// GET requests

app.get("/", (req, res) => {

    res.send(`I am on root`);
})

app.get("/listings", async (req, res) => {

    let listings = await Listing.find();

    res.render("listings/index.ejs", {listings});
})

app.get("/listings/new", (req, res) => {

    res.render("listings/new.ejs");
})

app.get("/listings/:id", async (req, res) => {

    let {id} = req.params;

    const listing = await Listing.findById(id);

    res.render("listings/show.ejs", {listing});
})

app.get("/listings/:id/edit", async (req, res) => {

    let {id} = req.params;

    let listing = await Listing.findById(id);

    res.render("listings/edit.ejs", {listing});
})


// POST requests

app.post("/listings", async (req, res) => {

    let newListing = new Listing(req.body.listing);
    let savedNewListing = await newListing.save();

    res.redirect(`/listings/${savedNewListing._id}`);
})


// PUT requests

app.put("/listings/:id", async (req, res) => {

    let {id} = req.params;

    await Listing.findByIdAndUpdate(id, {...req.body.listing}, {

        runValidators: true
    })

    res.redirect(`/listings/${id}`);
})


// DELETE requests

app.delete("/listings/:id", async (req, res) => {

    let {id} = req.params;

    await Listing.findByIdAndDelete(id);

    res.redirect("/listings");
})


//////////////





app.get("/test-listing", (req, res) => {

    let sampleListing = new Listing({

        title: "House",
        description: "This is my new beautiful house",
        price: 10000,
        location: "Service Road North, I-11/2, Islamabad",
        country: "Pakistan"
    })

    sampleListing.save();

    res.send(`Warning: Sample data is stored DON'T REFRESH BEFORE CHANGING SAMPLE DATA`);
})