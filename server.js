const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./src/config/db.connect")();
require('./src/routes/transaction.routes')(app);

app.get("/", (req, res) => {
    res.json({ message: 'Welcome!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});