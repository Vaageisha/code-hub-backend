const { initRepo } = require("./init");
const { addRepo } = require("./add");
const { commitRepo } = require("./commit");
const { pullRepo } = require("./pull");
const { pushRepo } = require("./push");
const { revertRepo } = require("./revert");

exports.initRepoHandler = async (req, res) => {
  try {
    await initRepo(req.params.repoId);
    res.status(200).json({ message: "Repository initialized." });
  } catch (err) {
    console.error("Init error:", err);
    res.status(500).json({ message: "Failed to initialize repo." });
  }
};

exports.addRepoHandler = async (req, res) => {
  try {
    await addRepo(req.params.repoId);
    res.status(200).json({ message: "Files added to staging." });
  } catch (err) {
    console.error("Add error:", err);
    res.status(500).json({ message: "Failed to add files." });
  }
};

exports.commitRepoHandler = async (req, res) => {
  try {
    const { message } = req.body;
    await commitRepo(req.params.repoId, message);
    res.status(200).json({ message: "Commit successful." });
  } catch (err) {
    console.error("Commit error:", err);
    res.status(500).json({ message: "Commit failed." });
  }
};

exports.pushRepoHandler = async (req, res) => {
  try {
    await pushRepo(req.params.repoId);
    res.status(200).json({ message: "Push successful." });
  } catch (err) {
    console.error("Push error:", err);
    res.status(500).json({ message: "Push failed." });
  }
};

exports.pullRepoHandler = async (req, res) => {
  try {
    await pullRepo(req.params.repoId);
    res.status(200).json({ message: "Pull successful." });
  } catch (err) {
    console.error("Pull error:", err);
    res.status(500).json({ message: "Pull failed." });
  }
};

exports.revertRepoHandler = async (req, res) => {
  try {
    const { commitID } = req.body;
    await revertRepo(req.params.repoId, commitID);
    res.status(200).json({ message: "Revert successful." });
  } catch (err) {
    console.error("Revert error:", err);
    res.status(500).json({ message: "Revert failed." });
  }
};
