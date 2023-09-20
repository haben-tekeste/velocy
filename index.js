const http = require('node:http')
const PORT = 5255;

class Router {
  constructor() {
    // stores our routes
    this.routes = {};
  }

  addRoute(method, path, handler) {
    this.routes[`${method} ${path}`] = handler;
  }

  printRoutes() {
    console.log(Object.entries(this.routes));
  }

  handleRequest(request, response) {
    const { url, method } = request;
    const handler = this.routes[`${method} ${url}`];

    if (!handler) {
      return console.log("404 Not found");
    }

    handler(request, response);
  }
}

const router = new Router();
router.addRoute("GET", "/", function handleGetBasePath() {
  console.log("Hello from my GET /");
});
router.addRoute("POST", "/", function handleGetBasePath() {
  console.log("Hello from my POST /");
});

let server = http.createServer(router.handleRequest).listen(PORT)
