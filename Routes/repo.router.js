const express = require("express");
const repoController = require("../controllers/repoController");

const repoRouter = express.Router();

// Create a new repository
repoRouter.post("/repo/create", repoController.createRepository);

// Get all repositories
repoRouter.get("/repo/all", repoController.getAllRepository);

// Get a repository by ID
repoRouter.get("/repo/:id", repoController.fetchRepositoryById);

// Search repository by name
repoRouter.get("/repo/name/:name", repoController.fetchRepositoryByName);

// 🔧 Get repositories for a specific user (Corrected param: userId)
repoRouter.get("/repo/user/:userId", repoController.fetchRepositoryForCurrentUser);

// Update a repository (add content or change description)
repoRouter.put("/repo/update/:id", repoController.updateRepositoryById);

// Delete a repository
repoRouter.delete("/repo/delete/:id", repoController.deleteRepositoryById);

// Toggle visibility (public/private)
repoRouter.patch("/repo/toggle/:id", repoController.toggleVisibilityById);

module.exports = repoRouter;
