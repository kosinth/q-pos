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

    
    let sell = req.body
    //console.log(sell.length)
    console.log(sell)

    let order_seq=0
    let prodt_id=0
    let prodt_qty=0
    let prodt_price=0

    //insert to table tbOrder
    console.log(' Jaaa ',sell[sell.length-1].sell_item)
    console.log(' Jaaa ',sell[sell.length-1].sell_totalprice)
    console.log(' Jaaa ',sell[sell.length-1].sell_sumtotalprice)
    console.log(' Jaaa ',sell[sell.length-1].sell_payment)


    for(let i=0;i<sell.length-1;i++){
        for(let j=0;j<sell[i].length;j++){
            //console.log('Row : ', sell[i][j])
            order_seq = sell[i][0]
            prodt_id = sell[i][1]
            prodt_qty = sell[i][2]
            prodt_price = sell[i][3]
        }
        //insert to table tbOrder_detail
        console.log(order_seq + " " + prodt_id + " " +  prodt_qty + " " + prodt_price)
    }

    // const db = await conn('TestDB');
    // if(db){
    


    //     // try{
    //     //     const results = await db.query('INSERT INTO tbProduct  SET ?',product)
    //     //     //console.log('result : ',results)
    //     //     // Close the connection
    //     //      res.json({
    //     //          product : 'insert Ok',
    //     //          data : results[0]
    //     //      })
    //     //      db.end();
        
    //     // }catch(error){
    //     //     res.status(500).json({
    //     //         err : ' มีข้อผิดพลาด ',
    //     //         msg : error.message
    //     //     })
    //     //     db.end();
    //     //     console.error('Error:file name->product.js|path api post[/product] =>',error.message)
    //     // }
    
    
    
    // }else{
    //     res.status(500).json({
    //         err : 'มีข้อผิดพลาด : ',
    //         msg : 'Error:file name->product.js|path api post[/product]|Connection to Database fail ---> Error Access denied'   
    //     })
    // }    

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
                //console.log('serve : ',url)
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
