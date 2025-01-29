const fs = require('fs');
const axios = require('axios');

const jsonData = fs.readFileSync('receipt.json', 'utf8');

axios.post('http://localhost:3000/receipts/process', JSON.parse(jsonData), {
    headers: { "Content-Type": "application/json" }
}).then(response => {
    console.log("Response:", response.data);
}).catch(error => {
    console.error("Error:", error.response ? error.response.data : error.message);
});
