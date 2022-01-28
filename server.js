var express = require("express")
var app = express()
var sqlite3 = require('sqlite3').verbose()
var md5 = require("md5")

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const db = new sqlite3.Database('bdd.db', (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    };
});

var HTTP_PORT = 8000

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});

app.post("/api/",(req,res, next) =>{
    var errors = []
    if(!req.body.dbname){
        errors.push("No name specified for the table")
    }
    if(!req.body.columns){
        errors.push("No column specified")
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    if(!req.body.key){
        var key = "id INTEGER PRIMARY KEY AUTOINCREMENT"
    }else{
        var key = req.body.key
    }
    var sql = `CREATE TABLE IF NOT EXISTS ${req.body.dbname} (${key},${req.body.columns});`
    console.log(sql)
    db.run(sql,err => {
        if (err) {
            errors.push("The table could not be created.")
            console.log(errors)
        }
    })
    res.send('fini')
})

app.get("/api/:dbname", (req, res, next) => {
    var sql = `select * from ${req.params.dbname}`
    var param = []
    db.all(sql, param, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

app.get("/api/:dbname/:id", (req, res, next) => {
    var sql = `select * from ${req.params.dbname} where id = ${req.params.id}`
    var param = []
    db.get(sql, param, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
      });
});

app.get("/api/:dbname/:column/:elt",(req,res, next)=>{
    var sql = `select * from ${req.params.dbname} where ${req.params.column} = '${req.params.elt}'`
    var param = []
    db.get(sql, param, (err, row) =>{
        if (err){
            res.status(400).json({"error":err.message});
            return;
        }
        console.log(row)
        res.json({
            "message":"succes",
            "data":row
        })
    });
});


app.post("/api/add/", (req, res, next) => {
    var errors=[]
    if (!req.body.dbname){
        errors.push("No dbname specified for the table");
    }
    if (!req.body.columns){
        errors.push("No column specified");
    }
    if(!req.body.values){
        errors.push("No values specified")
    }
    if (errors.length){
                                  res.status(400).json({"error":errors.join(",")});
        return;
    }
    var sql = `INSERT INTO ${req.body.dbname} (${req.body.columns}) VALUES (${req.body.values})`
    console.log(sql)
    var params =[]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "id" : this.lastID
        })
    });
})



app.patch("/api/patch", (req, res, next) => {
    var data = {
        dbname: req.body.dbname,
        id: req.body.id,
        changes : req.body.changes
    }
    sql = `UPDATE ${data.dbname} set ${data.changes} WHERE id = ${data.id}`
    db.run(sql, [], (err, result) => {
        if (err){
            console.log('aïe')
            res.status(400).json({"error": res.message})
            return;
        }
        res.json({
            message: "success",
            data: data
        })
    });
})


app.delete("/api/:dbname/:id", (req, res, next) => {
    var sql = `DELETE FROM ${req.params.dbname} WHERE id = ${req.params.id}`
    var param = []
    db.run(sql, param, function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", rows: this.changes})
    });
})

// Root path
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});

