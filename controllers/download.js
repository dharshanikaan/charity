const Project = require("../models/project");
const download = require("../models/download");
const s3Service = require("../services/S3Service");
const sequelize = require("../utils/database");
const Donation = require("../models/donation");

exports.postDownload = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const userId = req.user.id;
    const donations = await Donation.findAll({
      where: { userId },
      attributes: ["order_id", "amount", "status", "createdAt"],
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Project,
          attributes: ["title", "description"],
        },
      ],
    });
    const donationData = JSON.stringify(donations);

    const filename = `Donation${userId}/${new Date().toISOString()}.txt`;

    const url = await s3Service.uploadFileToS3(donationData, filename);
    await download.create({ url, userId }, { transaction: t });
    await t.commit();
    res.status(200).json({ url });
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};