module.exports = (req, res, next) => {
  const { phone, password, simultaneous, value, asset, memo } = req.body;
  if (req.path === "/set-plan") {
    if (![phone, password, simultaneous, value, asset, memo].every(Boolean)) {
      return res.status(401).json("Missing Credentials");
    }
  }
  if (req.path === "/reset-plan") {
    if (![phone, simultaneous, value, asset, memo].every(Boolean)) {
      return res.status(401).json("Missing Credentials");
    }
  }
  next();
};
