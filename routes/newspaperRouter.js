const newspaperController = require("../controllers/newspaperController");

const router = require("express").Router();
const cron = require("node-cron");

// Schedule storeArticleCountByMonth() to run at 1:20 AM daily
cron.schedule("20 1 * * *", () => {
    newspaperController.storeArticleCountByMonth();
  });

router.post("/addNewspaper", newspaperController.addNewspaper);
router.get("/getAllNewspapers", newspaperController.getAllNewspapers);
router.get("/storeArticleCountByMonth", newspaperController.storeArticleCountByMonth);
router.post("/getAllDataForNewspaper", newspaperController.getAllDataForNewspaper)

module.exports = router;