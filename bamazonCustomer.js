var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon_DB"
});


connection.connect(function(err) {
  if (err) throw err;
  // To select data from a table in MySQL, use the "SELECT" statement
  // Select all and return the result object
  connection.query("SELECT * FROM products", function (err, result, fields) {
    if (err) throw err;
    

    // instantiate
    var table = new Table({
      head: ['ID', 'PRODUCT NAME', 'DEPARTMENT', 'PRICE', 'STOCK QUANTITY']
    });

    // console.log(result);
    // result is an array of objects with id, product_name, department_name, price, and stock_quantitiy
    // for each object in `result` stored in `x`
    result.forEach(x => {
      // create an empty array
      var arr = [];
      // push the value of the key/value pair from each object into the empty array above
      // i.e create an array with values for each object (or each row from the database)
      arr.push(x.id);
      arr.push(x.product_name);
      arr.push(x.department_name);
      arr.push(x.price);
      arr.push(x.stock_quantity);
      table.push(arr);
    });

    console.log(table.toString());
    welcome();
  });
});

function welcome() {
  inquirer.prompt([
    {
      type: "list",
      name: "isPurchasing",
      message: "Can I help you with anything today?",
      choices: ['Yes','No']
      
    },
  ]).then(function(answer){
    if (answer.isPurchasing === 'Yes') {
      purchase();
    } else {
      console.log("Please come back next time when you're ready!");
      connection.end();
    }
  })
}


function purchase() {
  inquirer.prompt([
    {
      type: "input",
      name: "itemID",
      message: "What is the ID of the item you would like to purchase?",
      validate: function(value) {
        if (isNaN(value) === false) {
            return true;
        } else {
            console.log('\nPlease enter a valid ID.');
            return false;
        }
      }
    },
    {
      type: "input",
      name: "itemQuantity",
      message: "How many would you like?",
      validate: function(value) {
        if (isNaN(value) === false) {
            return true;
        } else {
            console.log('\nPlease enter a valid quantity.');
            return false;
        }
      }
    }
  ]).then(function(choice) {
    console.log("User's choice", choice)
  })
  
}

