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

// GET Form to add new employee (GET the form first, then the forms "submit" button handles the POST request.
app.get("/create_employee", function (req, res) {
	res.render("pages/create_employee");
});

// POST a new employee route
app.post("/create_employee", function (req, res) {
	// Useful for console logging the form inputs
	let user = req.body.user;
	// Example of form data for adding a new user
	var data = `{"email":"${req.body.user.email}","firstName":"${req.body.user.firstName}","id":"${req.body.user.id}","lastName":"${req.body.user.lastName}","picture":"${req.body.user.picture}","title":"${req.body.user.title}"}`;
	var config = {
		method: 'post',
		url: 'https://ron-sproject-default-rtdb.firebaseio.com/data/.json',
		headers: { 
		  'Content-Type': 'text/plain'
		},
		data : data
	  };
	  
	  axios(config)
	  .then(function (response) {
		console.log(response.data);
	  })
	  .catch(function (error) {
		console.log(error);
	  });
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
		// console.log(response);
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
	
	var config = {
		method: 'get',
		url: `https://ron-sproject-default-rtdb.firebaseio.com/data/${id}/.json`,
		headers: { }
	  };
	  console.log(config);
	  axios(config)
	  .then(function (response) {
		let dataFromApi = response.data;
		console.log("The response data from render person is ", dataFromApi);
		return dataFromApi;
	  })
	  .then(function(response){
		//   console.log("this is the 2nd then response", response);
		res.render("pages/person", {
			employee: response //<--this is your variable key that you will use in your page templating
		});
	})
	  .catch(function (error) {
		console.log(error);
	  });
});



app.get("/success", function (req, res) {
	// console.log(req);
	res.render("pages/success");
});
//DELETE EMP
app.get("/delete/:uid", function (req, res) {
	// console.log(req);
	let id = req.params.uid;
	// console.log(id);
	var config = {
		method: 'delete',
		url: `https://ron-sproject-default-rtdb.firebaseio.com/data/${id}/.json`,
		headers: { 
			'Content-Type': 'text/plain'
		  },
	  };
	  
	  axios(config)
	  .then(function (response) {
		let dataFromApi = response.data;
		return dataFromApi;
	  })
	  .then(function(response){
		//   console.log(response)
		res.redirect("/directory");
	})
	  .catch(function (error) {
		console.log(error);
	  });
});

//Update Emp via PATCH
var updateEmpId; //this holds id for update POST request below...
app.get("/update/:uid", function (req, res) {
	let id = req.params.uid;
	updateEmpId = id;
	// console.log(employee)
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
		res.render("pages/update", {
			employee: response, //<--this is your variable key that you will use in your page templating
		});
	})
	  .catch(function (error) {
		console.log(error);
	  });
});

app.post("/update/:uid", function (req, res) {
	// console.log("update post function fired");
	let id = updateEmpId;
	// console.log(id);
	let user = req.body.user;
	// console.log(user);
	var newName = `{"firstName":"${user.firstName}"}`;
	// console.log(newName);
	var config = {
		method: 'patch',
		url: `https://ron-sproject-default-rtdb.firebaseio.com/data/${id}/.json`,
		headers: { 
		  'Content-Type': 'text/plain'
		},
		data : newName
	  };
	  
	  axios(config)
	  .then(function (response) {
		console.log(response.status);
	  })
	  .catch(function (error) {
		console.log(error);
	  });
	res.redirect("/directory");
});


// Express's .listen method is the final part of Express that fires up the server on the assigned port and starts "listening" for request from the app! (boilerplate code from the docs)

app.listen(2001);
console.log("Port 2001 is open");
