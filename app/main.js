const net = require("net");

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {

  socket.on('data', (data) => {
    console.log(`Receive data ${data.toString()}`)

    //console.log(data.toString().split("\r\n"))

    const [reqLine, ...headers] = data.toString().split("\r\n");
    
    //let reqLine = data.toString().split("\r\n")[0]
    console.log(`request line: ${reqLine}`)
    console.log(`headers: ${headers}`)

    let reqTarget = reqLine.split(' ')[1]
    console.log(`request target: ${reqTarget}`)


    const endpoints = reqTarget.split("/");
    console.log('endpoints:', endpoints);

    if (reqTarget === '/') {
      socket.write("HTTP/1.1 200 OK\r\n\r\n")
    } else if (endpoints[1] === "echo") {
      const echoStr = endpoints[2];
      const result = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${echoStr.length}\r\n\r\n${echoStr}`;
      console.log(result);
      socket.write(result);
    } else if (endpoints[1] === "user-agent") {
      const userAgentHeader = headers.find( header => header.startsWith("User-Agent:"));
      const userAgent = userAgentHeader.split(":")[1].trim();
      const result = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgent.length}\r\n\r\n${userAgent}`;
      
      socket.write(result);
    } else {
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n")
    }
  });

  socket.on("close", () => {
    socket.end();
  });
});

server.listen(4221, "localhost");
