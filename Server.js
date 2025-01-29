const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

const receipts = {};

// Function to calculate points based on rules
function calculatePoints(receipt) {
    let points = 0;

    // 1. One point for every alphanumeric character in the retailer name
    points += (receipt.retailer.match(/[a-zA-Z0-9]/g) || []).length;

    // 2. 50 points if the total is a round dollar amount with no cents
    if (parseFloat(receipt.total) % 1 === 0) {
        points += 50;
    }

    // 3. 25 points if the total is a multiple of 0.25
    if (parseFloat(receipt.total) % 0.25 === 0) {
        points += 25;
    }

    // 4. 5 points for every two items on the receipt
    points += Math.floor(receipt.items.length / 2) * 5;

    // 5. If trimmed item description length is a multiple of 3, award points
    receipt.items.forEach((item) => {
        let desc = item.shortDescription.trim();
        if (desc.length % 3 === 0) {
            points += Math.ceil(parseFloat(item.price) * 0.2);
        }
    });

    // 6. 6 points if the day of purchase date is odd
    const purchaseDate = new Date(receipt.purchaseDate);
    if (purchaseDate.getDate() % 2 !== 0) {
        points += 6;
    }

    // 7. 10 points if the purchase time is between 2:00 PM and 4:00 PM
    const [hour, minute] = receipt.purchaseTime.split(":").map(Number);
    if (hour === 14 || (hour === 15 && minute >= 0)) {
        points += 10;
    }

    return points;
}

app.get("/", (req, res) => {
    res.send("Receipt Processor API is running. Use /receipts/process to submit receipts.");
});


// POST /receipts/process - Store receipt and return an ID
app.post("/receipts/process", (req, res) => {
    const receipt = req.body;

    if (!receipt.retailer || !receipt.purchaseDate || !receipt.purchaseTime || !receipt.items || !receipt.total) {
        return res.status(400).json({ error: "Invalid receipt format" });
    }

    const id = uuidv4();
    const points = calculatePoints(receipt);

    receipts[id] = points;
    res.json({ id });
});

// GET /receipts/{id}/points - Retrieve points for a given receipt ID
app.get("/receipts/:id/points", (req, res) => {
    const id = req.params.id;

    if (!receipts[id]) {
        return res.status(404).json({ error: "Receipt not found" });
    }

    res.json({ points: receipts[id] });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
