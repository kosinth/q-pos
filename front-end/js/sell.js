    let productName = '';
    let sel = document.getElementById('prod_Select');
    let domunitprice = document.getElementById('unitPrice')
    let domtotal = document.getElementById('amount')
    let selectedRadio = 'cash'

    sel.onchange = function(evt) {

        let allData = ""; 
        let option = evt.target.options[evt.target.selectedIndex];
        allData += option.innerHTML;
        productName = allData.substring(0,allData.search(/\|/))
        //console.log('Print : ',productName)
        allData += " value: " + option.value;
        //const arrDelId = id.split("^")
        let unitpricearr = option.value.split("|")
        let unitprice = unitpricearr[1]
        console.log('UNitPrice :  ', unitprice)
        domunitprice.innerText = setAmountFormatTh(unitprice)
        //let getqty = document.getElementById('qty').value
        let domqty = document.querySelector('input[name=qtybtn]')
        domqty.value = '1'
        let cntqty = parseInt(domqty.value)
        unitprice =  parseFloat(unitprice)
        let total =  unitprice * cntqty
        domtotal.innerText = setAmountFormatTh(total)
        document.getElementById('btnInsert').focus()
        //console.log(cntqty + " "+ unitprice  + " "+ total)

    };

    const products = async() => {
        const arr = [];
        let options_str = '';

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
            console.log(err.message)
            if(err.response){
                console.log(err.response.data.msg)
                errmsg.innerText = err.response.data.err + " " +err.response.data.msg
                errmsg.style.color = 'red'
            }
        }  
        return arr;

    };
    const resultArr =  products();

window.onload = function() {
    document.body.appendChild(sel);
    document.getElementById('prod_Select').focus();
};


changeQty = ()=>{

    let unitprice = document.getElementById('unitPrice');
    let domqty = document.querySelector('input[name=qtybtn]')
    let amount = document.getElementById('amount');

    let cnvqty = parseInt(domqty.value)
    //console.log(' 555 '+cnvqty)  clearAmountSymbol
    let cnvunitPrice =  parseFloat(clearAmountSymbol(unitprice.innerText))
    //let cnvunitPrice =  parseFloat(unitprice.innerText.replace(/[฿,]/g,""))

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
    document.getElementById('btnInsert').focus();

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
        if(err.response){
            console.log(err.response.data.msg)
            errmsg.innerText = err.response.data.err + " " +err.response.data.msg
            errmsg.style.color = 'red'
        }
    }  

}

changeType =(elemThis)=>{

    let tyetrf = elemThis.value
    if(tyetrf == "cash"){
        document.getElementById("div_cash").style.display = 'inline';
        document.getElementById("div_tranfer").style.display = 'none';
        let getMoney = document.getElementById('getMoney');
        if(getMoney.value){
            //console.log(' zzz',getMoney.value)
            document.getElementById("btnSubmit").disabled = false;
            document.getElementById("btnSubmit").style.backgroundColor = '#04754c';
        }else{
            document.getElementById("btnSubmit").disabled = true;
            document.getElementById("btnSubmit").style.backgroundColor = '#a6acaf';
        }
        getMoney.focus()

    }else{
        // show
        //call function Tranfer Money
        document.getElementById("div_cash").style.display = 'none';
        document.getElementById("div_tranfer").style.display = 'inline';
        document.getElementById("btnSubmit").disabled = false;
        document.getElementById("btnSubmit").style.backgroundColor = '#04754c';
        //call api generate QR code
        generateQRCode();

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

    let messageresDom = document.getElementById('message')
    
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
    let payment =0
    if(result='tranfer'){
        payment=2

    }else{
        payment=1
    }
    //console.log(result)

    let getitem = document.getElementById('item').innerText;
    getitem = getitem.trim();
    getitem = getitem.substring(0,1);
    let cntitem = parseInt(getitem);

    const resultdata =  getDataSell();
    
   
    let sellHeader = {
        sell_item: cntitem,
        sell_totalprice: parseFloat(pricetotal),
        sell_sumtotalprice: parseFloat(sumamtall),
        sell_payment: payment
    }
    resultdata.push(sellHeader)

    console.log('data out xx : ',sellHeader)

     for(let i=0;i<resultdata.length;i++){
        for(let j=0;j<resultdata[i].length;j++){
         console.log('Row : ', i + "  " +resultdata[i][j])
        }  
    }
     try{
            console.log('send Data : ',resultdata)
            let msg = ''
            msg = 'บันทึกข้อมูลเรียบร้อย !'
            const response = await axios.post(`http://localhost:5000/api/sell`,resultdata)
            
            messageresDom.innerText = msg
            messageresDom.className = 'message success'
            let btnsave = document.getElementById('savebtn')
            btnsave.disabled = 'true'
            btnsave.style.backgroundColor = '#888'        
        

    }catch(error){
        //console.log(' ERRR ' , error.message)
        let messageDOM = `มีปัญหาเกิดขึ้น ${error.message}`
        messageresDom.innerHTML = messageDOM
        messageresDom.className = 'message danger'
    }
    

}


const getDataSell = () => {
    
   
    let table = document.getElementById('myTable');
    let item =1;
    let arrdata = []; 

    for  (var i = 1; i < table.rows.length; i++) {
        buff=''
        if(table.rows[i].cells.length) {

            //let brand = (table.rows[i].cells[0].textContent);
            //console.log( ' สินค้า :' +brand)
            let tempArr = [];
            //arrdata.push(item)
            tempArr.push(item); 
            let prodtId = (table.rows[i].cells[4].textContent);
            prodtId= parseInt(prodtId)
            //arrdata.push(prodtId)
            tempArr.push(prodtId); 

            let qty = (table.rows[i].cells[1].children[0].value);
            let cntqty = parseInt(qty)
            console.log( ' จำนวน :' +cntqty)
            //arrdata.push(cntqty)
            tempArr.push(cntqty); 
            
            let price = (table.rows[i].cells[2].textContent);
            console.log(' ราคา :  ' +price);  
            price = price.trim();
            let contprice = parseFloat(clearAmountSymbol(price));
            //arrdata.push(contprice)
            tempArr.push(contprice); 

            arrdata.push(tempArr);
            item++;
        } 
    }

    return arrdata;

};
