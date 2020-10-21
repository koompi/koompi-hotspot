module.exports = (req, res, next) => {
  const { username, password, simultaneous, value } = req.body;
  if (req.path === "/set-plan") {
    if (![username, password, simultaneous, value].every(Boolean)) {
      return res.status(401).json("Missing Credentials");
    }
  }
  if (req.path === "/reset-plan") {
    if (![username, simultaneous, value].every(Boolean)) {
      return res.status(401).json("Missing Credentials");
    }
  }
  next();
};
