const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const feed = require('feed-read');
//const { response } = require('express');

async()=>{
    console.log("asds")
}

const urls = [
    "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",
    "https://www.yahoo.com/news/rss"
];

mongoose.connect(
    "mongodb+srv://tchakanyalcin:"+ 
    process.env.MONGO_ATLAS_PW +
    "@cluster0.qip3e.mongodb.net/node-rest-shop?retryWrites=true&w=majority", 
    {
        //useMongoClient : true
    }
);

console.log("dsdfsf");

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next)=> {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Tpye, Accept, Authorization"
    );
    if(req.method === 'OPTION'){
        res.header('Access-Control-Allow-Methods', 'GET, PUT, DELETE, PATCH, POST');
        return res.status(200).json({});
    }
    next();
});


function get_a_single_feed(url){
    return new Promise((resolve,reject)=>{
        var response = []
        feed(url, function(err,items) {
            console.log("feed done")
            if(err){
                reject(err);
            }
            items.forEach(element => { 
                response.push({
                    "new":element.title,
                    "description": element.link
                });
            })
            resolve(response)
        });
    }) 
}



async function controller(req, res, next){
    var response = []
    for(var i=0;i<urls.length;i++){
        var temp_response = await get_a_single_feed(urls[i])
        response=response.concat(temp_response)
    }
    res.status(200).send(response)
}


app.use(controller);

  

module.exports = app;