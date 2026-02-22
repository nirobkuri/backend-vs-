const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    summary: { type: String, required: true, maxlength: 300 },
    image: { type: String, default: "" },
    category: {
      type: String,
      required: true,
      enum: ["Politics","Sports","Technology","Entertainment",
             "Business","Health","Science","World","Other"],
      default: "Other",
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    views: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

newsSchema.index({ title: "text", content: "text", summary: "text" });

module.exports = mongoose.model("News", newsSchema);