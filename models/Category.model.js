const { Schema, model, default: mongoose } = require("mongoose");

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      unique: true
    },
    description : {
        type : String,
        required : true
    },
    imageURL : {
        type : String,
        default : "https://static-00.iconduck.com/assets.00/no-image-icon-1024x1024-xg55mf9k.png"
    },
    games : [{ type : ObjectId, ref: "Game" }]
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Category = model("Category", categorySchema);

module.exports = Category;
