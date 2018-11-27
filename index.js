var express = require('express');
var app = express();
var router = express.Router();
var port = process.env.PORT || 8999;
var DATABASE_URL = "postgres://fgziyaczpjyghf:8bfdee6ef8f68d48dc35abaa5ea2ab738f816ee60bf3ff1e3a5193cafb5826ba@ec2-174-129-32-37.compute-1.amazonaws.com:5432/d549295uh1harg";
var bodyParser = require('body-parser');
const path = require('path');
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});
var methodOverride = require('method-override')
app.use(methodOverride('_method'));
app.use(methodOverride('X-HTTP-Method-Override'));
var nodemailer = require('nodemailer');
//google login api
var http = require('http');
// var Session = require('express-session');
// var { google } = require('googleapis');
// var GoogleAuth = require('google-auth-library');
// var plus = google.plus('v1');
// var OAuth2 = google.auth.OAuth2;
// const ClientId = "432466061710-a5nv0o9ndkh8627lmobnign489v6fptj.apps.googleusercontent.com";
// const ClientSecret = "kq0ZQ4lFgbMKbKkc_Y6n0F3a";
// const RedirectionUrl = "http://localhost:1666/oauthCallback/";

//another way
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const cookieSession = require('cookie-session');
const fs = require('fs');



//invoke functions on a service hosted in a different location
// Add headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow ,
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow- Headers');
  // Pass to next layer of middleware
  next();
});
//
app
  .use(express.static(path.join(__dirname + '/public/front_end')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));
const crypto = require('crypto');

var server = http.createServer(app);
// app.get('/', (req, res) => res.render('pages/index'));
// .listen(port, () => console.log('Listening on Heroku Server'))
server.listen(port);
server.on('listening', function () {
  console.log('listening to ${port}');
});
//google login api
// app.use(Session({
//   secret: 'raysources-secret-19890913007',
//   resave: true,
//   saveUninitialized: true
// }));

//another way
app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000, // One day in milliseconds
  keys: ['passport-test-app']
}));

app.use(passport.initialize()); // Used to initialize passport
app.use(passport.session()); // Used to persist login sessions
// Strategy config
passport.use(new GoogleStrategy({
  clientID: '432466061710-a5nv0o9ndkh8627lmobnign489v6fptj.apps.googleusercontent.com',
  clientSecret: 'kq0ZQ4lFgbMKbKkc_Y6n0F3a',
  callbackURL: 'https://nwen304gropproject.herokuapp.com/oauthCallback/'
},
  (accessToken, refreshToken, profile, done) => {
    done(null, profile); // passes the profile data to serializeUser
  }
));

// Used to stuff a piece of information into a cookie
passport.serializeUser((user, done) => {
  done(null, user);
});

// Used to decode the received cookie and persist session
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Middleware to check if the user is authenticated
function isUserAuthenticated(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect('/');
  }
}
// Routes
app.get('/', (req, res) => {
  fs.readFile('./index.html', (err, html) => {
    if (err) {
      throw err;
    }
    res.writeHeader(200, { "Content-Type": "text/html" });
    res.write(html);
    res.end();
  });
}
);


// passport.authenticate middleware is used here to authenticate the request
app.get('/login_google', passport.authenticate('google', {
  // scope: ['profile'] // Used to specify the required data
  scope: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
  ]
}));

// The middleware receives the data from Google and runs the function on Strategy config
app.get('/oauthCallback', passport.authenticate('google'), (req, res) => {
  res.redirect('/details');
});

