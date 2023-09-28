function getRouteParts(path) {
  return path
    .replace(/\/{2,}/g, "/")
    .split("/")
    .map((curr) => curr.toLowerCase().trim());
}

class RouteNode {
  constructor() {
    this.children = new Map();
    this.handler = null;
  }
}

class TrieRouter {
  constructor() {
    this.rootNode = new RouteNode();
  }

  addRoute(path, handler) {
    if (typeof path != "string" || typeof handler !== "function") {
      throw new Error(
        "Invalid params sent to the `addRoute` method. `path` should be of type `string` and `handler` should be of type function",
      );
    }

    let routeParts = this.getRouteParts(path);

    if (routeParts[routeParts.length - 1] == "") {
      routeParts = routeParts.slice(0, routeParts.length - 1);
    }

    this.addRouteParts(routeParts, handler);
  }

  findRoute(path) {
    if (!path || typeof path !== "string")
      throw new Error("`path` should of type string ");

    if (path.endsWith("/")) path = path.substring(0, path.length - 1);

    let routeParts = this.getRouteParts(path);
    let node = this.rootNode;
    let handler = null;

    for (let i = 0; i < routeParts.length; i++) {
      let currentPart = routeParts[i];

      let nextNode = node.children.get(currentPart);

      if (!nextNode) break;

      if (i === routeParts.length) {
        handler = nextNode.handler;
      }

      node = nextNode;
    }
    return handler;
  }

  addRouteParts(routeParts, handler) {
    let node = this.rootNode;

    for (let i = 0; i < routeParts.length; i++) {
      let currentPart = routeParts[i];

      let nextNode = node.children.get(currentPart);

      if (!nextNode) {
        nextNode = new RouteNode();
        node.children.set(currentPart, nextNode);
      }

      if (i === routeParts.length - 1) {
        nextNode.handler = handler;
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

function ref() {}

trieRouter.addRoute("/home/", ref);
trieRouter.addRoute("/  user/  status/play", function inline() {});
trieRouter.addRoute("/home/id", ref);
trieRouter.printTree();
