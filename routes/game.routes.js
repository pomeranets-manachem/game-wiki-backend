const router = require("express").Router();
const Game = require("../models/Game.model");
const Category = require("../models/Category.model")
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
      if (categories) {
        categories.map((categoryId) => {
          Category.findOne({ "_id": categoryId })
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
      res.status(500).json({ message: err.message });
      console.log(err);
    });
});

//GET /api/gamesWithCategories
router.get("/gamesWithCategories", async (req, res) => {
  try {
    const gamesWithCategories = await Game.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: 'games',
          as: 'categories',
        },
      },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          // include other game properties as needed
          informations: { $first: '$informations' },
          imageURL: { $first: '$imageURL' },
          categories: { $push: '$categories' },
        },
      },
    ]);

    res.json(gamesWithCategories);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving games' });
  }
});

//GET /api/games
router.get("/games", (req, res) => {
  Game.find({})
    .then((games) => {
      res.status(200).json(games);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
      console.log(err);
    });
});

//GET /api/games/:gameId
router.get("/games/:gameId", (req, res) => {
  const { gameId } = req.params;
  Game.findOne({ "_id": gameId })
    .populate({ path: "comments.author", select: 'username' })
    .then((game) => {
      res.status(200).json(game);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
      console.log(err);
    });
});

//GET /api/games/:gameId/categories
router.get("/games/:gameId/categories", (req, res) => {
  const { gameId } = req.params;
  Game.findOne({ "_id": gameId })
    .populate({ path: "comments.author", select: 'username' })
    .then((game) => {
      Category.find({ "games": gameId })
        .then((categories) => {
          res.status(200).json({ game, categories });
        })
        .catch((err) => {
          res.status(500).json({ message: err.message });
          console.log(err);
        });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
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

  Game.findByIdAndUpdate(gameId, updatedGame, { new: true })
    .then((updatedGame) => {
      //we filter previousCategories to keep only those wich are not on updatedCategories = removed ones
      previousCategories.filter(cat => !updatedCategories.includes(cat))
        .map(removedCategory => {
          Category.findOne({ "_id": removedCategory })
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
        .map(addedCategory => {
          Category.findOne({ "_id": addedCategory })
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
      res.status(500).json({ message: err.message });
      console.log(err);
    });
});

//POST /api/games/:gameId/comments
router.post("/games/:gameId/comments", (req, res, next) => {
  const { gameId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(gameId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  const { newComment } = req.body;

  Game.findOne({ "_id": gameId })
    .then((gameDetails) => {
      if (gameDetails.comments) {
        gameDetails.comments.push(newComment);
        Game.findByIdAndUpdate(gameId, { $push: { comments: newComment } }, { new: true })
          .then((gameDetails) => {
            console.log("comment added to Game !");
            res.status(201).json(gameDetails);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        gameDetails.comments = [newComment]
        Game.findByIdAndUpdate(gameId, { $push: { comments: newComment } }, { new: true })
          .then((gameDetails) => {
            console.log("First comment added to Game !")
            res.status(201).json(gameDetails);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
})

//PUT /api/games/:gameId/comments/:commentId
router.put("/games/:gameId/comments/:commentId", (req, res, next) => {
  const { gameId, commentId } = req.params;


  if (!mongoose.Types.ObjectId.isValid(gameId) || !mongoose.Types.ObjectId.isValid(commentId)) {
    res.status(400).json({ message: "Specified ids are not valid" });
    return;
  }

  const { updatedComment } = req.body;

  Game.findOne({ "_id": gameId })
    .then((gameDetails) => {
      gameDetails.comments.map((comment) => {
        if (comment._id == commentId) {
          comment.comment = updatedComment;
          return comment;
        } else {
          return comment;
        }
      })
      Game.findByIdAndUpdate(gameId, gameDetails, { new: true })
        .then((gameDetails) => {
          console.log("comment updated to Game !");
          res.status(200).json(gameDetails);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
})

//DELETE /api/games/:gameId/comments/:commentId
router.delete("/games/:gameId/comments/:commentId", (req, res, next) => {
  const { gameId, commentId } = req.params;

  Game.findOne({ "_id": gameId })
    .then(gameDetails => {
      const newComArr = gameDetails.comments.filter(comment => comment._id != commentId)
      gameDetails.comments = newComArr;
      Game.findByIdAndUpdate(gameId, gameDetails, { new: true })
        .then(gameDetails => {
          console.log("comment deleted to Game !");
          res.status(200).json(gameDetails);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });

})

//DELETE /api/games/:gameId
router.delete("/games/:gameId", (req, res, next) => {
  const { gameId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(gameId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Game.findByIdAndDelete(gameId)
    .then(() => {
      Category.find({ "games": gameId })
        .then((categories) => {
          categories.map((category => {
            const newCatArr = category.games.filter(game => game._id != gameId)
            category.games = newCatArr;
            Category.findByIdAndUpdate(category._id, category)
              .then(() => console.log("cat updated by removing the game"))
              .catch((err) => {
                console.log(err);
              });
          }))

        })
      res.status(200).json({ message: "Game successfully removed !" });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
      console.log(err);
    });
});


module.exports = router;