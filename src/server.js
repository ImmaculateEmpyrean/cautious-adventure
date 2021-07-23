if(process.argv[2] === "DEV"){
    console.log('setting the server to run in development mode..');
    process.env.NODE_ENV = "development";
} else{
    console.log('setting the server to run in production mode..');
    process.env.NOED_ENV = 'production';
}

//getting all the required libraries
const path = require('path');
const {readFile,writeFile} = require("fs").promises;
const {htmlParser} = require("node-html-parser");
const nodemailer = require("nodemailer");
const express = require('express');

//connect to the database in question for this project
const {Client} = require('pg');
const database = new Client({
    user:"empyreanbot",
    password: "ns782110",
    host: "localhost",
    port: "5432",
    database: "budgetapp"
});
database.connect().then(function(){
    console.log('connected to the database successfully...');
}).then(function(){
    database.end();
})


//setting up the app also to handle post requests
const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('./www'));

//setting up the server
let port = process.env.PORT || 5000;
app.listen(port,function(){
    console.log(`server started listening on port ${port}`);
})

//setup the only main get request
app.get("/",function(req,res){
    res.sendFile(path.resolve(__dirname,"./www/index.html"));
})

//this method is used to get the records to be displayed to the user..
app.get("/records",async function(req,res){
    // req.query has all the key value pairs
    console.log(req.query);

    let transactionClause = null;
    if(req.query.transactionType === 'Credit')  transactionClause = 'transaction > 0';
    else if(req.query.transactionType === 'Debit') transactionClause = 'transaction < 0';
    else transactionClause = 'transaction < 0 and transaction > 0';
    
    let offsetBy = Number(Number(req.query.pageNumber) - 1) * Number(req.query.rowsPerPage);
    console.log(offsetBy);

    const database = new Client({
        user:"empyreanbot",
        password: "ns782110",
        host: "localhost",
        port: "5432",
        database: "budgetapp"
    });

    try{
        await database.connect(); //connect to the database in question
        let result = await database.query(`select * from budgetrecord\
                                           where ${transactionClause} and\
                                           instigator='${req.query.instigator}' and\
                                           dateandtime BETWEEN '${req.query.startDate}' AND '${req.query.endDate}'\
                                           order by id\
                                           offset ${offsetBy}\
                                           limit ${req.query.rowsPerPage}                                        
                                           `);
        
        res.json(result.rows);
    }
    catch (error){
        console.log(error);
    }
    finally{
        database.end();
    }
});


app.get("/getRecord",async function(req,res){
    const database = new Client({
        user:"empyreanbot",
        password: "ns782110",
        host: "localhost",
        port: "5432",
        database: "budgetapp"
    });

    try{
        await database.connect(); //connect to the database in question
        let result = await database.query(`select * from budgetrecord\
                                           where id=${req.query.id}
                                           limit 1                                        
                                           `);
        res.json(result.rows);
    }
    catch (error){
        console.log(error);
    }
    finally{
        database.end();
    }
});

app.get("/getRemainingBalance",async function(req,res){
    let remainingbalance = 0;

    try{
        const database = new Client({
            user:"empyreanbot",
            password: "ns782110",
            host: "localhost",
            port: "5432",
            database: "budgetapp"
        });
        
        await database.connect();
        let result = await database.query(`select * from budgetrecord order by id desc limit 1`);
        remainingbalance = result.rows[0].remainingbalance;
    }
    catch(error){
        console.log("trying to get the number of records");
        console.log(error);
    }
    finally{
        database.end();
    }

    res.json({
        remainingbalance: remainingbalance
    })
})

app.get("/getNumberOfRecords",async function(req,res){
    let result =0;

    try{
        const database = new Client({
            user:"empyreanbot",
            password: "ns782110",
            host: "localhost",
            port: "5432",
            database: "budgetapp"
        });
        
        await database.connect();
        result = await database.query(`select * from budgetrecord order by id desc limit 1`);
        result = result.rows[0].id;
    }
    catch(error){
        console.log("trying to get the number of records");
        console.log(error);
    }
    finally{
        database.end();
    }

    res.json({
        numberOfRecords: result
    });
});

//this method is used to post a new record into the database..
app.post("/records",async function(req,res){
    try{
        const database = new Client({
            user:"empyreanbot",
            password: "ns782110",
            host: "localhost",
            port: "5432",
            database: "budgetapp"
        });
        
        await database.connect(); //connect to the database in question
        await database.query('begin'); //start the transaction in question

        let result = await database.query(`select * from budgetrecord order by id desc limit 1`);
        let remBalance = Number(result.rows[0].remainingbalance) + Number(req.body.transaction);

        await database.query(`insert into budgetrecord(instigator,comment,dateandtime,transaction,remainingbalance) values ('${req.body.instigator}','${req.body.comment}',Now(),${req.body.transaction},${remBalance});`);
        
        await database.query('commit'); //the transaction is finished.. reflect the changes inside the db
    } catch (error) {
        console.log(`error ocurred while communicating with the database ${error}`)
        await database.query('rollback');
        res.json({
            success: false
        })
    }
    finally {
        database.end();
        console.log("closed connection to the database successfully")
        res.json({
            success: true
        })
    }
})