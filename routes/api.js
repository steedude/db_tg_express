const express = require("express");
// const axios = require('axios');
const router = express.Router();

router.get("/", async (req, res, next) => {
  function telebotPromise() {
    return new Promise((resolve) => {
      setTimeout((() => {
        fetch("https://api.telegram.org/bot6359990785:AAGNEIUUwgdSK2BtF2PWgqj9i--v_XzDZXQ/sendMessage?chat_id=635999134&text=QQQQQQ")
          .then(resolve)
      }), 10*60*1000)
    })  
  }

  await telebotPromise();
  return res.status(200).json({
    title: "Express Testing......",
    message: "The app is working properly!",
  });
});

module.exports = router;
