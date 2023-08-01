const express = require("express");
const router = express.Router();

router.get("/", async (req, res, next) => {
  setTimeout((() => {
    fetch("https://api.telegram.org/bot6345491638:AAGZxW09Z5PKQ-Zwvptwnpfv7FoGfNPa7q4/sendMessage?chat_id=263995857&text=Hello")
  }), 1000*60)
  return res.status(200).json({
    title: "Express Testing",
    message: "The app is working properly!",
  });
});

module.exports = router;
