const http = require("http");
const server = http.createServer((req,res) => {
 
    let a=10;
    let b=20;
    let c=a+b;
    res.write("result : "+c);
    res.end();
});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});