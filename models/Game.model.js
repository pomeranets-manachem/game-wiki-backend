const { Schema, model, default: mongoose } = require("mongoose");

const commentSchema = new Schema(
  { 
    comment : {
      type : String,
      required : [true, "You need to write something"]
    },
    author : {
      type : mongoose.Schema.Types.ObjectId,
       ref: "User"
    } 
  },
  {
    timestamps: true,
  }
);

const gameSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      unique: true
    },
    informations : {
        type : String,
        required : true
    },
    imageURL : {
        type : String
    },
    comments : [commentSchema]
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Game = model("Game", gameSchema);

module.exports = Game;
