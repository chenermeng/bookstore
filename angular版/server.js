let express = require('express');
let app = express();
let path = require('path');
let fs = require('fs')


let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/node_modules', express.static(path.resolve('node_modules')));
app.use('/tmpl', express.static(path.resolve('tmpl')));
app.get('/', function (req, res) {
    res.sendFile(path.resolve('index.html'));
})

readFile = (callback) => {
    fs.readFile('./books.json', 'utf8', (err, data) => {
        if (err || data == '') {
            callback([]);
        } else {
            try {
                callback(JSON.parse(data))
            } catch (e) {
                callback([]);
            }
        }
    })
}
writeFile = (data, callback) => {
    fs.writeFile('./books.json', JSON.stringify(data), callback);
}


app.get('/books', function (req, res) {
    readFile(data => {
        res.send(data);
    })
})
app.get('/books/:bid', function (req, res) {
    let id = req.params.bid;
    readFile(data => {
        let book = data.find(item => {
            return item.id == id;
        })
        res.send(book);
    })
})

app.post('/books', function (req, res) {
    let book = req.body;
    readFile(data => {
        book.id = data.length == 0 ? 1 : parseInt(data[data.length - 1]['id']) + 1;
        data.push(book);
        writeFile(data, () => {
            res.send(book);
        })
    })
})
app.put('/books/:bid', function (req, res) {
    let id = req.params.bid;
    let book = req.body;
    readFile(data => {
        data = data.map(item => item.id == id ? book : item);
        writeFile(data, () => {
            res.send(book);
        })
    })
})
app.delete('/books/:bid', function (req, res) {
    let id = req.params.bid;
    readFile(data => {
        data = data.filter(item => item.id != id);
        writeFile(data, () => {
            res.send({});
        })
    })
})
app.listen(8080);
