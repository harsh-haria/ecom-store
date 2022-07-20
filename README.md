# ecom-store
Building a Ecommerce Store where an Admin can Create, Read, Update and Delete a product. A User can view product's details, Add products to cart and order the products in the cart(the products will be displayed under orders tab).

----------------------------

Procedure to run the project:
1) Download the .zip file and extract the contents into a folder. <br>

2) Assumming you already have Node Js. installed in your computer run command 'npm install' in your command line. <br>

3) Before moving on and starting the server, we need to make sure that we are connected to our database. Here I am using MongoDB. Feel free to use your own database or you can continue with the MongoDB.<br>
  a) Create an account on 'https://account.mongodb.com/account/login'. Spin up a free server.<br>
  b) After you have created the account click on 'Connect' button. Click on 'Connect using MongoDB Compass'. Copy the connection string that is being displayed on the screen. Store this link in a safe place.<br>
  c) Replace the '/test' at the end of the link to '/shop'.<br>
  d) Replace the '<password>' in the link with the password which you had assigned while spinning up the server. <br>
  e) Back to the home page of MongoDB cloud. Under Security, Click on 'Network Access'. After that you should see 'ADD IP ADDRESS' button. Click on it and then click on 'Add this Computer's IP' button and hit 'Confirm'.<br>
  f) Create a file 'database.js' in utils folder and paste the code below in that file along with your link and then save it.<br><p><em>
  module.exports = {<br>
  &emsp; uri: '<your_link_will_go_here>'<br>
};</em></p>
  g) Now you can connect to the database via this application.<br>
  
4) Run command 'npm start' to start the server.

5) You can now access the website on 'localhost:3000'. If you are running the project for the first time. There are no products saved yet. So go ahead and save some products to use all other functionality of the website.<br>

6) To check what the data looks like in the database, Go to the newly installed Atlas and follow the steps below.<br>
  a) Open the newly installed MongoDB Atlas and click on 'New Connection+' button on top left.<br>
  b) Enter the stored Link in the 'URI' section and click on connect.<br>
  c) If you have added some products into the database you will see 'shops' in the menu on the left side. Click on it to explore the different collections we have inserted in the database.<br>
