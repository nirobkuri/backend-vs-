const asyncHandler = require("express-async-handler");
const News = require("../models/News");

const getAllNews = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  let query = { isPublished: true };
  if (req.query.category) query.category = req.query.category;
  if (req.query.search) query.$text = { $search: req.query.search };
  const total = await News.countDocuments(query);
  const news = await News.find(query)
    .populate("author", "name avatar")
    .sort({ createdAt: -1 })
    .skip(skip).limit(limit);
  res.json({ news, page, pages: Math.ceil(total / limit), total });
});

const getTopNews = asyncHandler(async (req, res) => {
  const news = await News.find({ isPublished: true })
    .populate("author", "name avatar")
    .sort({ createdAt: -1 }).limit(6);
  res.json(news);
});

const getSingleNews = asyncHandler(async (req, res) => {
  const news = await News.findById(req.params.id).populate("author", "name avatar bio");
  if (!news) { res.status(404); throw new Error("News not found"); }
  news.views += 1;
  await news.save();
  res.json(news);
});

const createNews = asyncHandler(async (req, res) => {
  const { title, content, summary, category, tags } = req.body;
  if (!title || !content || !summary || !category) {
    res.status(400); throw new Error("Please fill all required fields");
  }
  const news = await News.create({
    title, content, summary, category,
    tags: tags ? tags.split(",").map((t) => t.trim()) : [],
    image: req.file ? req.file.path : "",
    author: req.user._id,
  });
  const populated = await news.populate("author", "name avatar");
  res.status(201).json(populated);
});

const updateNews = asyncHandler(async (req, res) => {
  const news = await News.findById(req.params.id);
  if (!news) { res.status(404); throw new Error("News not found"); }
  if (news.author.toString() !== req.user._id.toString()) {
    res.status(403); throw new Error("Not authorized");
  }
  const { title, content, summary, category, tags, isPublished } = req.body;
  news.title = title || news.title;
  news.content = content || news.content;
  news.summary = summary || news.summary;
  news.category = category || news.category;
  news.isPublished = isPublished !== undefined ? isPublished : news.isPublished;
  news.tags = tags ? tags.split(",").map((t) => t.trim()) : news.tags;
  if (req.file) news.image = req.file.path;
  const updated = await news.save();
  await updated.populate("author", "name avatar");
  res.json(updated);
});

const deleteNews = asyncHandler(async (req, res) => {
  const news = await News.findById(req.params.id);
  if (!news) { res.status(404); throw new Error("News not found"); }
  if (news.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403); throw new Error("Not authorized");
  }
  await news.deleteOne();
  res.json({ message: "News deleted successfully" });
});

const getMyNews = asyncHandler(async (req, res) => {
  const news = await News.find({ author: req.user._id }).sort({ createdAt: -1 });
  res.json(news);
});

module.exports = { getAllNews, getTopNews, getSingleNews, createNews, updateNews, deleteNews, getMyNews };