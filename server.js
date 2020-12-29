// Imports for Node packages
var express = require("express"); // Handles routing
var app = express(); // Server for handling routes, the heart of our app
var axios = require("axios"); // Handles GET, POST etc request and responses
const bodyParser = require("body-parser"); // Middleware for dealing with form input data

// Express server setup (boilerplate code from the docs)
app.set("view engine", "ejs");

// BodyParser middleware setup (boilerplate code from the docs)
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);

// Tells express where to find any static files like images
app.use(express.static("public"));

/// ** -- ROUTES -- ** ///

// GET Home page which renders the index.ejs template. No data needed for plain HTML.
app.get("/", function (req, res) {
	res.render("pages/index");
});

// POST a new employee route
app.post("/create_employee", function (req, res) {
	// Useful for console logging the form inputs
	let user = req.body.user;
	// Example of form data for adding a new user
	// var data = `{"email":"${req.body.user.email}","firstName":"${req.body.user.firstName}","id":"${req.body.user.id}","lastName":"${req.body.user.lastName}","picture":"${req.body.user.picture}","title":"${req.body.user.title}"}`;
	res.redirect("/success");
});


// GET Directory of employees, returns an array of objects from the server.
app.get("/directory", function (req, res) {
	// Modify this route and the views
	var config = {
		method: 'get',
		url: 'https://ron-sproject-default-rtdb.firebaseio.com/data/.json',
		headers: { }
	  };
	  
	  axios(config)
	  .then(function (response) {
		console.log(response);
		let responseArr = Object.entries(response.data);
		return responseArr;
	  })
	  .then((employees) => {
		res.render("pages/directory", {
			employees: employees, //<--this is your variable key that you will use in your page templating
		});
	})
	  .catch(function (error) {
		console.log(error);
	  });
	
});

// GET static about page
app.get("/about", function (req, res) {
	res.render("pages/about");
});

// Single Employee
// "Render" the person view here!
app.get("/directory/:uid", function (req, res) {
	// console.log(req);
	let id = req.params.uid;
	console.log(id);
	var config = {
		method: 'get',
		url: `https://ron-sproject-default-rtdb.firebaseio.com/data/${id}/.json`,
		headers: { }
	  };
	  
	  axios(config)
	  .then(function (response) {
		let dataFromApi = response.data;
		return dataFromApi;
	  })
	  .then(function(response){
		//   console.log(response)
		res.render("pages/person", {
			employee: response, //<--this is your variable key that you will use in your page templating
		});
	})
	  .catch(function (error) {
		console.log(error);
	  });
});

// GET Form to add new employee (GET the form first, then the forms "submit" button handles the POST request.
app.get("/create_employee", function (req, res) {
	res.render("pages/create_employee");
});

app.get("/success", function (req, res) {
	console.log(req);
	// var config = {
	// 	method: 'post',
	// 	url: 'https://ron-sproject-default-rtdb.firebaseio.com/data/.json',
	// 	headers: { 
	// 	  'Content-Type': 'application/json'
	// 	},
	// 	data : user
	//   };
	  
	//   axios(config)
	//   .then(function (response) {
	// 	console.log(response.data);
	//   })
	//   .catch(function (error) {
	// 	console.log(error);
	//   });
	res.render("pages/success");
});

// Express's .listen method is the final part of Express that fires up the server on the assigned port and starts "listening" for request from the app! (boilerplate code from the docs)

app.listen(2001);
console.log("Port 2001 is open");
