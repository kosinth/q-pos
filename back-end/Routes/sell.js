const express = require('express')
const router = express.Router();
const mysql = require('mysql2/promise');
const conn = require('../config/configdb');
const QRCode = require('qrcode')
const generatePayLoad = require('promptpay-qr')
const fs = require('fs');
const PDFDocument = require('pdfkit');

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
            console.log('file:sell.js[ api:/sell/create ]',' Insert tbOrder/tbOrder_details---> ok')
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
                console.log('file:sell.js[ api:/sell/enerateQR ]-->','ok')
                res.status(200).json({
                    data: url
                })
            }
          
        })

})

const invoice = {
	shipping: {
		name: 'John Doe',
		address: '1234 Main Street',
		city: 'San Francisco',
		state: 'CA',
		country: 'US',
		postal_code: 94111,
	},
	items: [
		{
			item: 'TC 100',
			description: 'Toner Cartridge',
			quantity: 2,
			amount: 6000,
		},
		{
			item: 'USB_EXT',
			description: 'USB Cable Extender',
			quantity: 1,
			amount: 2000,
		},
	],
	subtotal: 8000,
	paid: 0,
	invoice_nr: 1234,
};


router.post('/sell/generateInvoice', async(req,res)=>{
    let inv = req.body  
    console.log('Inv: ',inv.sell_item)
    console.log('Inv: ',inv.detail)

    console.log('Inv: ',inv.sell_item)
    console.log('Inv: ',inv.detail.length)

    
    //const myArray = text.split(" ");

    //sell_item: cntitem,
    //sell_totalprice: parseFloat(pricetotal),
    //sell_sumtotalprice: parseFloat(sumamtall),
    //sell_payment: payment



    // for(let i =0;i<myArray.length;i++){
    //     //for(let j =0;j<myArray[i].length;j++){
    //         console.log(myArray[i]) 
    //     //}

    // }

    try{
        let doc = new PDFDocument({ 
            margins: { top: 10, bottom: 10, left: 10, right: 10 },
            size: 'A7',
            layout: 'portrait' // 'portrait' or 'landscape'
        });

        //Set fonts
        doc.registerFont('Sarabun', `fonts/Sarabun-Thin.ttf`)
        doc.font('Sarabun')

        generateHeader(doc); // Invoke `generateHeader` function.
        generateFooter(doc); // Invoke `generateFooter` function.
        doc.end();
        //let path = 'pdf/invoice.pdf'
        //doc.pipe(fs.createWriteStream(path));
        console.log('file:sell.js[ api:/sell/generateInvoice ]-->','ok')
        res.contentType('application/pdf');
        doc.pipe(res);

    }catch(err){
        res.status(500).json({
            err : ' มีข้อผิดพลาด ',
            msg : err.message
        })
        console.error('Error,sell.js,path api /sell/generateInvoice] =>',err.message)
    }

})

generateHeader =(doc) =>{
	
	doc.image('exit_2.jpg', 50, 45, { width: 50 })
		.fillColor('#444444')
		.fontSize(20)
		.text('ACME Inc.', 110, 57)
		.fontSize(10)
		.text('123 Main Street', 200, 65, { align: 'right' })
		.text('New York, NY, 10025', 200, 80, { align: 'right' })
		.moveDown();
}

generateFooter =(doc)=> {
	doc.fontSize(
		10,
	).text(
		'ทดสอบภาษาไทย แล้วจ้าเป็นอย่างไรบ้างเน้อ.',
		50,
		780,
		{ align: 'center', width: 500 },
	);
}

 generateCustomerInformation =(doc, invoice) =>{
    const customerInformationTop = 200;
  
    doc
      .fillColor("#444444")
      .fontSize(20)
      .text("Invoice", 50, 160);
  
    generateHr(doc, 185);
  
    doc
      .fontSize(10)
      .text("Invoice Number:", 50, customerInformationTop)
      .font("Helvetica-Bold")
      .text(invoice.invoice_nr, 150, customerInformationTop)
      .text("Invoice Date:", 50, customerInformationTop + 15)
      .text(formatDate(new Date()), 150, customerInformationTop + 15)
      .text("Balance Due:", 50, customerInformationTop + 30)
      .text(formatCurrency(invoice.subtotal - invoice.paid), 150, customerInformationTop + 30)
      .font("Helvetica-Bold")
      .text(invoice.shipping.name, 300, customerInformationTop)
      .font("Helvetica")
      .text(invoice.shipping.address, 300, customerInformationTop + 15)
      .text(`${invoice.shipping.city}, ${invoice.shipping.state}, ${invoice.shipping.country}`, 300, customerInformationTop + 30)
      .moveDown();
  
    generateHr(doc, 252);
  }

  generateTableRow =(doc, y, c1, c2, c3, c4, c5) =>{
	doc.fontSize(10)
		.text(c1, 50, y)
		.text(c2, 150, y)
		.text(c3, 280, y, { width: 90, align: 'right' })
		.text(c4, 370, y, { width: 90, align: 'right' })
		.text(c5, 0, y, { align: 'right' });
}

generateInvoiceTable =(doc, invoice) =>{
	let i,
		invoiceTableTop = 330;

	for (i = 0; i < invoice.items.length; i++) {
		const item = invoice.items[i];
		const position = invoiceTableTop + (i + 1) * 30;
		generateTableRow(
			doc,
			position,
			item.item,
			item.description,
			item.amount / item.quantity,
			item.quantity,
			item.amount,
		);
	}
}

module.exports = router;
