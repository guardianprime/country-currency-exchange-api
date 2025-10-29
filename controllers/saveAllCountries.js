const saveAllCountries = async (req, res) => {
  try {
    const result = await refreshData();

    if (!result.success) {
      return res.status(503).json({
        error: result.error,
        details: result.details,
      });
    }

    return res.status(200).json({
      message: "Country data refreshed successfully",
    });
  } catch (err) {
    console.error("Refresh endpoint error:", err);
    return res.status(503).json({
      error: "External data source unavailable",
      details: "An unexpected error occurred during refresh",
    });
  }
};

export default saveAllCountries;
