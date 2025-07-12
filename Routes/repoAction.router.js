const express = require("express");
const router = express.Router();

const {
  initRepoHandler,
  addRepoHandler,
  commitRepoHandler,
  pushRepoHandler,
  pullRepoHandler,
  revertRepoHandler,
} = require("../controllers/repoActionController");

// /repo/init/:repoId
router.post("/init/:repoId", initRepoHandler);
router.post("/add/:repoId", addRepoHandler);
router.post("/commit/:repoId", commitRepoHandler);
router.post("/push/:repoId", pushRepoHandler);
router.post("/pull/:repoId", pullRepoHandler);
router.post("/revert/:repoId", revertRepoHandler);

module.exports = router;
 