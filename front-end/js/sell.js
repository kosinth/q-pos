    let productName = '';
    let sel = document.getElementById('prod_Select');
    let domunitprice = document.getElementById('unitPrice')
    let domtotal = document.getElementById('amount')
    let selectedRadio = 'cash'
    let payment =0
    let getrowInv = [];
    let saveSucces =0
    let fg_validate =false
    let fg_newTrans =false

    sel.onchange = function(evt) {
        let unitpricearr = [] 
        let unitprice = 0
        let allData = ""; 
        let option = evt.target.options[evt.target.selectedIndex];
        allData += option.innerHTML;
        console.log('Print  xxx : ',allData)
        productName = allData.substring(0,allData.search(/\|/))
        if(productName){
            console.log('Print  yyy : ',productName)
            allData += " value: " + option.value;
            //const arrDelId = id.split("^")
            unitpricearr = option.value.split("|")
            unitprice = unitpricearr[1]
            console.log('UNitPrice :  ', unitprice)
            domunitprice.innerText = setAmountFormatTh(unitprice)

            //let getqty = document.getElementById('qty').value
            let domqty = document.querySelector('input[name=qtybtn]')
            domqty.value = '1'
            let cntqty = parseInt(domqty.value)
            unitprice =  parseFloat(unitprice)
            let total =  unitprice * cntqty
            domtotal.innerText = setAmountFormatTh(total)
       }
       document.getElementById('btnInsert').focus()

    };

    const products = async() => {
        const arr = [];
        let options_str = '';
        let errmsg = document.getElementById('errMsg')

        try{

            const response = await axios.get('http://localhost:5000/api/product/getall')
            console.log('sell :',response.data.length)
            options_str += '<option value="' + '0' +'">' + '--- เลือกสินค้า ---- '+  '</option>';
            for (let i =0;i<response.data.length;i++){
              let product = response.data[i]
              console.log('Prduct INFO ; ',product.prodt_id + "  "+product.prodt_name + " "+ product.prodt_price)
              options_str += '<option value="' + product.prodt_id+"|"+product.prodt_price +'">' + product.prodt_name + " | " +product.prodt_short +  '</option>';
            }
            sel.innerHTML = options_str;

        }catch(err){
            let messageErr = ''
            if(err.response){
                console.log(err.response.data.msg)
                messageErr = err.response.data.err + " " +err.response.data.msg
                //errmsg.style.color = 'red'
            }else{
                messageErr = 'มีข้อผิดพลาด: ' +err.message+ "---> ไม่สามารถเชื่อมต่อ Server ได้...! "
                console.log(messageErr)

            }
            errmsg.innerText = messageErr
            errmsg.style.color = 'red'
            
        }  
        return arr;

    };
    const resultArr =  products();

window.onload = function() {

    document.body.appendChild(sel);
    document.getElementById('prod_Select').focus();

    // // random 4 digit
    //  let val = Math.floor(1000 + Math.random() * 9000);
    // //console.log(val);

    // //pad string
    // const zeroPad = (num, places) => String(num).padStart(places, '0')
    // console.log(zeroPad(val, 4)); // "0005"

};

changeQty = ()=>{

    let unitprice = document.getElementById('unitPrice');
    let domqty = document.querySelector('input[name=qtybtn]')
    let amount = document.getElementById('amount');

    let cnvqty = parseInt(domqty.value)
    //console.log(' 555 '+unitprice.innerText)  //clearAmountSymbol
    let cnvunitPrice =  parseFloat(clearAmountSymbol(unitprice.innerText))
    //let cnvunitPrice =  parseFloat(unitprice.innerText.replace(/[฿,]/g,""))
    //console.log(' 555 '+cnvunitPrice)  //clearAmountSymbol
    //let costPrice = cnvunitPrice.replace(/[฿,]/g,"")
    let result = cnvunitPrice* cnvqty
    //console.log(' 555 '+result)
    amount.innerText = setAmountFormatTh(result)

}

