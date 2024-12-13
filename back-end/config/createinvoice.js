const fs = require('fs');
const PDFDocument = require('pdfkit');
const router = express.Router();

router.post('/sell/createinvoice', async(req,res)=>{

	let doc = new PDFDocument({ 
        margins: { top: 10, bottom: 10, left: 10, right: 10 },
        size: 'A4',
        layout: 'portrait' // 'portrait' or 'landscape'
    });

    //Set fonts
	doc.registerFont('Sarabun', `fonts/Sarabun-Thin.ttf`)
	doc.font('Sarabun')

	generateHeader(doc); // Invoke `generateHeader` function.
	generateFooter(doc); // Invoke `generateFooter` function.

	doc.end();
	doc.pipe(fs.createWriteStream(path));
	//return doc
    //sent to Http:
    doc.pipe(res);
	//show in Html
    //<embed src="file_name.pdf" width="800px" height="2100px" />



})



 createInvoice = async(invoice, path)=> {

}

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

module.exports = {
	createInvoice,
	router
};