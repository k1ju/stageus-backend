const router = require('express').Router();
const redis = require('redis').createClient();

router.post('/', async (req, res) => {
    const { item, number } = req.body;
    //   const { idx } = req.decoded; //토큰 분해한거.
    const idx = 10;

    const result = {
        success: false,
        message: '',
    };

    try {
        await redis.connect();
        await redis.hSet(`cart${idx}`, item, number); //해쉬 명령어, 매개변수3개, 개개인 장바구니 생성.
        result.success = true;
    } catch (e) {
        res.message = e.message;
    } finally {
        redis.disconnect();
        res.send(result);
    }
});

router.get('/', async (req, res) => {
    //   const { idx } = req.decoded; //토큰 분해한거.
    const idx = 10;
    const result = {
        success: false,
        message: '',
        data: {
            cart: null,
        },
    };

    try {
        await redis.connect();
        const cart = await redis.hGetAll(`cart${idx}`); //해쉬 명령어, 매개변수1개, 개개인 장바구니전체 가져오기.
        result.success = true;
        result.data.cart = cart;
    } catch (e) {
        res.message = e.message;
    } finally {
        redis.disconnect();
        res.send(result);
    }
});

router.delete('/', async (req, res) => {
    //   const { idx } = req.decoded; //토큰 분해한거.    const idx = 10;

    const result = {
        success: false,
        message: '',
    };

    try {
        await redis.connect();
        await redis.del(`cart${idx}`); //해쉬 명령어, 매개변수1개, 개개인 장바구니전체 가져오기.
        result.success = true;
    } catch (e) {
        res.message = e.message;
    } finally {
        redis.disconnect();
        res.send(result);
    }
});

module.exports = router;
