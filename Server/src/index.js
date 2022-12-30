const express = require('express');
const route = require('./routes/route');
const mongoose= require('mongoose');
const cors=require('cors');



const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://Priyanka19:G8reXRlHUbBX65ev@plutonium01.9fxu8wj.mongodb.net/RealTimeApp", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected with RealTimeApp Data"))
.catch ( err => console.log(err) )


app.use('/', route)


app.listen(5000, ()=> {
    console.log(`Express app running on port>>>>>>>  ${5000}`)
});