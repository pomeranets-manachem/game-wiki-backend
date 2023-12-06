const router = require("express").Router();
const Category = require("../models/Category.model");
const mongoose = require("mongoose");

// POST /api/categories
router.post("/categories", (req, res, next) => {
    const {
      name,
      description,
      games,
      imageURL
    } = req.body;
  
    const newCategory = {
      name,
      description,
      games,
      imageURL
    };

  
    Category.create(newCategory)
      .then((newCategory) => {
        res.status(201).json(newCategory);
      })
      .catch((err) => {
        res.status(500).json({message : err.message});
        console.log(err);
      });
  });

//GET /api/categories
router.get("/categories", (req, res) => {
    Category.find({})
    .populate("games")
      .then((categories) => {
        res.status(200).json(categories);
      })
      .catch((err) => {
        res.status(500).json({message : err.message});
        console.log(err);
      });
  });

//GET /api/categories/:categoryId
router.get("/categories/:categoryId", (req, res) => {
    const {categoryId} = req.params;

    Category.find({"_id" : categoryId})
    .populate("games")
      .then((category) => {
        res.status(200).json(category);
      })
      .catch((err) => {
        res.status(500).json({message : err.message});
        console.log(err);
      });
  });

//PUT /api/categories/:categoryId
router.put("/categories/:categoryId", (req, res, next) => {
    const {categoryId} = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }
  
    const {
      name,
      description,
      games,
      imageURL
    } = req.body;
  
    const updatedCategory = {
      name,
      description,
      games,
      imageURL
    };
  
    Category.findByIdAndUpdate(categoryId, updatedCategory, {new : true})
      .then((updatedCategory) => {
        res.status(200).json(updatedCategory);
      })
      .catch((err) => {
        res.status(500).json({message : err.message});
        console.log(err);
      });
  });

//DELETE /api/categories/:categoryId
router.delete("/categories/:categoryId", (req, res, next) => {
    const { categoryId } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }
  
    Category.findByIdAndDelete(categoryId)
      .then(() => {
        res.status(200).json({ message : "Category successfully removed !" });
      })
      .catch((err) => {
        res.status(500).json({message : err.message});
        console.log(err);
      });
  });

  module.exports = router;