let express = require('express');
let path = require('path');
let https = require('https');
let app = express();
/*app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');*/
/*app.get('/', function (req, res) {
    res.render("index");
})*/
app.use("/", express.static('views'))
app.get("/attention/:id", (req, _res, next) => {
    let id=req.params.id
    let url=   `https://api.bilibili.com/x/relation/followings?vmid=${id}&pn=1&ps=10000&order=desc`
    httpForward(url,_res)
    //

})

app.get("/user/:id", (req, _res, next) => {
    let id=req.params.id
    let url= `https://api.bilibili.com/x/space/acc/info?mid=${id}`
    httpForward(url,_res)
})

function httpForward(url,_res) {
    https.get(url, (res) => {
        const { statusCode } = res;
        const contentType = res.headers['content-type'];

        let error;
        if (statusCode !== 200) {
            error = new Error('请求失败\n' + `状态码: ${statusCode}`);
        }
        if (error) {
            console.error(error.message);
            // 消费响应数据来释放内存。
            res.resume();
            return;
        }
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
            try {
                const parsedData = JSON.parse(rawData);
                _res.send(parsedData)
            } catch (e) {
                console.error(e.message);
            }
        });
    }).on('error', (e) => {
        console.error(`出现错误: ${e.message}`);
    });
}
let server = app.listen(9999, function () {

    let port = server.address().port
    console.log("端口:%s", port)

})