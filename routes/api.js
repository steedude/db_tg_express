const express = require("express");
const router = express.Router();

router.get("/", async (req, res, next) => {
  setTimeout((() => {
    fetch("https://api.telegram.org/bot6359990785:AAGNEIUUwgdSK2BtF2PWgqj9i--v_XzDZXQ/sendMessage?chat_id=635999134&text=Hello")
  }), 3000)
  return res.status(200).json({
    title: "Express Testing......",
    message: "The app is working properly!",
  });
});

module.exports = router;
