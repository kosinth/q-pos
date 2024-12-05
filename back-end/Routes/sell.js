const express = require('express')
const router = express.Router();
const mysql = require('mysql2/promise');
const conn = require('../config/configdb');
const QRCode = require('qrcode')
const generatePayLoad = require('promptpay-qr')


// app.get('/user/:shopid/:id',async(req,res) =>{
//     const id = req.params.id
//     const shopid = req.params.shopid
//     console.log(shopid)
//     //const db = await conn('TestDB');
//     const db = await conn(shopid);

//post Insert - create
router.post('/sell', async(req,res)=>{

    let product = req.body
    //console.log(req.body)
    const db = await conn('TestDB');
    if(db){
        try{
            const results = await db.query('INSERT INTO tbProduct  SET ?',product)
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


router.post('/sell/generateQR/:amount', async(req,res)=>{

    let amount = req.params.amount
    amount = parseFloat(amount)
    const mobile_no = '0857144983'
    const payload = generatePayLoad(mobile_no,{amount})
    const option ={
            color : {
            dark : '#000',
            light : '#fff'
            }
          }
        QRCode.toDataURL(payload,option,(err,url) =>{
            if(err){
                console.log('generate QRcode fail..')
                res.status(400).json({
                    err : ' มีข้อผิดพลาด generate QRcode fail..  ',
                    msg : err.message
                })
            }else{
                console.log('serve : ',url)
                res.status(200).json({
                    data: url
                })
            }
          
        })


    // const db = await conn('TestDB');
    // if(db){
    //     try{
    //         // const results = await db.query('INSERT INTO tbProduct  SET ?',product)
    //         //console.log('result : ',results)
    //         // Close the connection

            
            
            
    //         res.json({
    //              product : 'insert Ok',
    //              data : results[0]
    //          })
    //         //db.end();
        


    //     }catch(error){
    //         res.status(500).json({
    //             err : ' มีข้อผิดพลาด ',
    //             msg : error.message
    //         })
    //         db.end();
    //         console.error('Error:file name->product.js|path api post[/product] =>',error.message)
    //     }
    // }else{
    //     res.status(500).json({
    //         err : 'มีข้อผิดพลาด : ',
    //         msg : 'Error:file name->product.js|path api post[/product]|Connection to Database fail ---> Error Access denied'   
    //     })
    // }    

})


module.exports = router;
