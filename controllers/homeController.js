module.exports = function HomeController() {
  const homeController = {};

  homeController.index = (req, res, next) => {
    res.render("home", { title: "Amazon", layout: "layout" });
  };

  return homeController;
};
