const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const conn = require('../config/configdb');

// Get all procudt
router.get('/getallproduct', async(req, res) => {
    
    const db = await conn('TestDB');
    if(db){
        try{
            const results = await db.query('SELECT *,DATE_FORMAT(dt_timestamp, "%d/%m/%Y") AS "dt_name" FROM Register;');
            res.json(results[0]);
            db.end();

        }catch(error){
            console.error('Error : file name->product.js |api path :/getallproduct' ,error.message);
            res.status(500).json({
                err : 'มีข้อผิดพลาด : ',
                msg : error.message
            })
            db.end();
        }

    }else{
        res.status(500).json({
            err : 'มีข้อผิดพลาด : ',
            msg : 'Error : file name->product.js |api path :/getallproduct |Connection to Database fail ---> Error Access denied'   
        })
    }  

});


//get by id
router.get('/product/:id',async(req,res)=>{
    //res.send('Hello get product By ID One Product ');
    let id = req.params.id
    const db = await conn('TestDB');
    if(db){

        try{
            const results = await db.query('SELECT * FROM  Register WHERE ID = ?',id)
            //console.log('result : ',results[0].length)
            if (results[0].length>0){
                res.json({ 
                    product : 'Get ID Ok',
                    data : results[0]
                })
            }else{
                res.status(404).json({ 
                    product : 'ไม่พบข่อมูล..',
                    data : results[0]
                })
            }
            db.end();
    
        }catch(error){
            res.status(500).json({
                err : ' มีข้อผิดพลาด ',
                msg : error.message
            })
            db.end();
            console.error('Error:file name->product.js|path api get[/product/:id] =>',err.message)
        }

    }else{
        res.status(500).json({
            err : 'มีข้อผิดพลาด : ',
            msg : 'Error:file name->product.js|path api get[/product/:id]|Connection to Database fail ---> Error Access denied'   
        })
    }   

})

//post create -Insert
router.post('/product', async(req,res)=>{

    let product = req.body
    //console.log(req.body)
    const db = await conn('TestDB');
    if(db){
        try{
            const results = await db.query('INSERT INTO Register  SET ?',product)
            //console.log('result : ',results)
            // Close the connection
             res.json({
                 product : 'insert Ok',
                 data : results[0]
             })
             db.end();
        
        }catch(error){
            res.status(500).json({
                err : ' มีข้อผิดพลาด ',
                msg : error.message
            })
            db.end();
            console.error('Error:file name->product.js|path api post[/product] =>',error.message)
        }
    }else{
        res.status(500).json({
            err : 'มีข้อผิดพลาด : ',
            msg : 'Error:file name->product.js|path api post[/product]|Connection to Database fail ---> Error Access denied'   
        })
    }    


})

//put  update by id 
router.put('/product/:id',async(req,res)=>{
    
    let id = req.params.id
    let updateProduct = req.body
    const db = await conn('TestDB');
    if(db){
        try{
            //let user = req.body
            const results = await db.query(
                'UPDATE Register SET ? WHERE id = ? ',
                [updateProduct,id]
            )
            //console.log('result : ',results)
            res.json({
                product : 'update Ok',
                data : results[0]
            })
            db.end();
        
        }catch(error){
            res.status(500).json({
                err : ' มีข้อผิดพลาด ',
                msg : error.message
            })
            db.end();
            console.error('Error:file name->product.js|path api put[/product/:id] =>',error.message)
        }

    }else{
        res.status(500).json({
            err : 'มีข้อผิดพลาด : ',
            msg : 'Error:file name->product.js|path api put[/product/:id]| Connection to Database fail ---> Error Access denied'   
        })
    }    


})


router.delete('/product/:id',async(req,res)=>{

    let id = req.params.id
    const db = await conn('TestDB');
    if(db){
        try{
            const results = await db.query('DELETE FROM Register WHERE ID = ?',id)
            //console.log('result : ',results[0].length)
            res.json({
                product : 'delete Ok',
                data : results[0]
            })
            db.end();
        
        }catch(error){
            res.status(500).json({
                err : ' มีข้อผิดพลาด ',
                msg : error.message
            })
            db.end();
            console.error('Error,product.js,path api delete[/product/:id] =>',error.message)
        }

    }else{
        res.status(500).json({
        err : 'มีข้อผิดพลาด : ',
        msg : 'Error,product.js,path api delete[/product/:id]|Connection to Database fail ---> Error Access denied'   
        })
    } 

})

module.exports = router;
