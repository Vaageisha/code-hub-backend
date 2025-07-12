const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/UserModel");
const Issue = require("../models/issueModel");


async function createRepository(req, res) {
  console.log("Incoming repo create request:", req.body);
  const { owner, name, issues, content, description, visibility } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ error: "Repository name is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(owner)) {
      return res.status(400).json({ error: "Invalid User ID" });
    }

    const newRepository = new Repository({
      name,
      description,
      visibility,
      owner,
      content: content || [],
      issues: issues || [],
    });

    const result = await newRepository.save();

    console.log("Repository created:", result);
    res.status(201).json({
      message: "Repository created!",
      repositoryID: result._id,
    });
  } catch (err) {
    console.error("Error during repository creation:", err.message);
    res.status(500).send("Server error!");
  }
}


async function getAllRepository(req, res) {
  try {
    const repositories = await Repository.find({})
      .populate("owner")
      .populate("issues");

    res.json(repositories);
  } catch (err) {
    console.error("Error fetching all repositories:", err.message);
    res.status(500).send("Server error!");
  }
}


async function fetchRepositoryById(req, res) {
  const { id } = req.params;

  try {
    const repository = await Repository.find({ _id: id })
      .populate("owner")
      .populate("issues");

    res.json(repository);
  } catch (err) {
    console.error("Error fetching repository by ID:", err.message);
    res.status(500).send("Server error!");
  }
}


async function fetchRepositoryByName(req, res) {
  try {
    const name = req.params.name;

    const repositories = await Repository.find({
      name: { $regex: new RegExp(name, "i") }, // Case-insensitive partial match
    });

    res.status(200).json(repositories);
  } catch (err) {
    console.error("Error fetching repo by name:", err.message);
    res.status(500).json({ message: "Server error" });
  }
}


async function fetchRepositoryForCurrentUser(req, res) {
  const userId = req.params.userId;

  try {
    const repositories = await Repository.find({ owner: userId }).populate("owner");

    if (!repositories || repositories.length === 0) {
      return res.status(404).json({ error: "User repositories not found" });
    }

    res.status(200).json({ message: "Repositories found!", repositories });
  } catch (err) {
    console.error("Error fetching user repositories:", err.message);
    res.status(500).send("Server error!");
  }
}


async function updateRepositoryById(req, res) {
  const { id } = req.params;
  const { content, description } = req.body;

  try {
    const repository = await Repository.findById(id);

    if (!repository) {
      return res.status(404).json({ error: "Repository not found" });
    }

    if (content) {
      if (!Array.isArray(repository.content)) {
        repository.content = [];
      }
      repository.content.push(content);
    }

    if (description) {
      repository.description = description;
    }

    const updatedRepository = await repository.save();

    res.json({
      message: "Repository updated successfully!",
      repository: updatedRepository,
    });
  } catch (err) {
    console.error("Error updating repository:", err.message);
    res.status(500).send("Server error!");
  }
}


async function toggleVisibilityById(req, res) {
  const { id } = req.params;

  try {
    const repository = await Repository.findById(id);

    if (!repository) {
      return res.status(404).json({ error: "Repository not found" });
    }

    repository.visibility = !repository.visibility;
    const updatedRepository = await repository.save();

    res.json({
      message: "Repository visibility toggled!",
      repository: updatedRepository,
    });
  } catch (err) {
    console.error("Error toggling visibility:", err.message);
    res.status(500).send("Server error!");
  }
}

async function deleteRepositoryById(req, res) {
  const { id } = req.params;

  try {
    const repository = await Repository.findByIdAndDelete(id);

    if (!repository) {
      return res.status(404).json({ error: "Repository not found" });
    }

    res.json({ message: "Repository deleted successfully!" });
  } catch (err) {
    console.error("Error deleting repository:", err.message);
    res.status(500).send("Server error!");
  }
}


module.exports = {
  createRepository,
  getAllRepository,
  fetchRepositoryById,
  fetchRepositoryByName,
  fetchRepositoryForCurrentUser,
  updateRepositoryById,
  toggleVisibilityById,
  deleteRepositoryById,
};
