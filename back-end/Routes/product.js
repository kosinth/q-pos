const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const conn = require('../config/configdb');

router.get('/getuser', async(req, res) => {
    try{
        const db = await conn('TestDB');
        const results = await db.query('SELECT *,DATE_FORMAT(dt_timestamp, "%d/%m/%Y") AS "dt_name" FROM Register;');
        res.json(results[0]);

    }catch(err){
        console.error('Error : api path : /getuser' ,err.message);
        res.status(500).json({
            err : 'มีข้อผิดพลาด : ',
            message : err.message
        })
    }

});

//get by id
router.get('/product/:id',(req,res)=>{
    res.send('Hello get product By ID One Product ');
})

//post create 
router.post('/product',(req,res)=>{
    res.send('Hello post product endpoint 555');
})

//put  update by id 
router.put('/product/:id',(req,res)=>{
    res.send('Hello Put  Updage by ID product endpoint 555');
})

router.delete('/product/:id',(req,res)=>{
    res.send('Hello Delete By ID  endpoint 555');
})

module.exports = router;
