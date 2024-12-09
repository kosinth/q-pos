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
router.post('/sell/create', async(req,res)=>{

    let sell = req.body
    //console.log('Req sell Body : ',sell)
    let order_seq=0
    let prodt_id=0
    let prodt_qty=0
    let prodt_price=0
    let order_id = 0

    const db = await conn('TestDB');
    if(db){
        try{
            let resData =[] 
            const results = await db.query('select case when max(order_id) is null then 0 else max(order_id) end as order_id from tbOrder where order_id')
            order_id = results[0][0].order_id 
            order_id = order_id +1
            console.log('Generate Order ID  : ',order_id)
            let dataorder = {
                order_id: order_id,
                order_list_cnt: sell[sell.length-1].sell_item,
                order_total: sell[sell.length-1].sell_totalprice,
                order_sum_total: sell[sell.length-1].sell_sumtotalprice,
                order_payment: sell[sell.length-1].sell_payment
            }
            console.log('Insert tbOrder : ',dataorder)
            resData.push(dataorder)
            const resultsInsert = await db.query('INSERT INTO tbOrder  SET ?',dataorder)
            //console.log('Result Insert tbOrder : ',resultsInsert)

           for(let i=0;i<sell.length-1;i++){
                let multirow = []
                let row =''
                for(let j=0;j<sell[i].length;j++){
                    //console.log('Row : ', sell[i][j])
                    order_seq = sell[i][0]
                    prodt_id = sell[i][1]
                    prodt_qty = sell[i][2]
                    prodt_price = sell[i][3]
                }
  
                row= [order_id,order_seq, prodt_id, prodt_qty,prodt_price]
                multirow.push(row)
                //insert to table tbOrder_detail
                console.log('deJaaa :  ',multirow)
                resData.push(multirow)

                const results =await db.query(`insert into tbOrder_details
                    (order_id,order_seq,prodt_id,prodt_qty,prodt_price)
                    values ?`,
                    [multirow]
                )

            }
            console.log('Result : ',' Insert table tbOrder/tbOrder_details  Success...')
            db.end();
            res.setHeader('Content-Type', 'text/plain');
            return res.status(200).send(resData)

        }catch(err){
            res.status(500).json({
                err : ' มีข้อผิดพลาด ',
                msg : err.message
            })
            db.end();
            console.error('Error:file name->sell.js|path api post[/sell/create] =>',err.message)
        }

    }else{
        res.status(500).json({
             err : 'มีข้อผิดพลาด : ',
             msg : 'Error:file name->sell.js|path api post[/sell/create]|Connection to Database fail ---> Error Access denied'   
        })
    } 

    // random pad string 4 digit
    /*
        let val = Math.floor(1000 + Math.random() * 9000);
        //console.log(val);
        //pad string
        const zeroPad = (num, places) => String(num).padStart(places, '0')
        console.log(zeroPad(val, 4)); // "0005"
    */

})

router.post('/sell/generateQR/:amount', async(req,res)=>{

    let amount = req.params.amount
    amount = parseFloat(amount)
    // Get promtpay no.
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

})

module.exports = router;
