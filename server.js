const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

// grabs the PORT environment variable that heroku set OR default of 3000
const port = process.env.PORT || 3000;

// make a new express app, set it to the return result from calling express
    //as a function
// no arguments, configuration happens in a different way down below
// to start app just call the method below
var app = express();

// add support for partial pages (ie header, footer)
// takes the directory going to use to hold partial files
hbs.registerPartials(__dirname + '/views/partials');
// set express related configurations
app.set('view engine', 'hbs');

//next tells express when your middleware function is done
// useful because you can have as much middleware as you want registered to a
// single express app
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    // have to have a callback function
    if(err) {
      console.log('Unable to append to server.log');
    }
  });
  //if middleware doesn't call next your handler for each request will never fire
  next();
});

// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// });

//express middleware lets you configure how your express app works
// kind of like a thrird paty add on
app.use(express.static(__dirname + '/public'));

// handlebars helpers = to register functions so they can run dynamically to create output
// 2 argument, 1. name of helper, 2. function to run
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});
// set up of all http route handlers
// if someone visit the route of website, we want to send something back (ex.
    //json file, html page)

// register a handler using app.get, set up a handler for an http get request
// 2 arguments, 1. the url, 2. function to run, tells express what to send back
// the function has two arguments important to express, 1. request, 2. response
// request (req) stores a ton of information about the request coming in
    //(ex. headers, body info, method made with the request to the path)
// response (res) has a bunch of methods available to you so you can respond
    //to the http request in whatever way you like (ex. customize data going
        //back, set http status codes)
app.get('/', (req, res) => {
  //res.send - lets us respond to the request sending some data back

  // sending back html
  //res.send('<h1>Hello Express!</h1>');

  //sending back json
  // when passing in an object - express converts it into json and sends it back
//   res.send({
//     name: 'Liz',
//     likes: [
//       'Vegan Cooking',
//       'Music'
//     ]
//   });
// });

  res.render('home.hbs', {
    pageTitle: 'Welcome Page',
    welcomeMessage: 'Welcome to my website!'
  });
});

app.get('/about', (req, res) => {
  // to pass data to rendered page you have to specify a second argument in the
  // res.render method
  res.render('about.hbs', {
    pageTitle: 'About Page',
  });
});

app.get('/bad', (req, res) => {
  res.send({
      errorMessage: 'Unable to handle request'
  });
});

// binds app to a port on our machine
// set using variable that grabs environment variable PORT set by heroku OR default of 3000
// port 3000 is a popular port for developing locally
// after you start app in console, can view in browser using localhost:3000
// has a second optional argument, a function that does something once the
    //serveris up because it can take a little bit of time to get started
app.listen(port, () => {
  console.log(`Server is up on port ${port}`)
});
