const { Schema, model, default: mongoose } = require("mongoose");

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
        type : String,
        default : "https://static-00.iconduck.com/assets.00/no-image-icon-1024x1024-xg55mf9k.png"
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Game = model("Game", gameSchema);

module.exports = Game;
