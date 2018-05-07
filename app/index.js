import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import routes from './routes';

const app = express();

//app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({limit: '50mb'}));

mongoose.connect('mongodb://localhost/test_db');

const db = mongoose.connection;
db.on('error', ()=> console.log('connection error'));
db.once('open', function() {
  console.log('Successfully connected to Database!!');
});

app.use(routes);

app.get('/', function(req, res) {
  res.send('Hello World!!');
});

const server = app.listen(8000, () => {
	var host = server.address().address;
	var port = server.address().port;

	console.log('app listening on port 8000!', host, port);
});

// app.use(express.static('public'));

// app.get('/index', function (req, res) {
//    res.sendFile( __dirname + "/" + "index.html" );
// })

// app.get('/process_get', function (req, res) {
//    // Prepare output in JSON format
//    response = {
//       first_name:req.query.first_name,
//       last_name:req.query.last_name
//    };
//    console.log(response);
//    res.send(response);
// })

//app.get('/ab?cd', (req,res)=> res.send('Inside Page listing'));
