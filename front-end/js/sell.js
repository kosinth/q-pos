    let productName = '';
    let sel = document.getElementById('prod_Select');
    let domunitprice = document.getElementById('unitPrice')
    let domtotal = document.getElementById('amount')

    sel.onchange = function(evt) {

        let allData = ""; 
        let option = evt.target.options[evt.target.selectedIndex];
        allData += option.innerHTML;
        productName = allData.substring(0,allData.search(/\|/))
        //console.log('Print : ',productName)
        allData += " value: " + option.value;
        let unitprice = option.value
        domunitprice.innerText = setAmountFormatTh(option.value)
        //let getqty = document.getElementById('qty').value
        let domqty = document.querySelector('input[name=qtybtn]')
        let cntqty = parseInt(domqty.value)
        unitprice =  parseFloat(unitprice)
        let total =  unitprice * cntqty
        domtotal.innerText = setAmountFormatTh(total)
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
              //console.log(product.prodt_name + " "+ product.prodt_price)
              options_str += '<option value="' + product.prodt_price +'">' + product.prodt_name + " | " +product.prodt_short +  '</option>';
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
    //console.log(' 555 '+cnvqty)
    let cnvunitPrice =  parseFloat(unitprice.innerText.replace(/[฿,]/g,""))
    //let costPrice = cnvunitPrice.replace(/[฿,]/g,"")
    let result = cnvunitPrice* cnvqty
    //console.log(' 555 '+result)
    amount.innerText = setAmountFormatTh(result)

}


calcAmount = ()=>{


    var table = document.getElementById('myTable');
    let item =0;
    let totalprice = 0;
    for (var i = 1; i < table.rows.length; i++) {
        buff=''
        if (table.rows[i].cells.length) {
            let brand = (table.rows[i].cells[0].textContent);
            console.log( ' สินค้า :' +brand)
            let qty = (table.rows[i].cells[1].children[0].value);
            let cntqty = parseInt(qty)
            console.log( ' จำนวน :' +cntqty)
            //let totalprice = costPrice*cntqty ;
            //table.rows[i].cells[2].innerText = priceFormat(totalprice);
            let price = (table.rows[i].cells[2].textContent);
            price = price.trim();
            console.log(' PRice :  ' +price);
            totalprice += parseFloat(price.replace(/[฿,]/g,"") )
            //price = price.substring(1,price.length)
            //contprice = parseFloat(price.replace(/,/g, ''));
            //sum_amt =sum_amt + contprice;
            item++;
            //alert(sum_amt)
            //console.log(sum_amt);
            //outputDiv.innerHTML =buff;
        } 
    }
    let sumitem = document.getElementById('item') 
    sumitem.innerText =  item + "  รายการ " 
    let sumamtall = document.getElementById('sum_amt_all')
    let sumamt = document.getElementById('sum_amt_obj')
    sumamt.innerText = setAmountFormatTh(totalprice);
    sumamtall.innerText = setAmountFormatTh(totalprice);


     console.log('total Price ; ' +totalprice);



}