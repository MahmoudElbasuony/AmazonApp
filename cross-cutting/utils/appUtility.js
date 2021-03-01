function getEnvironement() {
  return process.env.NODE_ENV || "development";
}

function isDevelopment() {
  return getEnvironement() === "development";
}


module.exports = {
  AppUtility: {
    isDevelopment,
    getEnvironement,
  },
};
