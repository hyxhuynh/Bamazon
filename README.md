# Bamazon

## Table of Contents 
1. [Overview](#overview)
2. [Technologies](#technologies)
3. [Local Installation](#installation)
4. [Code Explain](#display)

<a name="overview"></a>
## Overview 
Bamazon is an Amazon-like storefront created with the MySQL. The app will take in orders from customers and deplete stock from the store's inventory. 

<a name="technologies"></a>
## Technologies

* JavaScript
* Node.js
* MySQL database
* Node packages: MySQL, Inquirer, and cli-table

<a name="installation"></a>
## Local Installation

Download the files to your computer from https://github.com/hyxhuynh/Bamazon


<a name="display"></a>
## Code Explain
* A table called `products` is created inside of MySQL Database called `bamazon_DB`. The table contains the following columns:
    * item_id (unique id for each product)
    * product_name (Name of product)
    * department_name
    * price (cost to customer)
    * stock_quantity (how much of the product is available in stores)
* A Node application called 'bamazonCustomer.js' is created. There are 7 functions to the app:
    * Function `queryTable` first displays all of the items available for sale when running the app. The displayed table includes the ids, names, and prices of products for sale. These information are selected from mentioned table above in the database.
    * Using `inquirer` npm, function `welcome` immediately confirms if the user would like to purchase anything/want any help. 
        * If the answer is 'no', connection ends. 
        * If the answer is 'yes', function `purchase` prompts the user with two messages:
            
            (1) ask the user the ID of the product they would like to buy
            
            (2) how many units of the product they would like to buy

    * Once user has placed the order, function `purchase` also checks if the inventory has enough of the product to meet the user's request. It also alerts user if the quantity of the product is insufficient. 
    * Function `paidOrUnpaid` is created to check if the user pay for the product using `inquirer` npm. If user paid, a message of 'Successfully purchased!' would show. Else if the amount was not paid, the connection would end. 
    * Function `confirmNextPurchase` is used 3 times, to check if user would like to do a next purchase. These are the instances the function is called:
        
        (1) If user requested an item with ID not listed in the `products` table in the `bamazon_DB`
        
        (2) After user successfully purchased/ paid for an item
        
        (3) If the quantity of the product requested is insufficient

    * Function `updateInventory` updates the stock quantity of the products corresponded to its ID in the `products` table after a successful purchase
    * JavaScript call-back is used several times, such as in function `menu` to execute both the `queryTable` and `welcome` functions when running the app

* Error-checking mechanism is in place if command is invalid or missing.