# ReceiptProcessor

Setting Up and Running the Receipt Processor API

1. Install Node.js
   Download and install Node.js from [https://nodejs.org/](https://nodejs.org/).
   Verify installation:
     node -v
     npm -v
     
2. Initialize a Node.js Project
   Create a new project folder and initialize npm:
     mkdir receipt-processor
     cd receipt-processor
     npm init -y
     
3. Install Required Packages
   Install Express.js for server setup:
     npm install express uuid
   If using 'axios' for sending requests:
     npm install axios

4. Create and Write Server Code
   Create 'Server.js' in the project folder.
   Implement Express server to handle API routes.
   Define "POST /receipts/process" and "GET /receipts/{id}/points".
   Better to create default route for avoiding errors "/".

5. Run the Server
   Start the Node.js server:
     node server.js
   If using nodemon for auto-restart:
     npm install -g nodemon
     nodemon server.js

6. Sending Data to Server (POST)
   Using cURL (Command Line):
     curl -X POST "http://localhost:3000/receipts/process" \
          -H "Content-Type: application/json" \
          -d @receipt.json
   Using Postman:
     1. Open Postman.
     2. Set method to 'POST' and URL to 'http://localhost:3000/receipts/process'.
     3. Select "Body" -> "raw" -> "JSON" and enter receipt data.
     4. Click "Send".
   Using sendRequest.js(Node.js Script):
     1. Create 'sendRequest.js'.
     2. Read JSON data from 'receipt.json' and send a 'POST' request using 'axios'.
     3. Run:
        node sendRequest.js

7. Retrieving Data (GET Request)
   - Get receipt points using the ID returned from 'POST' request:
     curl -X GET "http://localhost:3000/receipts/{id}/points"
   - Replace '{id}' with the actual receipt ID.

8. Using Docker
   Create a 'Dockerfile' and build the image:
     docker build -t receipt-processor 
   Run the container:
     docker run -p 3000:3000 receipt-processor
