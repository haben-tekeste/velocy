const http = require("node:http");
const PORT = 5255;

class Router {
  constructor() {
    // stores our routes
    this.routes = {};
  }

  addRoute(method, path, handler) {
    this.routes[`${method} ${path}`] = handler;
    console.log(this.routes);
  }

  printRoutes() {
    console.log(Object.entries(this.routes));
  }

  handleRequest(request, response) {
    console.log(request.url, request.method);
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

http.createServer((req, res) => router.handleRequest(req, res)).listen(PORT);
