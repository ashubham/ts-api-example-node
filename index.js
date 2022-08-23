var http = require("http");
const { authenticate, tsApi } = require("./thoughtspot");

//create a server object:
async function start() {
  await authenticate("dev.user");

  http
    .createServer(async function (req, res) {
      try {
        const info = await tsApi.get("/session/info");
        res.write(JSON.stringify(info.data, "", 2)); //write a response to the client
      } catch (e) {
        console.error(e);
      }
      res.end(); //end the response
    })
    .listen(8080); //the server object listens on port 8080
}

start();
