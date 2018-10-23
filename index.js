var express = require('express');
var app = express();
var router = express.Router();
var port = process.env.PORT || 3080;
var DATABASE_URL ="postgres://fgziyaczpjyghf:8bfdee6ef8f68d48dc35abaa5ea2ab738f816ee60bf3ff1e3a5193cafb5826ba@ec2-174-129-32-37.compute-1.amazonaws.com:5432/d549295uh1harg";
var bodyParser = require ('body-parser');
const path = require('path');
const { Pool } = require('pg'); 
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: true 
});
//



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
  .use (express.static(path.join(__dirname + '/public/front_end')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
app.use(bodyParser.json());

const crypto = require('crypto');

app.post('/register', async (req, res) => {
  console.log("register js called");
  // alert("register js called");
  var salt =crypto.randomBytes(128).toString('hex');
  try {
    const client = await pool.connect();
    
    var firstname= req.body.fname;
    var lastname =req.body.lname;
    var pwd= req.body.pword;
    var email=req.body.emailadd;
    var hash_pwd=crypto.pbkdf2Sync(pwd, salt, 100000, 128, 'sha512').toString('hex');
    // console.log("all username:"+username);
    var query_state="insert into account_table (fname,lname,email,pwd,salt) values"+"('"+firstname+"','"+lastname+"','"+email+"','"+hash_pwd+"','"+salt+"')";
    console.log(query_state);
    // alert(query_state);
    var result = await client.query(query_state);   
   
    if (!result) {
      return res.send('No data found');
      }else{
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
    var email=req.body.emailadd;
    var pwd= req.body.pword;
    // console.log("all username:"+username);
    var query_state="SELECT * FROM account_table where email='"+email+"'";
    console.log(query_state);
    // alert(query_state);
    var result = await client.query(query_state); 
    var salt;
    var real_pwd;
    if(result){
      result.rows.forEach(account=>{
        // console.log("hahaha");
        salt=account.salt;
        real_pwd =account.pwd;
        console.log(account.fname,account.lname);
      });
        var try_pwd = crypto.pbkdf2Sync(pwd, salt, 100000, 128, 'sha512').toString('hex');
        var success=(try_pwd==real_pwd);
        console.log("if success:"+success);
    }
    
    if (!result||!success) {
      return res.send('invalid account');
      }else{
      return res.send(result.rows);
    }

  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.get('/search', async (req, res) => {
  console.log("men's page");

  try {
    const client = await pool.connect();    
    // console.log("all username:"+username);
    var query_state="SELECT * FROM items where cat_id = 1";
    console.log(query_state);
    // alert(query_state);
    var result = await client.query(query_state);
    
    if (!result) {
      return res.send('no records');
    }
    else{
      return res.send(result.rows);
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
    var query_state="select * from items where new = true";
    console.log(query_state);
    // alert(query_state);
    var result = await client.query(query_state);
    
    if (!result) {
      return res.send('no records');
    }
    else{
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
    var query_state="select * from items where new = true order by rating asc";
    console.log(query_state);
    // alert(query_state);
    var result = await client.query(query_state);
    
    if (!result) {
      return res.send('no records');
    }
    else{
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
    var query_state="select * from items where new = true order by price asc";
    console.log(query_state);
    // alert(query_state);
    var result = await client.query(query_state);
    
    if (!result) {
      return res.send('no records');
    }
    else{
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
    var query_state="select * from items where new = true order by price desc";
    console.log(query_state);
    // alert(query_state);
    var result = await client.query(query_state);
    
    if (!result) {
      return res.send('no records');
    }
    else{
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
    var query_state="select * from items where cat_id = 1";
    console.log(query_state);
    // alert(query_state);
    var result = await client.query(query_state);

    if (!result) {
      return res.send('no records');
    }
    else{
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
    var query_state="select * from items where cat_id = 1 order by rating asc";
    console.log(query_state);
    // alert(query_state);
    var result = await client.query(query_state);

    if (!result) {
      return res.send('no records');
    }
    else{
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
    var query_state="select * from items where cat_id = 1 order by price asc";
    console.log(query_state);
    // alert(query_state);
    var result = await client.query(query_state);

    if (!result) {
      return res.send('no records');
    }
    else{
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
    var query_state="select * from items where cat_id = 1 order by price desc";
    console.log(query_state);
    // alert(query_state);
    var result = await client.query(query_state);
    
    if (!result) {
      return res.send('no records');
    }
    else{
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
    var query_state="select * from items where cat_id = 2";
    console.log(query_state);
    // alert(query_state);
    var result = await client.query(query_state);
    
    if (!result) {
      return res.send('no records');
    }
    else{
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
    var query_state="select * from items where cat_id = 2 order by rating asc";
    console.log(query_state);
    // alert(query_state);
    var result = await client.query(query_state);
    
    if (!result) {
      return res.send('no records');
    }
    else{
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
    var query_state="select * from items where cat_id = 2 order by price asc";
    console.log(query_state);
    // alert(query_state);
    var result = await client.query(query_state);
    
    if (!result) {
      return res.send('no records');
    }
    else{
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
    var query_state="select * from items where cat_id = 2 order by price desc";
    console.log(query_state);
    // alert(query_state);
    var result = await client.query(query_state);
    
    if (!result) {
      return res.send('no records');
    }
    else{
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
    var query_state="select * from items where cat_id = 3";
    console.log(query_state);
    // alert(query_state);
    var result = await client.query(query_state);
    
    if (!result) {
      return res.send('no records');
    }
    else{
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
    var query_state="select * from items where cat_id = 3 order by rating asc";
    console.log(query_state);
    // alert(query_state);
    var result = await client.query(query_state);
    
    if (!result) {
      return res.send('no records');
    }
    else{
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
    var query_state="select * from items where cat_id = 3 order by price asc";
    console.log(query_state);
    // alert(query_state);
    var result = await client.query(query_state);
    
    if (!result) {
      return res.send('no records');
    }
    else{
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
    var query_state="select * from items where cat_id = 3 order by price desc";
    console.log(query_state);
    // alert(query_state);
    var result = await client.query(query_state);
    
    if (!result) {
      return res.send('no records');
    }
    else{
      return res.send(result.rows);
    }

  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});






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

// // when user click edit button, then the new taskname and username of the task on database will be updated.
// app.put('/edit_task', async (req, res) => {
//   //
//   console.log("Edit task server part called........");
//   try {
//     const client = await pool.connect();
//     var taskname =req.body.nametask;
//     var username=req.body.username;
//     var newname= req.body.new_nametask;
//     var newuser= req.body.new_username;
//     var queryCmd = "UPDATE tasks_table SET nametask='"+newname+"',username='"+newuser+"' where nametask='"+taskname+"' and username='"+username+"'";
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

app.get('/', (req, res) => res.render('pages/index'))
	.listen(port, () => console.log('Listening on Heroku Server'))


