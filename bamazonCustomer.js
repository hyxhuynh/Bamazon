// npm packages
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

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

var currentInventory;

connection.connect(function(err) {
  if (err) throw err;
  menu();
});

// ============ MENU ============
// function to display both the 'products' table and execute the 'welcome' function
function menu() {
  queryTable(welcome);
}

// ============ QUERYTABLE ============
// function to display the 'products' table
// 'callback' parameter is used later to execute another function within the 'queryTable' function
function queryTable(callback){
  // To select data from a table in MySQL, use the "SELECT" statement
  // Select all and return the result object
  connection.query("SELECT * FROM products", function(err, result, fields) {
    if (err) throw err;

    // instantiate
    var table = new Table({
      head: ["ID", "PRODUCT NAME", "DEPARTMENT", "PRICE", "STOCK QUANTITY"]
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
    currentInventory = result;
    console.log(table.toString());
    // if there is a function called within the 'queryTable' function, display 'products' table AND execute that function
    // if there is NOT a function called within the 'queryTable' function, aka queryTable(), display ONLY the 'products' table
    if(callback) {
      callback();
    }
  });
}

// ============ WELCOME ============
// function to confirm if the customer is purchasing anything
function welcome() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "isPurchasing",
        message: "Can I help you with anything today?",
        choices: ["Yes", "No"]
      }
    ])
    .then(function(answer) {
      // if the customer is purchasing, execute function 'purchase'
      // else, end the connection
      if (answer.isPurchasing === "Yes") {
        purchase();
      } else {
        console.log("Please come back next time when you're ready!");
        connection.end();
      }
    });
}

// ============ CONFIRM NEXT PURCHASE ============
// function to confirm if the customer is doing the NEXT purchase
function confirmNextPurchase() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "isPurchasing",
        message: "Is there anything else you would like purchase?",
        choices: ["Yes", "No"]
      }
    ])
    .then(function(answer) {
      // if the customer is doing a NEXT purchase, execute function 'purchase'
      // else, end the connection
      if (answer.isPurchasing === "Yes") {
        queryTable(purchase);
      } else {
        console.log("Thank you for shopping with us! See you again soon!");
        connection.end();
      }
    });
}

// ============ PAID OR UNPAID ============
// function to confirm if the customer is paying for the purchase
function paidOrUnpaid(callback) {
  inquirer
    .prompt([
      {
        type: "list",
        name: "isPaid",
        message: "Is the amount paid?",
        choices: ["Paid", "Unpaid"]
      }
    ])
    // if the customer is doing a NEXT purchase, return 'true'
    // else, return 'false'
    // the REASON for using the 'call back' is so in the 'purchase' function, the inventory is updated ONLY WHEN the customer has PAID
    // WITHOUT the 'callback' function, inventory is updated (aka quantity deducted form the inventory) even when the amount is NOT PAID
    .then(function(answer) {
      if (answer.isPaid === "Paid") {
        console.log("Successfully purchased!")
        callback(true);
      } else {
        callback(false);
      }
    });
}

// ============ UPDATE INVENTORY ============
// function to update the inventory (aka 'products' table) when the customer paid (successfully purchase) the item(s)
function updateInventory(itemID, updatedStock) {
  connection.query(
    // update 'products' table in the database
    // first '?' correspond to 'stock_quantity: updatedStock'
    // second '?' correspond to 'id: itemID'
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: updatedStock
      },
      {
        id: itemID
      }
    ],
    function(error) {
      if (error) throw error;
      //console.log("\nInventory updated!");
       
    }
  );
}

// ============ PURCHASE ============
// function to manage the purchasing part using 'inquirer'
function purchase() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "itemID",
        message: "What is the ID of the item you would like to purchase?",
        validate: function(value) {
          if (isNaN(value) === false && value !== '' && parseInt(value) > 0) {
            return true;
          } else {
            console.log("\nPlease enter a valid ID.");
            return false;
          }
        }
      },
      {
        type: "input",
        name: "itemQuantity",
        message: "How many would you like?",
        validate: function(value) {
          if (isNaN(value) === false && value !== '' && parseInt(value) > 0) {
            return true;
          } else {
            console.log("\nPlease enter a valid quantity.");
            return false;
          }
        }
      }
    ])
    .then(function(choice) {
      //console.log("User's choice: ", choice);

      var currentItem = currentInventory.filter(
        item => item.id === parseInt(choice.itemID)
      );
      
      // Above function if written in longer form
      // var currentItem = currentInventory.filter(function(item) {
      //   return item.id === parseInt(choice.itemID);
      // });

      //console.log("currentItem", currentItem);
      //console.log("choice.itemQuantity", parseInt(choice.itemQuantity));
      //console.log("currentItem.stock_quantity", currentItem[0].stock_quantity);
      
      // if item ID given by the customer does NOT match the ID in the 'products' table
      if (currentItem.length == 0) {
        console.log("Sorry that item doesn't exist");
        // ask customer if they want to move onto a different purchase
        confirmNextPurchase();

      //if item ID given by the customer DOES match the ID in the 'products' table
      } else {
        // If the quantity requested is LESS THAN OR EQUAL to the stock quantity
        if (parseInt(choice.itemQuantity) <= currentItem[0].stock_quantity) {
          //fulfill order
          //console.log("Enough quantity");
          console.log("You have picked " + choice.itemQuantity + " of the " + currentItem[0].product_name + ".")
          var cost = parseInt(choice.itemQuantity) * currentItem[0].price;
          console.log("Please pay the total of $" + cost + " before moving onto the next purchase!")
          
          // Check if the customer paid
          paidOrUnpaid( function(isPaid) {
              if(isPaid){
                // ONLY update the inventory (aka the 'products' table) if the customer has PAID

                //console.log('isPaid working');
                var updatedStock = currentItem[0].stock_quantity - choice.itemQuantity;
                //console.log("updatedStock", updatedStock);

                // UPDATE the 'stock_quantity' in the 'products' table using the product ID chosen by the customer after the purchase
                updateInventory(parseInt(choice.itemID), updatedStock);
                confirmNextPurchase();
                // Ends connection if the amount is NOT PAID
              } else {
                console.log("The amount is not paid.");
                connection.end();
              }
          });
          // If the quantity requested is GREATER THAN the stock quantity
        } else {
          // Alert customer about the quantity left
          console.log("Insufficient quantity!");
          console.log("We only have " + currentItem[0].stock_quantity + " of the " + currentItem[0].product_name + " left.")
          // Ask if customer would like to move onto a new purchase
          confirmNextPurchase();
        }
      }
    });
}

