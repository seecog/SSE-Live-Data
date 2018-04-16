var express = require('express');
var app = express();

var route = express.Router();

var connections = [];
route.get('/data', function (req, res) {
    req.socket.setTimeout(50000000);
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    })
    res.write('/n');
    connections.push(res)


    req.on("close", function () {
        var rem = 0;
        for (let i = 0; i < connections.length; i++) {
            if (connections[i] == res) {
                rem = i;
                break;
            }
        }
        connections.splice(rem, 1)

    });


})

setInterval(function () {
    connections.forEach(function (res) {
        var d = new Date();
        res.write(`data: ${d.getMilliseconds()} \n\n`);
    })
}, 1000);



app.use('/api', route)
app.listen(3002, function () {
    console.log("Listening on port 3004")
})