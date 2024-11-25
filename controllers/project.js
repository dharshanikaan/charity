const Project = require("../models/project");

exports.createProject = async (req, res) => {
    const { title, description, donationGoal } = req.body;
    const charityId = req.charity.id;
    try {
        const project = await Project.create({
            title,
            description,
            donationGoal,
            charityId
        });
        res.status(201).json({message: "Project created successfully", project});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllProjects = async (req, res) => {
    try {
        const projects = await Project.findAll(
            { attributes: ["id", "title", "description", "donationGoal", "charityId"] }
        );
        res.status(200).json({ projects });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProjectById = async (req, res) => {
    const projectId = req.params.id;
    try {
        const project = await Project.findByPk(projectId,
            { attributes: ["id", "title", "description", "donationGoal", "charityId"] }
        );
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }
        res.status(200).json({ project });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProject = async (req, res) => {
    const projectId = req.params.id;
    const { title, description, donationGoal } = req.body;
    try {
        const project = await Project.findByPk(projectId);
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }
        project.title = title || project.title;
        project.description = description || project.description;
        project.donationGoal = donationGoal || project.donationGoal;
        await project.save();
        res.status(200).json({ message: "Project updated successfully", project });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};