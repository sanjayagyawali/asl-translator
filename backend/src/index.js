const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.status(200).send({
        message: "LOOK IAN IT WORKS"
    })
});


app.listen(process.env.PORT || 5000);