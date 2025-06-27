module.exports.authMiddleware = (req, res, next) => {
  req.user = {
    accessToken: process.env.PINTEREST_TEST_TOKEN // put your token in .env
  };
  next();
};