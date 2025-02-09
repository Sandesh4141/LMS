import {
  getOverviewStats,
  getRecentActivity,
} from "../models/overview.model.js";

const fetchOverviewData = async (req, res) => {
  try {
    const stats = await getOverviewStats();
    const recent = await getRecentActivity();

    res.json({
      ...stats,
      recent,
    });
  } catch (error) {
    console.error("Error fetching overview data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



export { fetchOverviewData };
