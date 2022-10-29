const fs = require('fs');    

const requestHandler = (req,res) => {
    // console.log(req);
    // console.log(req.url,req.method,req.headers);
    const url = req.url;
    const method = req.method;
    if(url === '/'){
        res.setHeader('Content-Type','text/html');
        res.write('<html>');
        res.write('<body>');
        res.write('<form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form>')
        res.write('</body>');
        res.write('</html>');
        return res.end();
    }
    if(url === '/message' && method === 'POST'){
        const body = [];
        req.on('data',(chunk) => {
            console.log(chunk);
            body.push(chunk);
        });
        return req.on('end',() => {
            const parsedBody = Buffer.concat(body).toString();
            // console.log(parsedBody);
            const message = parsedBody.split('=')[1];
            // fs.writeFileSync('input.txt',message);// this is a blocking code
            //what that means is that node js will stop all other execution finish this and then continue.
            //while this is being executed no other requests are entertained. if the file is too big then it might cause issues.
            //other option is below. this is async but also has some downsides.
            fs.writeFile('input.txt',message, err => {
                res.writeHead(302,{'Location': '/'});
                return res.end();
            });
        });
        // res.writeHead(302,{'Location': '/'});
        //this statement is one short way to forward. other way below
        // res.statusCode = 302;
        // res.setHeader('Location', '/');
        // console.log('submit button clicked');
        // return res.end();
    }
    res.setHeader('Content-Type','text/html');
    res.write('<http>');
    res.write('<head><title>My First Page</title></head>');
    res.write('<body align="center"><h1>Hello from Node Js server!</h1></body>');
    res.write('</http>');
    res.end();
    // process.exit();//will exit the server listen
}
//ways to write exports

// module.exports = requestHandler;

// module.exports = {
//     handler: requestHandler,
//     someText: 'some tp text'
// };

// module.exports.handler = requestHandler;
// module.exports.someText = 'some text for tp';

exports.handler = requestHandler;
exports.someText = 'the text keeps changing in routes.js file';