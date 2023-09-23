const http = require("node:http");
const PORT = 5255;

const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
  TRACE: "TRACE",
  OPTIONS: "OPTIONS",
  HEAD: "HEAD",
};

class Router {
  constructor() {
    // stores our routes
    this.routes = {};
  }

  #addRoute(method, path, handler) {
    this.routes[`${method} ${path}`] = handler;
  }

  printRoutes() {
    console.log(Object.entries(this.routes));
  }

  get(path, handler) {
    this.#addRoute(HTTP_METHODS.GET, path, handler);
  }

  post(path, handler) {
    this.#addRoute(HTTP_METHODS.POST, path, handler);
  }

  put(path, handler) {
    this.#addRoute(HTTP_METHODS.PUT, path, handler);
  }

  delete(path, handler) {
    this.#addRoute(HTTP_METHODS.DELETE, path, handler);
  }

  patch(path, handler) {
    this.#addRoute(HTTP_METHODS.PATCH, path, handler);
  }

  head(path, handler) {
    this.#addRoute(HTTP_METHODS.HEAD, path, handler);
  }

  trace(path, handler) {
    this.#addRoute(HTTP_METHODS.TRACE, path, handler);
  }

  options(path, handler) {
    this.#addRoute(HTTP_METHODS.OPTIONS, path, handler);
  }

  handleRequest(request, response) {
    const { url, method } = request;
    const handler = this.routes[`${method} ${url}`];

    if (!handler) {
      console.log("404 Not found");
      response.writeHead(404, { "Content-Type": "text/plain" });
      return response.end("Not found");
    }

    handler(request, response);
  }
}

const router = new Router();
router.addRoute("GET", "/", function handleGetBasePath(req, res) {
  console.log("Hello from my GET /");
  res.end();
});
router.addRoute("POST", "/", function handleGetBasePath(req, res) {
  console.log("Hello from my POST /");
  res.end();
});

http.createServer((req, res) => router.handleRequest(req, res)).listen(PORT);