// Secret route
app.get('/details', isUserAuthenticated, async (req, res) => {
  // res.send('<p>Welcome ' + req.user.name.familyName+" "+req.user.name.givenName+":"+req.user.emails[0].value+
  //   '</p> <br/> <a href="/logout_google">Logout</a>'+'<br/> <a href="/">back to home page</a>');


  var salt = crypto.randomBytes(128).toString('hex');
  try {
    const client = await pool.connect();
    var email = req.user.emails[0].value;
    var query_state1 = "SELECT * FROM account_table where email='" + email + "'";
    console.log(query_state1);
    // alert(query_state);
    var result1 = await client.query(query_state1);
    console.log("rows: " + result1.rows.length);
    if (result1.rows.length == 0) {
      console.log("888888");
      var firstname = req.user.name.givenName;
      var lastname = req.user.name.familyName;
      var pwd = "123456";
      var email = req.user.emails[0].value;

      var hash_pwd = crypto.pbkdf2Sync(pwd, salt, 100000, 128, 'sha512').toString('hex');
      // console.log("all username:"+username);
      var query_state = "insert into account_table (fname,lname,email,pwd,salt) values" + "('" + firstname + "','" + lastname + "','" + email + "','" + hash_pwd + "','" + salt + "')";
      console.log(query_state);
      // alert(query_state);
      var result = await client.query(query_state);
      console.log(query_state);
      if (!result) {
        return res.send('No data found');
      } else {
        return res.send('<p>Welcome ' + req.user.name.familyName + " " + req.user.name.givenName + ":" + req.user.emails[0].value +
          '</p> <br/> <a href="/logout_google">Logout</a>' + '<br/> <a href="/">back to home page</a>');
      }
    } else {
      return res.send('<p>Welcome ' + req.user.name.familyName + " " + req.user.name.givenName + ":" + req.user.emails[0].value + " Already Registered account by the google account" +
        '</p> <br/> <a href="/logout_google">Logout</a>' + '<br/> <a href="/">back to home page</a>');
    }



  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

// Logout route
app.get('/logout_google', (req, res) => {
  req.logout();
  res.redirect('/');
});

var jwt = require('jwt-simple');

// var payload = { userId: 1 };
// var secret = 'fe1a1915a379f3be5394b64d14794932';
// var token = jwt.encode(payload, secret);
// var decode = jwt.decode(token, secret);



// console.log("!!!!!!!!!!!jwt token:"+token);
// console.log("decode: "+decode.userId);
app.post('/forgot_pwd', async (req, res) => {
  console.log("forgot js called");
  // var new_salt = crypto.randomBytes(128).toString('hex');
  try {
    const client = await pool.connect();
    var email1 = req.body.emailadd;

    var query_state = "SELECT * FROM account_table where email='" + email1 + "'";
    console.log(query_state);
    // alert(query_state);
    var result = await client.query(query_state);
    var old_salt;
    var oldpwd;
    var id1;
    var success = false;

    if (result) {
      result.rows.forEach(account => {
        // console.log("hahaha");
        old_salt = account.salt;
        oldpwd = account.pwd;
        id1 = account.user_id
        // console.log(account.fname,account.lname);
      });
    }
    if (!result) {
      return res.send('invalid information, please try again');
    }
    var payload = {
      id: id1,        // User ID from database
      email: email1
    };
    var secret = oldpwd + '-' + old_salt;
    var token = jwt.encode(payload, secret);
    // console.log("id:"+id1+", old_pwd:"+oldpwd+", old_salt:"+old_salt);


    // console.log("email1: "+email1);
    console.log("token: " + token);
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'shoeshopnwen304@gmail.com',
        pass: 'yangminping666'
      }
    });
    var link = 'click the link to reset your password' + '  https://nwen304gropproject.herokuapp.com/resetpassword/' + payload.id + '/' + token

    // //TODO: CHECK EMAIL EXIST IN DATABASE . user_id from databse
    // var payload ={
    //   email:email1
    // }
    var mailOptions = {
      from: 'shoeshopnwen304@gmail.com',
      to: email1,
      subject: 'reset password',
      text: link
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        
        return res.send(error);
      
      } else {
        console.log('Email sent: ' + info.response);
        // alert("Email is sent, plz check your email box");
        return res.send('sent');
      }
    });

  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});
