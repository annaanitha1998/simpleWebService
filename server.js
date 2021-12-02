//REST API demo in Node.js
var express = require('express'); // requre the express framework
var app = express();
var fs = require('fs'); //require file system object

// Endpoint to Get a list of users
app.get('/getUsers', function(req, res){
    fs.readFile(__dirname + "/" + "users.json", 'utf8', function(err, data){
        console.log(data);
        res.set('Content-Type','text/json');
        res.end(data);
    });
})

// var user = {
    
//         "user_Kathy": {
//           "name": "Kathy",
//           "email": "kathy@gmail.com",
//           "password": "Kathy@123",
//           "lastLogin": new Date().toDateString()
//         }
      
// } 

 // For parsing application/json
 app.use(express.json());
  
 // For parsing application/x-www-form-urlencoded
 app.use(express.urlencoded({ extended: true }));

app.post('/addUser', function (req, res) {
    // First read existing users.
    fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       console.log(data)
       data = data ? JSON.parse( data ) : {};
       data["user_"+req.body.name] = req.body;
       data["user_"+req.body.name]["lastLogin"] = new Date().toDateString();
       console.log( data );
       res.status(200);
       res.set('Content-Type','text/json');
       res.end( JSON.stringify(data));
        fs.writeFile(__dirname + "/" + "users.json", JSON.stringify(data), function(err, result) {
            if(err) console.log('Error', err);
        });
    });
 })
 
app.get('/:id', function (req, res) {
    // First read existing users.
    fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       var users = JSON.parse( data );
       var user = users["user_" + req.params.id] 
       console.log( user );
       res.status(200);
       res.set('Content-Type','text/json');
       res.end( JSON.stringify(user));
    });
 })

 app.delete('/deleteUser/:name', function (req, res) {
    // First read existing users.
    fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       data = JSON.parse( data );
       delete data["user_" + req.params.name];
       res.status(200);
       res.set('Content-Type','text/json');
       console.log( data );
       res.end( JSON.stringify(data));
       fs.writeFile(__dirname + "/" + "users.json", JSON.stringify(data), function(err, result) {
        if(err) console.log('Error', err);
        });
    });
 })

//  var newMail = 'anna3@gmail.com'

 app.put('/updateUser/:name', function (req, res) {
    // First read existing users.
    fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       data = JSON.parse( data );
       var user = data["user_" + req.params.name] 
       console.log(user)
       user.email = req.body.email;
       data["user_" + req.params.name] = user;
       res.status(200);
       res.set('Content-Type','text/json');
       console.log( data );
       res.end( JSON.stringify(data));
       fs.writeFile(__dirname + "/" + "users.json", JSON.stringify(data), function(err, result) {
        if(err) console.log('Error', err);
        });
    });
 })

 app.post('/login', (req, res) => {
    fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
        data = JSON.parse( data );
        console.log(req.body);
        console.log(data);
        var userName = Object.keys(data);
        var results = userName.filter((name) => {
            return data[name].email == req.body.email && data[name].password == req.body.password
        })
        if (results.length < 1) {
            return res.status(401).json({
                message: 'Auth Failed'
            })
        }        
        return res.status(200).json({
            message: 'Auth Success'
        })
     });
     
 })
 
 
// Create a server to listen at port 8080
var server = app.listen(8080, function(){
    var host = server.address().address
    var port = server.address().port
    console.log("REST API demo app listening at http://%s:%s", host, port)
})
