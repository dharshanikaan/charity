const  Report = require("../models/report");

exports.createReport = async (req, res) => {
    const { title, description, projectId } = req.body;
    try {
        const report = await Report.create({ title, description, projectId });
        res.status(201).json({ message: "Report created successfully", report });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getReport = async (req, res) => {
    const {projectId} = req.body
    try {
        const report = await Report.findOne({ where: { projectId } });
        if (!report) {
            return res.status(404).json({ error: "Report not found" });
        }
        res.status(200).json({ report });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}