app.get('/resetpassword/:id/:token', async (req, res) => {
  try {
    console.log("reset password js called");
    const client = await pool.connect();
    var para_id = req.params.id;
    var query_state = "SELECT * FROM account_table where user_id='" + para_id + "'";
    console.log(query_state);
    // alert(query_state);
    var result = await client.query(query_state);
    var old_salt;
    var oldpwd;
    var id1;
    var success = false;

    if (result) {
      result.rows.forEach(account => {
        // console.log("hahaha");
        old_salt = account.salt;
        oldpwd = account.pwd;
        id1 = account.user_id
        // console.log(account.fname,account.lname);
      });

    }
    if (!result) {
      return res.send('invalid information, please try again');
    }
    var secret = oldpwd + '-' + old_salt;
    var payload = jwt.decode(req.params.token, secret);
    res.send('<form action="/resetpassword" method="POST" enctype="application/x-www-form-urlencoded">' +
      '<input type="hidden" name="_method" value="PUT">'+
      '<input type="hidden" name="id" value="' + payload.id + '" />' +
      '<input type="hidden" name="token" value="' + req.params.token + '" />' +
      '<input type="password" name="password" value="" placeholder="Enter your new password..." />' +
      '<input type="submit" value="Reset Password" />' +
      '</form>');
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.put('/resetpassword', async (req, res) => {
  console.log("reset password  email js called");
  var new_salt = crypto.randomBytes(128).toString('hex');
  try {
    const client = await pool.connect();
    var userid = req.body.id;
    // var old_pwd = req.body.old_pword;
    var new_pwd = req.body.password;
    // console.log("all username:"+username);
    var query_state = "SELECT * FROM account_table where user_id='" + userid + "'";
    console.log(query_state);
    // alert(query_state);
    var result = await client.query(query_state);
    // var old_salt;
    // var real_oldpwd;
    // var success = false;

    var old_salt;
    var oldpwd;
    // var id1;
    var success = false;

    if (result) {
      result.rows.forEach(account => {
        // console.log("hahaha");
        old_salt = account.salt;
        oldpwd = account.pwd;
        // id1 = account.user_id
        // console.log(account.fname,account.lname);
      });
    }
    if (!result) {
      return res.send('invalid information, please try again');
    }
    var secret = oldpwd + '-' + old_salt;
    var payload = jwt.decode(req.body.token, secret);
    console.log("payload id:"+payload.id);
    console.log("userid:"+userid);
    console.log(payload.id === userid);
    if (payload.id == userid) {
      console.log("verify token successfully")
      var new_pwd_hash = crypto.pbkdf2Sync(new_pwd, new_salt, 100000, 128, 'sha512').toString('hex');
      query_state = "UPDATE account_table SET pwd='" + new_pwd_hash + "',salt='" + new_salt + "' where user_id='" + userid + "'";
      result = await client.query(query_state);
      console.log("reset password successfully");
      return res.send('Your password has been successfully changed.  <br/> <a href="/">back to home page</a> ');
    } 
    if(!payload.id === userid||!result){
      return res.send('invalid information, please try again');
    }

    // if (result) {
    //   result.rows.forEach(account => {
    //     // console.log("hahaha");
    //     old_salt = account.salt;
    //     real_oldpwd = account.pwd;
    //     // console.log(account.fname,account.lname);
    //   });

    //   var try_oldpwd_hash = crypto.pbkdf2Sync(old_pwd, old_salt, 100000, 128, 'sha512').toString('hex');
    //   var success = (try_oldpwd_hash == real_oldpwd);
    //   if (success) {
    //     console.log("!!!!!!!!!!!!!!!!!ahhahahahahaha")
    //     var new_pwd_hash = crypto.pbkdf2Sync(new_pwd, new_salt, 100000, 128, 'sha512').toString('hex');
    //     query_state = "UPDATE account_table SET pwd='" + new_pwd_hash + "',salt='" + new_salt + "' where email='" + email + "'";
    //     result = await client.query(query_state);
    //     console.log("reset password successfully");
    //     return res.send(result.rows);
    //   }
    // }
    // if (!result || !success) {
    //   return res.send('invalid information, please try again');
    // }
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }

});
// function getOAuthClient() {
//   return new OAuth2(ClientId, ClientSecret, RedirectionUrl);
// }

// function getAuthUrl() {
//   var oauth2Client = getOAuthClient();
//   // generate a url that asks permissions for Google+ and Google Calendar scopes
//   var scopes = [
//     'https://www.googleapis.com/auth/plus.me'
//   ];

//   var url = oauth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: scopes // If you only need one scope you can pass it as string
//   });

//   return url;
// }

// app.use("/oauthCallback", function (req, res) {
//   console.log("0000000000000");
//   var oauth2Client = getOAuthClient();
//   var session = req.session;
//   var code = req.query.code;
//   oauth2Client.getToken(code, function (err, tokens) {
//     // Now tokens contains an access_token and an optional refresh_token. Save them.
//     if (!err) {
//       oauth2Client.setCredentials(tokens);
//       session["tokens"] = tokens;
//       res.send('<h3>Login successful!</h3><a href="/details">Go to details page</a>');
//     }
//     else {
//       res.send('<h3>Login failed!</h3>');
//     }
//   });
// });


// app.use("/details", function (req, res) {
//   var oauth2Client = getOAuthClient();
//   oauth2Client.setCredentials(req.session["tokens"]);

//   var p = new Promise(function (resolve, reject) {
//     plus.people.get({ userId: 'me', auth: oauth2Client }, function (err, response) {
//       console.log(response)
//       resolve(response || err);
//     });
//   }).then(function (response) {
//     data = response.data;
//     res.send('<h3>Hello ' + data.name.givenName + '_' + data.name.familyName + '</h3>');
//     // res.send('<h4>'+displayName+'</h4>');
//     // res.send('<h5>'+displayName+'</h5>');
//   })
// });
// // app.use("/login_google", function (req, res) {
// //   console.log("99999999999999");
// //   var url = getAuthUrl();
// //   console.log(url);
// //   res.send(url);
// // });

// app.use("/", function (req, res) {
//   console.log("cao ni xue ma baozha");
//   var url = getAuthUrl();
//   res.send('<h1>Authentication using google oAuth</h1><a href='
//     + url +
//     '>Login</a>')
// });


app.post('/register', async (req, res) => {
  console.log("register js called");
  // alert("register js called");
  var salt = crypto.randomBytes(128).toString('hex');
  try {
    const client = await pool.connect();

    var firstname = req.body.fname;
    var lastname = req.body.lname;
    var pwd = req.body.pword;
    var email = req.body.emailadd;
    var hash_pwd = crypto.pbkdf2Sync(pwd, salt, 100000, 128, 'sha512').toString('hex');
    // console.log("all username:"+username);
    var query_state = "insert into account_table (fname,lname,email,pwd,salt) values" + "('" + firstname + "','" + lastname + "','" + email + "','" + hash_pwd + "','" + salt + "')";
    console.log(query_state);
    // alert(query_state);
    var result = await client.query(query_state);

    if (!result) {
      return res.send('No data found');
    } else {
      return res.send(result.rows);
    }

  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.post('/login_account', async (req, res) => {
  console.log("login back-end called");

  try {
    const client = await pool.connect();
    var email = req.body.emailadd;
    var pwd = req.body.pword;
    // console.log("all username:"+username);
    var query_state = "SELECT * FROM account_table where email='" + email + "'";
    console.log(query_state);
    // alert(query_state);
    var result = await client.query(query_state);
    var salt;
    var real_pwd;
    var success = false;
    if (result) {
      result.rows.forEach(account => {
        // console.log("hahaha");
        salt = account.salt;
        real_pwd = account.pwd;
        console.log(account.fname, account.lname);
      });
      var try_pwd = crypto.pbkdf2Sync(pwd, salt, 100000, 128, 'sha512').toString('hex');
      success = (try_pwd == real_pwd);
      console.log("if success:" + success);
    }

    if (!result || !success) {

      return res.send('invalid information, please try again');
    } else {
      return res.send(result.rows);
    }

  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.put('/reset_pwd', async (req, res) => {
  console.log("reset js called");
  var new_salt = crypto.randomBytes(128).toString('hex');
  try {
    const client = await pool.connect();
    var email = req.body.emailadd;
    var old_pwd = req.body.old_pword;
    var new_pwd = req.body.new_pword;
    // console.log("all username:"+username);
    var query_state = "SELECT * FROM account_table where email='" + email + "'";
    console.log(query_state);
    // alert(query_state);
    var result = await client.query(query_state);
    var old_salt;
    var real_oldpwd;
    var success = false;
    
    if (result) {
      result.rows.forEach(account => {
        // console.log("hahaha");
        old_salt = account.salt;
        real_oldpwd = account.pwd;
        // console.log(account.fname,account.lname);
      });

      var try_oldpwd_hash = crypto.pbkdf2Sync(old_pwd, old_salt, 100000, 128, 'sha512').toString('hex');
      var success = (try_oldpwd_hash == real_oldpwd);
      if (success) {
        console.log("!!!!!!!!!!!!!!!!!ahhahahahahaha")
        var new_pwd_hash = crypto.pbkdf2Sync(new_pwd, new_salt, 100000, 128, 'sha512').toString('hex');
        query_state = "UPDATE account_table SET pwd='" + new_pwd_hash + "',salt='" + new_salt + "' where email='" + email + "'";
        result = await client.query(query_state);
        console.log("reset password successfully");
        return res.send(result.rows);
      }
    }
    if (!result || !success) {
      return res.send('invalid information, please try again');
    }
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

// async function writefile(data){
//   console.log('date=' + JSON.stringify(data));
//   fs.writeFile('./orders.json', JSON.stringify(data), function(err){
//     if (err) return console.log(err);
//   });
// }
// JSON.stringify(result.rows[i])
app.delete('/save_orders', async (req, res) => {

  try {
    const client = await pool.connect();
    var query_state = "select * from order_details";
    var result = await client.query(query_state);
    //asd
    for(var i = 0; i < result.rowCount; i++){
      new Promise(function (resolve, reject) {
          fs.writeFile('./orders.txt', "asd", function (err) {
              if (err) {
                  reject(err);
              } else {
                  resolve();
              }
          });
      });
    }

    console.log('reached after writefile');
    return res.send('orders saved');
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});



app.post('/recommendations', async (req, res) => {

  try {
    const client = await pool.connect();
    var sum = 0;
    var email = req.body.email;
    var itemsProcessed = 0;

    // find max number of items
    var query_state6 = "select * from orders where email = '" + email + "'";
    console.log(query_state6);
    var result6 = await client.query(query_state6);
    var numberOfItems = 0;

    result6.rows.forEach(async row => {
      var query_state7 = "select * from order_details where order_id = " + row.order_id;
      var result7 = await client.query(query_state7);
      numberOfItems += result7.rowCount;
    });


    // get all the orders of the user
    var query_state = "select * from orders where email = '" + email + "'";
    console.log(query_state);
    var result = await client.query(query_state);
    var json = [];

    // for each order of the user, find out what items are on the order
    result.rows.forEach(async row => {
      var query_state2 = "select * from order_details where order_id = " + row.order_id;
      console.log(query_state2);
      var result2 = await client.query(query_state2);
      // for each item add item_name, price quantity to json to display on html table     
      result2.rows.forEach(async row2 => {

        var query_state3 = "select * from items where item_id = " + row2.item_id;
        var result3 = await client.query(query_state3);
        sum += result3.rows[0].price;
        itemsProcessed++;

        if (itemsProcessed == numberOfItems){
          var average = sum / numberOfItems;
          var lowerBound = average - 20;
          var upperBound = average + 20;

          var query_state4 = "select * from items where price > " + lowerBound + " AND price < " + upperBound;
          console.log(query_state4);
          var result4 = await client.query(query_state4);
          return res.send(result4.rows);
        }
        
      });

    });
    } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }

  
});


app.post('/get_orders', async (req, res) => {

  try {
    const client = await pool.connect();
    console.log(req.body);
    var login_email = req.body.emailadd;
    console.log(login_email);

    

    if (login_email == 'admin@gmail.com') {
      // find max number of items
      var query_state6 = "select * from orders";
      console.log(query_state6);
      var result6 = await client.query(query_state6);
      var numberOfItems = 0;

      result6.rows.forEach(async row => {
        var query_state7 = "select * from order_details where order_id = " + row.order_id;
        var result7 = await client.query(query_state7);
        numberOfItems += result7.rowCount;
      });


      // get all the orders of the user
      var query_state = "select * from orders";
      console.log(query_state);
      var result = await client.query(query_state);
      var json = [];

      // for each order of the user, find out what items are on the order
      result.rows.forEach(async row => {
        var query_state2 = "select * from order_details where order_id = " + row.order_id;
        console.log(query_state2);
        var result2 = await client.query(query_state2);
        // for each item add item_name, price quantity to json to display on html table     
        result2.rows.forEach(async row2 => {

          var query_state3 = "select * from items where item_id = " + row2.item_id;
          var result3 = await client.query(query_state3);

          var data = {};
          data['order_id'] = row.order_id;
          data['order_date'] = result.rows[0].order_date;
          data['item_name'] = result3.rows[0].item_name;
          data['price'] = result3.rows[0].price;
          data['quantity'] = result2.rows[0].quantity;
          data['email'] = result.rows[0].email;
          json.push(data);
          if (json.length == numberOfItems){
            return res.send(json);
          }
          
        });

      });
    }
    else {

      // find max number of items
      var query_state6 = "select * from orders where email = '" + login_email + "'";
      console.log(query_state6);
      var result6 = await client.query(query_state6);
      var numberOfItems = 0;

      result6.rows.forEach(async row => {
        var query_state7 = "select * from order_details where order_id = " + row.order_id;
        var result7 = await client.query(query_state7);
        numberOfItems += result7.rowCount;
      });


      // get all the orders of the user
      var query_state = "select * from orders where email = '" + login_email + "'";
      console.log(query_state);
      var result = await client.query(query_state);
      var json = [];

      // for each order of the user, find out what items are on the order
      result.rows.forEach(async row => {
        var query_state2 = "select * from order_details where order_id = " + row.order_id;
        console.log(query_state2);
        var result2 = await client.query(query_state2);
        // for each item add item_name, price quantity to json to display on html table     
        result2.rows.forEach(async row2 => {

          var query_state3 = "select * from items where item_id = " + row2.item_id;
          var result3 = await client.query(query_state3);

          var data = {};
          data['order_id'] = row.order_id;
          data['order_date'] = result.rows[0].order_date;
          data['item_name'] = result3.rows[0].item_name;
          data['price'] = result3.rows[0].price;
          data['quantity'] = result2.rows[0].quantity;
          json.push(data);
          if (json.length == numberOfItems){
            return res.send(json);
          }
          
        });

      });
    }

  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

/* Creates an order and inserts it into the orders table */

app.post('/create_order', async (req, res) => {


  try {
    const client = await pool.connect();
    var email = req.body[0].email;
    // create a new order in the order table
    var query_state = "insert into orders(email) values('" + email + "')";
    console.log(query_state);
    var result = await client.query(query_state);

    // get the order id of the order that was just created
    var query_state2 = "select max(order_id) from orders";
    console.log(query_state2);
    var result2 = await client.query(query_state2);
    var order_id = result2.rows[0].max;
    console.log('max= ' + order_id);

    var count = 0;
    req.body.forEach(async row => {
      console.log(row);
      var item_name = row.item_name;
      var price = row.price;
      var quantity = row.quantity;

      // get the item_id of the each item
      var query_state3 = "select item_id from items where item_name = '" + item_name + "' AND price = " + price;
      console.log(query_state3);
      var result3 = await client.query(query_state3);
      var item_id = result3.rows[0].item_id;

      // insert the item details into order_details table
      var query_state4 = "insert into order_details(order_id, item_id, quantity) values(" + order_id + ", " + item_id + ", " + quantity + ")";
      console.log(query_state4);
      var result4 = await client.query(query_state4);

      count++;
      if (count == req.body.length) {
        return res.send('order created');
      }
    });


  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.delete('/delete_order', async (req, res) => {

  try {
    const client = await pool.connect();
    console.log(req.body);
    var id = req.body[0].order_id;
    var emailaddr = req.body[0].email;

    var query_state = "delete from orders where order_id = " + id + " AND email = '" + emailaddr + "'";
    console.log(query_state);
    var result = await client.query(query_state);

    return res.send('order deleted');

  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});



app.post('/view_cart', async (req, res) => {

  try {
    const client = await pool.connect();
    var login_email = req.body.email;
    var query_state = "select * from in_cart where email = '" + login_email + "'";
    console.log(query_state);
    var result = await client.query(query_state);
    var json = [];

    // generate json string containing img path, item name, price, quantity
    result.rows.forEach(async row => {
      var id = row.item_id;

      var query_state2 = "select * from items where item_id = " + id;
      console.log(query_state2);
      var result2 = await client.query(query_state2);

      row["item_name"] = result2.rows[0].item_name;
      row["img"] = result2.rows[0].img;
      row["price"] = result2.rows[0].price;
      json.push(row);
      if (json.length == result.rowCount) {
        return res.send(json);
      }
    });
    //asd

  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.post('/add', async (req, res) => {
  console.log("adding item to cart");

  // var searching = req.query.q;
  var adding = req.body.add;
  var login_email = req.body.email;
  console.log('adding= ' + adding);
  try {
    const client = await pool.connect();

    var query_state5 = "select user_id from account_table where email = '" + login_email + "'";
    console.log(query_state5);
    var result5 = await client.query(query_state5);
    var userid = result5.rows[0].user_id;

    // get the item_id of the item to add
    var query_state = "select item_id from items where item_name = '" + adding + "'";
    console.log(query_state);
    var result = await client.query(query_state);
    var itemid = result.rows[0].item_id;

    // check if item exists in cart
    var query_state2 = "select * from in_cart where item_id = '" + itemid + "' AND email = '" + login_email + "'";
    console.log(query_state2);
    var result2 = await client.query(query_state2);

    // if the item is currently not in the cart, add item to the in_cart database
    if (result2.rowCount == 0) {
      console.log('item does not exist in the cart for this user');
      var query_state3 = "insert into in_cart(item_id, user_id, email, quantity) values(" + itemid + ", " + userid + ", '" + login_email + "', 1)";
      var result3 = await client.query(query_state3);
    }
    // increment the quantity by 1 in the database if item exists in cart
    else {
      var query_state4 = "UPDATE in_cart SET quantity = quantity + 1 WHERE item_id = '" + itemid + "' AND email = '" + login_email + "'";
      var result4 = await client.query(query_state4);
    }

    if (!result) {
      return res.send('no records');
    }
    else {
      return res.json(result.rows);
    }

  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.delete('/delete_item', async (req, res) => {

  try {
    const client = await pool.connect();
    console.log(req.body);
    var item = req.body[0].item_name;
    var emailaddr = req.body[0].email;

    var query_state2 = "select * from items where item_name = '" + item + "'";
    console.log(query_state2);
    var result2 = await client.query(query_state2);

    var id = result2.rows[0].item_id;

    //need item id but we have item name
    var query_state = "delete from in_cart where item_id = " + id + " AND email = '" + emailaddr + "'"; 
    console.log(query_state);
    var result = await client.query(query_state);


    return res.send('order deleted');

  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});


app.post('/search', async (req, res) => {
  console.log("men's page");

  // var searching = req.query.q;
  var searching = req.body.q;
  console.log('searching= ' + searching);
  try {
    const client = await pool.connect();
    // console.log("all username:"+username);
    var query_state = "select * from items where item_name like '%" + searching + "%'";
    // var query_state='select * from items where cat_id = 1';
    console.log(query_state);
    // alert(query_state);
    var result = await client.query(query_state);

    if (!result) {
      return res.send('no records');
    }
    else {
      return res.json(result.rows);
    }

  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});


/*
The following 4 get requests will be corresponding to the new page
and the sorting methods most popular, price ascending/descending.
*/


app.get('/new', async (req, res) => {

  try {
    const client = await pool.connect();
    // console.log("all username:"+username);
    var query_state = "select * from items where new = true";
    console.log(query_state);
    // alert(query_state);
    var result = await client.query(query_state);

    if (!result) {
      return res.send('no records');
    }
    else {
      return res.send(result.rows);
    }

  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});


app.get('/new_most_popular', async (req, res) => {

  try {
    const client = await pool.connect();
    // console.log("all username:"+username);
    var query_state = "select * from items where new = true order by rating asc";
    console.log(query_state);
    // alert(query_state);
    var result = await client.query(query_state);

    if (!result) {
      return res.send('no records');
    }
    else {
      return res.send(result.rows);
    }

  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});


app.get('/new_price_ascending', async (req, res) => {

  try {
    const client = await pool.connect();
    // console.log("all username:"+username);
    var query_state = "select * from items where new = true order by price asc";
    console.log(query_state);
    // alert(query_state);
    var result = await client.query(query_state);

    if (!result) {
      return res.send('no records');
    }
    else {
      return res.send(result.rows);
    }

  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});


app.get('/new_price_descending', async (req, res) => {

  try {
    const client = await pool.connect();
    // console.log("all username:"+username);
    var query_state = "select * from items where new = true order by price desc";
    console.log(query_state);
    // alert(query_state);
    var result = await client.query(query_state);

    if (!result) {
      return res.send('no records');
    }
    else {
      return res.send(result.rows);
    }

  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});


/*
The following 4 get requests will be corresponding to the mens page
and the sorting methods most popular, price ascending/descending.
*/

app.get('/mens', async (req, res) => {
  console.log("men's page");

  try {
    const client = await pool.connect();
    // console.log("all username:"+username);
    var query_state = "select * from items where cat_id = 1";
    console.log(query_state);
    // alert(query_state);
    var result = await client.query(query_state);

    if (!result) {
      return res.send('no records');
    }
    else {
      return res.send(result.rows);
    }

  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});


app.get('/mens_most_popular', async (req, res) => {
  console.log("men's page");

  try {
    const client = await pool.connect();
    // console.log("all username:"+username);
    var query_state = "select * from items where cat_id = 1 order by rating asc";
    console.log(query_state);
    // alert(query_state);
    var result = await client.query(query_state);

    if (!result) {
      return res.send('no records');
    }
    else {
      return res.send(result.rows);
    }

  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});


app.get('/mens_price_ascending', async (req, res) => {
  console.log("men's page");

  try {
    const client = await pool.connect();
    // console.log("all username:"+username);
    var query_state = "select * from items where cat_id = 1 order by price asc";
    console.log(query_state);
    // alert(query_state);
    var result = await client.query(query_state);

    if (!result) {
      return res.send('no records');
    }
    else {
      return res.send(result.rows);
    }

  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.get('/mens_price_descending', async (req, res) => {
  console.log("men's page");

  try {
    const client = await pool.connect();
    // console.log("all username:"+username);
    var query_state = "select * from items where cat_id = 1 order by price desc";
    console.log(query_state);
    // alert(query_state);
    var result = await client.query(query_state);

    if (!result) {
      return res.send('no records');
    }
    else {
      return res.send(result.rows);
    }

  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});


/*
The following 4 get requests will be corresponding to the womens page
and the sorting methods most popular, price ascending/descending.
*/

app.get('/womens', async (req, res) => {
  console.log("women's page");

  try {
    const client = await pool.connect();
    // console.log("all username:"+username);
    var query_state = "select * from items where cat_id = 2";
    console.log(query_state);
    // alert(query_state);
    var result = await client.query(query_state);

    if (!result) {
      return res.send('no records');
    }
    else {
      return res.send(result.rows);
    }

  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.get('/womens_most_popular', async (req, res) => {
  console.log("women's page");

  try {
    const client = await pool.connect();
    // console.log("all username:"+username);
    var query_state = "select * from items where cat_id = 2 order by rating asc";
    console.log(query_state);
    // alert(query_state);
    var result = await client.query(query_state);

    if (!result) {
      return res.send('no records');
    }
    else {
      return res.send(result.rows);
    }

  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});


app.get('/womens_price_ascending', async (req, res) => {
  console.log("women's page");

  try {
    const client = await pool.connect();
    // console.log("all username:"+username);
    var query_state = "select * from items where cat_id = 2 order by price asc";
    console.log(query_state);
    // alert(query_state);
    var result = await client.query(query_state);

    if (!result) {
      return res.send('no records');
    }
    else {
      return res.send(result.rows);
    }

  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.get('/womens_price_descending', async (req, res) => {
  console.log("women's page");

  try {
    const client = await pool.connect();
    // console.log("all username:"+username);
    var query_state = "select * from items where cat_id = 2 order by price desc";
    console.log(query_state);
    // alert(query_state);
    var result = await client.query(query_state);

    if (!result) {
      return res.send('no records');
    }
    else {
      return res.send(result.rows);
    }

  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});


app.get('/kids', async (req, res) => {
  console.log("women's page");

  try {
    const client = await pool.connect();
    // console.log("all username:"+username);
    var query_state = "select * from items where cat_id = 3";
    console.log(query_state);
    // alert(query_state);
    var result = await client.query(query_state);

    if (!result) {
      return res.send('no records');
    }
    else {
      return res.send(result.rows);
    }

  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.get('/kids_most_popular', async (req, res) => {
  console.log("women's page");

  try {
    const client = await pool.connect();
    // console.log("all username:"+username);
    var query_state = "select * from items where cat_id = 3 order by rating asc";
    console.log(query_state);
    // alert(query_state);
    var result = await client.query(query_state);

    if (!result) {
      return res.send('no records');
    }
    else {
      return res.send(result.rows);
    }

  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});


app.get('/kids_price_ascending', async (req, res) => {
  console.log("women's page");

  try {
    const client = await pool.connect();
    // console.log("all username:"+username);
    var query_state = "select * from items where cat_id = 3 order by price asc";
    console.log(query_state);
    // alert(query_state);
    var result = await client.query(query_state);

    if (!result) {
      return res.send('no records');
    }
    else {
      return res.send(result.rows);
    }

  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.get('/kids_price_descending', async (req, res) => {
  console.log("women's page");

  try {
    const client = await pool.connect();
    // console.log("all username:"+username);
    var query_state = "select * from items where cat_id = 3 order by price desc";
    console.log(query_state);
    // alert(query_state);
    var result = await client.query(query_state);

    if (!result) {
      return res.send('no records');
    }
    else {
      return res.send(result.rows);
    }

  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});


// var queryCmd = "UPDATE tasks_table SET ifcompleted='"+ifcompleted+"' where nametask='"+taskname+"' and username='"+username+"'";




// All existing tasks on database will be shown on the corresponding position at webpage, once webpage was refreshed. 

// app.get('/db', async (req, res) => {
//   console.log("get called");

//   try {
//     const client = await pool.connect()
//     var result = await client.query('SELECT * FROM tasks_table');   

//     if (!result) {
//       return res.send('No data found');
//       }else{

//       return res.send(result.rows);

//     }
//   } catch (err) {
//     console.error(err);
//     res.send("Error " + err);
//   }

// });


// // Click add button in webpage to add a new task, then all information will be passed POST function, 
// //used the information to insert a task in the database by using sql command.
// app.post('/addnew', async (req, res) => {
//   console.log("add new called........");

//   try {
//     const client = await pool.connect();
//     console.log("body: "+req.body);
//     var taskname= req.body.nametask;
//     var username =req.body.username;
//     var ifcompleted=req.body.ifcompleted;
//     console.log("all username:"+username);
//     var result = await client.query("insert into tasks_table (nametask,username,ifcompleted) values"+"('"+taskname+"','"+username+"','"+ifcompleted+"')");   

//     if (!result) {
//       return res.send('No data found');
//       }else{
//       return res.send(result.rows);
//     }

//   } catch (err) {
//     console.error(err);
//     res.send("Error " + err);
//   }
// });


// // This function is used to change "ifcompleted" attributed to corresponding value("N"/"Y"). There are three cases. 
// // Firstly, if User click complete button on a task at to do list, then the task will be moved down to complete task list. 
// // Secondly, user drag a completed task to to do list. Thirdly, user drag a to-do task to complete task list. 
// // PUT function will change "ifcompleted" attribute of corresponding record on the database at server part. 

// app.put('/move_task', async (req, res) => {

//   console.log("move task server part called........");
//   try {
//     const client = await pool.connect();
//     var taskname =req.body.nametask;
//     var username=req.body.username;
//     var ifcompleted=req.body.ifcompleted;
//     console.log("first ifcompleted:"+ifcompleted);
//     if(ifcompleted=='N'){
//       ifcompleted='Y';
//     }else{
//       ifcompleted='N';
//     }
//     console.log(queryCmd);
//     var queryCmd = "UPDATE tasks_table SET ifcompleted='"+ifcompleted+"' where nametask='"+taskname+"' and username='"+username+"'";
//     console.log(queryCmd)
//     var result = await client.query(queryCmd);   

//     if (!result) {
//       return res.send('No data found');
//     }else{
//       return res.send(result.rows);
//     }

//   } catch (err) {
//     console.error(err);
//     res.send("Error " + err);
//   }
// });

// // When the user clicked delete button, the corresponding record on database will be deleted. 
// app.delete('/delete_task', async (req, res) => {

//   console.log("delete task server part called........");
//   try {
//     const client = await pool.connect();
//     var taskname =req.body.nametask;
//     var username=req.body.username;
//     var queryCmd = "delete from tasks_table where nametask='"+taskname+"' and username='"+username+"'";
//     console.log(queryCmd)
//     var result = await client.query(queryCmd);   

//     if (!result) {
//       return res.send('No data found');
//     }else{
//       return res.send(result.rows);
//     }

//   } catch (err) {
//     console.error(err);
//     res.send("Error " + err);
//   }
// });
