const express = require('express');
const app = express();
var cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const corsOptions = {
    origin: 'http://localhost:5173',
};
app.use(cors(corsOptions));

app.use(express.static('public'));


app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },  
}));


const db = require("./models");
db.sequelize.sync().then(() => {
    console.log("db resync");
});


require('./routes')(app);  



app.use(function (error, req, res, next) {
    if (error instanceof SyntaxError) {
        res.status(400).json({
            msg: 'Error en el JSON'
        });
    } else {
        next();
    }
});

app.listen(3000, function () {
    console.log('Servidor corriendo en http://localhost:3000');
});
