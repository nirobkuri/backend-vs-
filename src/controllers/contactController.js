const asyncHandler = require("express-async-handler");
const Contact = require("../models/Contact");

const submitContact = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    res.status(400); throw new Error("Please fill all fields");
  }
  const contact = await Contact.create({ name, email, subject, message });
  res.status(201).json({ message: "Message sent successfully!", contact });
});

const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  res.json(contacts);
});

module.exports = { submitContact, getContacts };