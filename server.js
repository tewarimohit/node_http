const http = require("http");
const { json } = require("stream/consumers");

const server = http.createServer((req, res) => {
  const todos = [
    {
      id: 1,
      task: "todo one",
    },
    {
      id: 2,
      task: "todo two",
    },
    {
      id: 3,
      task: "todo three",
    },
  ];
  const { url, method } = req;

  let body = [];

  req
    .on("data", (chunk) => {
      body.push(chunk);
    })
    .on("end", () => {
      body = Buffer.concat(body).toString();
      let status = 404;
      const response = {
        status: false,
        data: null,
        error: null,
      };

      if (method === "GET" && url === "/todos") {
        status = 200;
        response.status = "success";
        response.data = todos;
      } else if (method === "POST" && url === "/todos") {
        const { id, text } = JSON.parse(body);
        if (!id || !text) {
          status = 400;
          response.error = "Please add id and text";
        } else {
          todos.push({ id, text });
          status = 201;
          response.status = "success";
          response.data = todos;
        }
      }

      res.writeHead(status, {
        "Content-Type": "text/html",
        "X-Powered-By": "Node.js",
      });
      res.end(JSON.stringify(response));
    });
});

const PORT = 5000;

server.listen(PORT, () => console.log(`Server Running on port ${PORT}`));