calcAmount = ()=>{

    //let sum_all=0;
    let sum_amt =0;
    let contprice=0;
    let amt_discnt = 0;

    let sumamtall = document.getElementById('sum_amt_all')
    let sumamt = document.getElementById('sum_amt_obj')
    let bDiscnt = document.getElementById('b_discnt')
    let disCount = document.getElementById('discount')
    //var outputDiv = document.querySelector('#output') 

    let table = document.getElementById('myTable');
    let item =0;
    //let totalprice = 0;
    for (var i = 1; i < table.rows.length; i++) {
        buff=''
        if(table.rows[i].cells.length) {
            let brand = (table.rows[i].cells[0].textContent);
            console.log( ' สินค้า :' +brand)
            let qty = (table.rows[i].cells[1].children[0].value);
            let cntqty = parseInt(qty)
            console.log( ' จำนวน :' +cntqty)

            let unitprice = (table.rows[i].cells[3].textContent);
            console.log(' ราคาต่้อหน่วย  :  ' +unitprice); 
            unitprice = parseFloat(unitprice)
            let totalprice = unitprice*cntqty ;
            table.rows[i].cells[2].innerText = setAmountFormatTh(totalprice);
            
            let price = (table.rows[i].cells[2].textContent);
            console.log(' ราคา :  ' +price);  
            price = price.trim();
            contprice = parseFloat(clearAmountSymbol(price));
            sum_amt =sum_amt + contprice;
            item++;
        } 
    }
    let sumitem = document.getElementById('item') 
    sumitem.innerText =  item + "  รายการ "
    let getDist =bDiscnt.value;
    amt_discnt = sum_amt*getDist/100;
    sumAll = sum_amt-amt_discnt;
    // ปัดเศษทศนิยม
    //sumAll = Math.ceil(sumAll);
    disCount.innerText =  setAmountFormatTh(amt_discnt);
    sum_amt = setAmountFormatTh(sum_amt);
    sumAll = setAmountFormatTh(sumAll);
    sumamt.innerText = sum_amt;
    sumamtall.innerText = sumAll;

    let sumcheckbill = document.getElementById('sumtotal');
    sumcheckbill.innerText = sumAll;
    //document.getElementById('btnInsert').focus();

}

generateQRCode = async()=>{

    let amount = document.getElementById('sumtotal').innerText
    amount = clearAmountSymbol(amount)
    //console.log(' ยอดเงิน :  ',amount)

    try{
        const response = await axios.post(`http://localhost:5000/api/sell/generateQR/${amount}`)
        let result = response.data
        console.log('Qr  :',result.data)
        result = result.data
        $("#showimg").attr('src', result);

    }catch(err){
        //console.log(err.message)
            console.log(err.message)
            errmsg.innerText = err.message
            errmsg.style.color = 'red'
    }  

}

changeType =(elemThis)=>{

    let tyetrf = elemThis.value
    if(tyetrf == "cash"){
        document.getElementById("div_cash").style.display = 'inline';
        document.getElementById("div_tranfer").style.display = 'none';
        let getMoney = document.getElementById('getMoney');

        if(saveSucces==1 ||fg_validate==false){
            document.getElementById("btnSubmit").disabled = true;
            document.getElementById("btnSubmit").style.backgroundColor = '#a6acaf';

        }else{
            
            getMoney = parseFloat(getMoney.value)
            if(getMoney>0){
                console.log(' zzz',getMoney)
                document.getElementById("btnSubmit").disabled = false;
                document.getElementById("btnSubmit").style.backgroundColor = '#04754c';
    
            }else{
                document.getElementById("btnSubmit").disabled = true;
                document.getElementById("btnSubmit").style.backgroundColor = '#a6acaf';
            }
        }
       document.getElementById('getMoney').focus();

    
    
    }else{
        // show
        //call function Tranfer Money
            document.getElementById("div_cash").style.display = 'none';
            document.getElementById("div_tranfer").style.display = 'inline';
            document.getElementById("btnSubmit").disabled = false;
            document.getElementById("btnSubmit").style.backgroundColor = '#04754c';
            //call api generate QR code
            generateQRCode();
            if(saveSucces==1){
                document.getElementById("btnSubmit").disabled = true;
                document.getElementById("btnSubmit").style.backgroundColor = '#a6acaf';
            }
    }
}

