const { Schema, model, default: mongoose } = require("mongoose");

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      unique: true
    },
    description : {
        type : String
    },
    games : [{ type : mongoose.Schema.Types.ObjectId, ref: "Game" }]
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Category = model("Category", categorySchema);

module.exports = Category;
