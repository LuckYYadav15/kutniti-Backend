const countryController = require("../controllers/countryController");

const router = require("express").Router();

router.post("/addCountry", countryController.addCountry);
router.get("/countryArticles", countryController.countryArticles)

module.exports = router;
