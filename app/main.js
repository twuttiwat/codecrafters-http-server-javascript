const net = require("net");

const OK_200 = "HTTP/1.1 200 OK\r\n";
const NOT_FOUND = "HTTP/1.1 404 Not Found\r\n\r\n";

const ok = () => OK_200 + "\r\n";

const plain = content => {
  let result = OK_200;
  result += "Content-Type: text/plain\r\n";
  result += `Content-Length: ${content.length}\r\n\r\n${content}`;

  return result;
}

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {

  socket.on('data', (data) => {
    console.log("Receive data");
    console.log(data.toString());

    const [reqLine, ...headers] = data.toString().split("\r\n");
    
    console.log(`request line: ${reqLine}`)
    console.log(`headers: ${headers}`)

    let reqTarget = reqLine.split(' ')[1]
    console.log(`request target: ${reqTarget}`)


    const endpoints = reqTarget.split("/");
    console.log('endpoints:', endpoints);

    if (reqTarget === '/') {
      socket.write(ok());
    } else if (endpoints[1] === "echo") {
      const message = endpoints[2];
      socket.write(plain(message));
    } else if (endpoints[1] === "user-agent") {
      const userAgent =
        headers.find( header => header.startsWith("User-Agent:"))
               .split(":")[1].trim();
      socket.write(plain(userAgent));
    } else {
      socket.write(NOT_FOUND);
    }
  });

  socket.on("close", () => {
    socket.end();
  });
});

server.listen(4221, "localhost");