const onSaveData = async()=>{
      
    // JSAlert.confirm("ยืนยันบันทึกข้อมูล..?").then(function(result) {
    //   if (result){
    //     JSAlert.alert(' 55 '+result);
    //     return;
    //   }else {
    //     JSAlert.alert(' 666 '+result);
    //     return;
    //   }  
    // })
     console.log(' get Row  xxx : ',getrowInv)

     let sumamt = document.getElementById('sum_amt_obj')
    let pricetotal = sumamt.innerText.trim();
    pricetotal = clearAmountSymbol(pricetotal)

    let sumamtall = document.getElementById('sum_amt_all').innerText.trim();
    sumamtall = clearAmountSymbol(sumamtall)
    
    let checkgender = document.querySelectorAll('input[name=typecheck]')
    let result =""
    for(let i=0;i<checkgender.length;i++){
        if(checkgender[i].checked){
            result =checkgender[i].value
        }
    }
    if(result=='tranfer'){
        payment=2
    }else{
        payment=1
    }
    //console.log(result)

    let getitem = document.getElementById('item').innerText;
    const arritem = getitem.split(' ');
    //console.log('xxxxx',arritem[0])
    getitem = arritem[0].trim();
    let cntitem = parseInt(getitem);
    console.log('get Item xxx :  ',cntitem )

    const resultdata =  getDataSell();
    console.log('Payment xxx :  ',payment )
    let sellHeader = {
        sell_item: cntitem,
        sell_totalprice: parseFloat(pricetotal),
        sell_sumtotalprice: parseFloat(sumamtall),
        sell_payment: payment
    }
    resultdata.push(sellHeader)

   // console.log('data out xx : ',sellHeader)
   let messageresDom = document.getElementById('message')

    for(let i=0;i<resultdata.length;i++){
        for(let j=0;j<resultdata[i].length;j++){
            console.log('Row : ', i + "  " +resultdata[i][j])
        }  
    }
    
    let response =''
    let msg = ''
    try{
        console.log('send Data : ',resultdata)
       
        msg = 'ยืนยันข้อมุลสำเร็จ'
        response = await axios.post(`http://localhost:5000/api/sell/create`,resultdata)
        
        console.log('order Id : ',response.data[0].order_id)
        //get order id
        let getorder_id = response.data[0].order_id
        let messageresDom = document.getElementById('message')
        messageresDom.innerText = msg
        messageresDom.className = 'message success'

         //call api create Invoice()
           try{
                   const pdfResponse = await fetch("http://localhost:5000/api/sell/generateInvoice", {
                    method: 'POST',
                        headers: {
                        'Accept': 'application/pdf',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        order_id : getorder_id,
                        sell_item: cntitem,
                        sell_totalprice: setAmountFormatTh(pricetotal),
                        sell_sumtotalprice: setAmountFormatTh(sumamtall),
                        detail : getrowInv,
                        sell_totalprice_calc: pricetotal,
                        sell_sumtotalprice_calc: sumamtall,

                    }),
                });

                const resp = await pdfResponse.arrayBuffer();
                const blob = new Blob([resp], { type: 'application/pdf' });
                document.getElementById("pdfViewer").style.display = "block"; 
                let container = document.getElementById('pdfViewer');
                let embed = document.getElementById('embedPdf');
                embed.src = window.URL.createObjectURL(blob);
                embed.type = 'application/pdf';
                embed.width = '100%';
                embed.height = '300px';
                container.appendChild(embed);
                saveSucces = 1
                saveSuccess();
                showBlinkMsg(false)
                //clearDatatonewInv();

           }catch(err){
                console.log('Err XXXX : ',err.message)
                msg = 'มีข้อผิดพลาด ยืนยันข้อมูลนี้แล้ว : ' + err.message
                messageresDom.innerText = msg
                messageresDom.className = 'message danger'

            }
        
         //let btnsave = document.getElementById('chkbill')
        //btnsave.disabled = 'true'
        //btnsave.style.backgroundColor = '#888'        

    }catch(err){
        console.log('Err XXXX : ',err.message)
        msg = 'มีข้อผิดพลาด ยืนยันข้อมูลนี้แล้ว : ' + err.message
        messageresDom.innerText = msg
        messageresDom.className = 'message danger'

    }

}

