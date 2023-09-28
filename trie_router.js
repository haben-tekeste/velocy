function getRouteParts(path) {
  return path
    .replace(/\/{2,}/g, "/")
    .split("/")
    .map((curr) => curr.toLowerCase().trim());
}

class RouteNode {
  constructor() {
    this.children = new Map();
    this.handler = new Map();
  }
}

class TrieRouter {
  constructor() {
    this.rootNode = new RouteNode();
  }

  addRoute(path, method, handler) {
    if (
      typeof path != "string" ||
      typeof handler !== "function" ||
      typeof method !== "string"
    ) {
      throw new Error(
        "Invalid params sent to the `addRoute` method. `path` should be of type `string`, `method` should be of type string and `handler` should be of type function",
      );
    }

    method = method.toUpperCase();

    let routeParts = getRouteParts(path);

    if (routeParts[routeParts.length - 1] == "") {
      routeParts = routeParts.slice(0, routeParts.length - 1);
    }

    this.#addRouteParts(routeParts, method, handler);
  }

  findRoute(path, method) {
    if (!path || typeof path !== "string")
      throw new Error("`path` should of type string ");

    if (!method || typeof method !== "string")
      throw new Error("`method` should be of type string.");

    if (path.endsWith("/")) path = path.substring(0, path.length - 1);

    let routeParts = getRouteParts(path);
    let node = this.rootNode;
    let handler = null;

    for (let i = 0; i < routeParts.length; i++) {
      let currentPart = routeParts[i];

      let nextNode = node.children.get(currentPart);

      if (!nextNode) break;

      if (i === routeParts.length - 1) {
        handler = nextNode.handler.get(method);
      }

      node = nextNode;
    }
    return handler;
  }

  #addRouteParts(routeParts, method, handler) {
    let node = this.rootNode;

    for (let i = 0; i < routeParts.length; i++) {
      let currentPart = routeParts[i];

      let nextNode = node.children.get(currentPart);

      if (!nextNode) {
        nextNode = new RouteNode();
        node.children.set(currentPart, nextNode);
      }

      if (i === routeParts.length - 1) {
        nextNode.handler.set(method, handler);
      }

      node = nextNode;
    }
  }

  printTree(node = this.rootNode, indentation = 0) {
    const indent = "-".repeat(indentation);

    node.children.forEach((childNode, segment) => {
      console.log(`${indent}${segment}`);
      this.printTree(childNode, indentation + 1);
    });
  }
}

const trieRouter = new TrieRouter();

function getHandler() {}
function postHandler() {}

trieRouter.addRoute("/home", "GET", getHandler);
trieRouter.addRoute("/home", "POST", postHandler);

console.log(trieRouter.findRoute("/home", "GET")); // -> fn getHandler() {..}
console.log(trieRouter.findRoute("/home", "PATCH")); // -> null or undefined
console.log(trieRouter.findRoute("/home", "POST")); // -> fn postHanlder() {..}
