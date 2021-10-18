const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {

  const prefix = process.env.PUBLIC_URL;

  /* Development: client runs on 3000 (process.env.PORT) and server on 5000 ; 
     Production: server runs on custom random port ; client is served from
     static compiled build */
  const port = process.env.NODE_ENV === "production" ?
                process.env.SERVER_PORT_PRODUCTION :
                5000;

  app.use(
    [
      `${prefix}/list-products`,
      `${prefix}/products`,
      `${prefix}/pictures`],
    createProxyMiddleware({
      target: `http://localhost:${port}`,
    })
  );
  
};