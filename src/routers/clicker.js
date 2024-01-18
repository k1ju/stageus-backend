const router = require("express").Router();
const redis = require("redis").createClient();

router.post("/", async (req, res) => {
  const result = {
    success: false,
    message: "",
  };

  try {
    await redis.connect();

    const number = await redis.get("number");
    console.log("number", number)
    
    if (number) {
      // if문수정
      await redis.set("number", parseInt(number) + 1); //레디스는 스트링으로만 저장
    } else {
      await redis.set("number", 1);
    }

    result.success = true;
  } catch (e) {
    result.message = e.message;
  } finally {
    redis.disconnect();
    res.send(result);
  }
});

router.get("/", async (req, res) => {
  const result = {
    success: false,
    message: "",
    number: null,
  };

  try {
    await redis.connect();

    const number = await redis.get("number");

    if (!number) {
      // if문수정.
      await redis.set("number", parseInt(number) + 1); //레디스는 스트링으로만 저장
    }

    result.success = true;
    result.number = number;
  } catch (e) {
    result.message = e.message;
  } finally {
    redis.disconnect();
    res.send(result);
  }
});

module.exports = router;