const getDataSell = () => {
    
    let table = document.getElementById('myTable');
    let item =1;
    let arrdata = []; 
    let arrdataInv = [];

    for(let i = 1; i < table.rows.length; i++) {
        buff=''
        if(table.rows[i].cells.length) {
            let tempArr = [];
            let tempArrInv = [];
            //arrdata.push(item)
            tempArr.push(item); 
            let brand = (table.rows[i].cells[0].textContent);
            //console.log( ' สินค้า :' +brand)
            tempArrInv.push(brand.trim())
            let prodtId = (table.rows[i].cells[4].textContent);
            prodtId= parseInt(prodtId)
            //arrdata.push(prodtId)
            tempArr.push(prodtId); 
            let qty = (table.rows[i].cells[1].children[0].value);
            tempArrInv.push(qty)
            let cntqty = parseInt(qty)
            console.log( ' จำนวน :' +cntqty)
            //arrdata.push(cntqty)
            tempArr.push(cntqty); 
            let price = (table.rows[i].cells[2].textContent);
            tempArrInv.push(price)
            console.log(' ราคา :  ' +price);  
            price = price.trim();
            let contprice = parseFloat(clearAmountSymbol(price));
            //arrdata.push(contprice)
            tempArr.push(contprice); 
            arrdata.push(tempArr);
            arrdataInv.push(tempArrInv)
            item++;
        } 
    }
    getrowInv =arrdataInv;
    return arrdata;

};

 clearDataTonewInv = ()=>{

    //clear obj
    //document.getElementById('prod_Select').innerText = '';
    fg_validate =false
    saveSucces =0;
    fg_newTrans = true

    document.querySelector('input[name=qtybtn]').value = 1
    document.getElementById('unitPrice').innerText = 0;
    document.getElementById('amount').innerText = 0;

    document.getElementById('item').innerText = '0 รายการ';
    document.getElementById('sum_amt_obj').innerText = '0';

    document.querySelector('input[id=b_discnt]').value = 0
    document.getElementById('discount').innerText = '0';
    document.getElementById('sum_amt_all').innerText = '0';
    
    var Table = document.getElementById('myTable');
    Table.innerHTML = "";
    let v_innerHtml="";
    v_innerHtml = "<table id='myTable'  style='border:0'  ></table>"
    v_innerHtml += "<thead>"
    v_innerHtml += "<tr>"
    v_innerHtml += "<th>สินค้า</th>"
    v_innerHtml += "<th>จำนวน</th>"
    v_innerHtml += "<th>ราคา</th>"
    v_innerHtml += "</tr>"
    v_innerHtml += "  </thead>"
    v_innerHtml += " <tbody>"
    v_innerHtml += " </tbody>"
    v_innerHtml += " </table>"
    Table.innerHTML=v_innerHtml

    document.getElementById("prod_Select").options.selectedIndex = 0;
    if ("createEvent" in document) {
        let evt = document.createEvent("HTMLEvents");
        evt.initEvent("change", false, true);
        document.getElementById("prod_Select").dispatchEvent(evt);
        document.getElementById("prod_Select").focus();
    }
    else {
        document.getElementById("prod_Select").fireEvent("onchange");
        document.getElementById("prod_Select").focus();

    }
    
    //clear modal 

    document.getElementById("getMoney").value = ' '
    document.getElementById('getMoney').disabled = false;

    document.getElementById("change").innerText = ''
    document.getElementById("infor").innerText = ''
    document.getElementById("message").innerText = ''
    
    document.getElementById("pdfViewer").style.display = "none"; 

    //disable blink msg
    showBlinkMsg(false)

}

saveSuccess =() =>{
    // disable
    document.getElementById("btnSubmit").disabled = true;
    document.getElementById("btnSubmit").style.backgroundColor = '#a6acaf';
    // get money
    document.getElementById('getMoney').disabled = 'disabled'

}

showBlinkMsg = (flgMsg) =>{

    let counter = 0;
    let text = document.querySelector("#wait-text");
    if(flgMsg){
        counter = 2;
        text.innerHTML = 'กรุณายืนยันข้อมูล';
        if (counter % 2 == 0) {
           text.classList.add("blink");
        }else{
           if(text.classList.contains("blink")) {
              text.classList.remove("blink");
           }
        }
    }else{
        counter = 1;
        text.innerHTML = '';
        if (counter % 2 == 0) {
           text.classList.add("blink");
        }else{
            if (text.classList.contains("blink")) {
                text.classList.remove("blink");
            }
        }
    }


}

