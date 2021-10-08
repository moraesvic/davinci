const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
  app.use(
    ["/products"],
    createProxyMiddleware({
      target: "http://localhost:5000",
    })
  );
};