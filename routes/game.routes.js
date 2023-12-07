const router = require("express").Router();
const Game = require("../models/Game.model");
const Category = require ("../models/Category.model")
const mongoose = require("mongoose");

// POST /api/games
router.post("/games", (req, res, next) => {
    const {
      name,
      informations,
      imageURL,
      categories
    } = req.body;
  
    const newGame = {
      name,
      informations,
      imageURL
    };
  
    Game.create(newGame)
      .then((newGame) => {
        if(categories) {
          categories.map((categoryName) => {
            Category.findOne({"name" : categoryName})
            .then((categoryDetails) => {
               categoryDetails.games.push(newGame._id);
               Category.findByIdAndUpdate(categoryDetails._id, categoryDetails)
                 .then()
                 .catch((err) => {
                   console.log(err);
                 });
            })
            .catch((err) => {
             console.log(err);
           });
         })
        } else {

        }
        res.status(201).json(newGame);
      })
      .catch((err) => {
        res.status(500).json({message : err.message});
        console.log(err);
      });
  });

//GET /api/games
router.get("/games", (req, res) => {
  Game.find({})
    .then((games) => {
      res.status(200).json(games);
    })
    .catch((err) => {
      res.status(500).json({message : err.message});
      console.log(err);
    });
});

//GET /api/games/:gameId
router.get("/games/:gameId", (req, res) => {
  const {gameId} = req.params;
  Game.find({"_id" : gameId})
    .then((game) => {
      res.status(200).json(game);
    })
    .catch((err) => {
      res.status(500).json({message : err.message});
      console.log(err);
    });
});

//GET /api/games/:gameId/categories
router.get("/games/:gameId/categories", (req, res) => {
  const {gameId} = req.params;
  Game.findOne({"_id" : gameId})
    .then((game) => {
      Category.find({"games" : gameId})
      .then((categories) => {
        res.status(200).json({game,categories});
      })
      .catch((err) => {
        res.status(500).json({message : err.message});
        console.log(err);
      });
      })
    .catch((err) => {
      res.status(500).json({message : err.message});
      console.log(err);
    });
  
});

//PUT /api/games/:gameId
router.put("/games/:gameId", (req, res, next) => {
  const { gameId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(gameId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  const {
    name,
    informations,
    imageURL,
    previousCategories,
    updatedCategories
  } = req.body;

  const updatedGame = {
    name,
    informations,
    imageURL
  };

  Game.findByIdAndUpdate(gameId, updatedGame, {new : true})
    .then((updatedGame) => {
      //we filter previousCategories to keep only those wich are not on updatedCategories = removed ones
      previousCategories.filter(cat => !updatedCategories.includes(cat))
        .map( removedCategory => {
          Category.findOne({"_id" : removedCategory})
            .then((removedCategoryDetails) => {
              const newCatArr = removedCategoryDetails.games.filter(game => game._id != gameId)
              removedCategoryDetails.games = newCatArr;
              Category.findByIdAndUpdate(removedCategory, removedCategoryDetails)
                .then(() => console.log("cat updated by removing the game"))
                .catch((err) => {
                  console.log(err);
                });
            })
            .catch((err) => {
              console.log(err);
            });
        })

      //we filter updatedCategories to keep only those wich are not on previousCategories = added ones
      updatedCategories.filter(cat => !previousCategories.includes(cat))
        .map( addedCategory => {
          Category.findOne({"_id" : addedCategory})
            .then((categoryDetails) => {
              categoryDetails.games.push(gameId);
              Category.findByIdAndUpdate(categoryDetails._id, categoryDetails)
                .then(() => console.log("cat updated by adding the game !"))
                .catch((err) => {
                  console.log(err);
                });
            })
      })
      res.status(200).json(updatedGame);
    })
    .catch((err) => {
      res.status(500).json({message : err.message});
      console.log(err);
    });
});

//DELETE /api/games/:gameId
router.delete("/games/:gameId", (req, res, next) => {
  const { gameId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(gameId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Game.findByIdAndDelete(gameId)
    .then(() => {
      res.status(200).json({ message : "Game successfully removed !" });
    })
    .catch((err) => {
      res.status(500).json({message : err.message});
      console.log(err);
    });
});


  module.exports = router;