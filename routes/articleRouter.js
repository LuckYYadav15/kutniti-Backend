// import controllers review, products
const articleController = require("../controllers/articleController");

// router
const router = require("express").Router();

// use routers

router.post("/addArticle", articleController.addArticle);
router.get("/fetchArticle", articleController.fetchDataAndStoreInArticle);
router.get("/fetchAllArticle", articleController.getAllArticles);

module.exports = router;
