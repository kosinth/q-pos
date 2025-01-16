
let mode = 'CREATE'
let selectedId = ''

window.onload = async ()=>{
    await loadData('')
}

const loadData = async(curr) =>{    

    let errmsg = document.getElementById('errMsg')
    try{
        let response = ''
        if(curr){
            //console.log(' xxx ',curr)
            // call api search name
            response = await axios.get(`http://localhost:5000/api/product/search/${curr}`)
            console.log(' Get data length : ',response.data.length)
            if(response.data.length==0){
                document.getElementById('divsearch').innerText ='ไม่พบข้อมูล..'
            }else{
                document.getElementById('divsearch').innerText =''
            }

        }else{
            //call api get all product
            //console.log(' xxx else ',curr)
            response = await axios.get('http://localhost:5000/api/product/getall')
            document.getElementById('divsearch').innerText =''

        }    
        console.log(' Get data : ',response.data)
        const userDom = document.getElementById('product')
        let htmlData = '<div style="overflow-x:auto;">'
        htmlData += '<table >'
        htmlData +=  '<tr>' 
        htmlData += '<th style="width:10%;" >รหัส</th>'
        htmlData += '<th style="width:40%;">ชื่อสินค้า</th>'
        htmlData += '<th style="width:25%;">คีย์ลัดค้นหา</th>'
        htmlData += '<th style="width:40%;">ราคา</th>'
        htmlData += '</tr>'
        document.getElementById('totalProduct').style.color = '#092cc9'
        document.getElementById('totalProduct').style.fontWeight = 'bold'
        document.getElementById('totalProduct').innerText = 'รวม ' + setAmoutFormat(response.data.length) + '  รายการ'
        for (let i =0;i<response.data.length;i++){
            let product = response.data[i]
                htmlData += ' <tr>'
                //table row
                let priceunit = setAmountFormatTh(product.prodt_price)
                htmlData += `<td style="text-align:center;" >${product.prodt_id }</td>`
                htmlData += `<td style="text-align:left;">${product.prodt_name}</td>`
                htmlData += `<td style="text-align:center;">${product.prodt_short}</td>`
                htmlData += `<td style="text-align:right;">${priceunit}</td>`
                htmlData += `<td style="width:25%;">  </td>`
                //htmlData += `<td> <a href='register.html?id=${product.Id}'> <button >Edit </button> </a> </td>`
                htmlData += `<td> <button id='button-edit' class='edit' data-id='${'EDIT'}^${product.prodt_id }^${product.prodt_name }^${product.prodt_short }^${product.prodt_price }'>แก้ไข</button> </td>`
                htmlData += `<td> <button id='button-delete' class='delete' data-id='${product.prodt_id }^${product.prodt_name}'> ลบ</button> </td>`
                htmlData += ' </tr>'
        }
        htmlData += '</table>'
        htmlData += '</div>'
        userDom.innerHTML = htmlData
        const deleteDom = document.getElementsByClassName('delete')
        let id=''
        for(let i =0;i<deleteDom.length;i++){
            deleteDom[i].addEventListener('click',(event)=>{
                id = event.target.dataset.id
                const arrDelId = id.split("^")
                //alert(id)
                //api app.delete('/user/:id',async(req,res)=>{
                console.log('ID -->',arrDelId[0] + " " + arrDelId[1])
                
                Swal.fire({
                    title: 'ลบข้อมูล',
                    text: `ต้องการลบข้อมูล... ${arrDelId[0]} - ${arrDelId[1]} ` ,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33', 
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: ' ลบ ',
                    cancelButtonText: 'ยกเลิก',  
                }).then(async(result) => {
                    if (result.isConfirmed) {
                        try{
                            await axios.delete(`http://localhost:5000/api/product/${arrDelId[0]}`)
                            console.log('Delete success...')
                        }catch(err){
                            console.log('Error: ',err.message)            
                        }
                        loadData('')
                        return true;
                    }
                    else{
                        return false;
                    }
                })
                

            })
        }

        const editDom = document.getElementsByClassName('edit')
        let editId =''
        for(let j=0;j<editDom.length;j++){
            editDom[j].addEventListener('click',(event)=>{
                editId =  event.target.dataset.id
                const arrEdtId = editId.split("^")
                mode = arrEdtId[0] 
                selectedId = arrEdtId[1]

                console.log(mode + "  " + selectedId + "  " + arrEdtId[2]+ "  " + arrEdtId[3]+ "  " + arrEdtId[4])
                if(mode=='CREATE'){
                    document.getElementById('title').innerText = 'เพิ่มสินค้า'
                    document.getElementById('divEdit').value =''
                }else{
                    document.getElementById('title').innerText = 'แก้ไขสินค้า'
                    document.getElementById('divEdit').innerText = 'รหัสสินค้า  '+ selectedId
                    //document.getElementById('divEdit').style.font-weight = 'bold'
                    let productDom = document.querySelector('input[name=productName]')
                    let shortcutDom = document.querySelector('input[name=shortcut]')
                    let qtyDom = document.querySelector('input[name=qty]')
                    
                    productDom.value = arrEdtId[2]
                    shortcutDom.value =arrEdtId[3]
                    qtyDom.value = setAmountFormatDec(arrEdtId[4])
                    let alert = document.getElementById('infor')
                    alert.innerText = "";
                    let messageresDom = document.getElementById('message')
                    messageresDom.className = 'message clear'
                    document.getElementById('savebtn').disabled = false;
                    document.getElementById('savebtn').style.backgroundColor = '#04754c'
                    document.getElementById('btnAdd').style.display = 'none'

                }    
                displayMoal()
            })
        }

    }catch(err){
        let messageErr = ''
        if(err.response){
            console.log(err.response.data.message)
            messageErr = err.response.data.err + " " +err.response.data.msg
            //errmsg.innerText = err.response.data.err + " " +err.response.data.msg
            //errmsg.style.color = 'red'
        }else{
            messageErr = 'มีข้อผิดพลาด: ' +err.message+ "---> ไม่สามารถเชื่อมต่อ Server ได้...! "
            console.log(messageErr)

        }
        console.log(err.message)
        errmsg.innerText = messageErr
        errmsg.style.color = 'red'


    }


}

const onclicksubmit = async() =>{
   
    let productDom = document.querySelector('input[name=productName]')
    let shortcutDom = document.querySelector('input[name=shortcut]')
    let qtyDom = document.querySelector('input[name=qty]')
    let messageresDom = document.getElementById('message')

    let procudtData = {
        prodt_name: productDom.value,
        prodt_short: shortcutDom.value,
        prodt_price: clearAmount(qtyDom.value)
    }
    
    try{
        console.log('send Data : ',procudtData)
        const errors = validateData(procudtData)
        if(errors.length>0){
             throw {
                 message : 'กรอกข้อมูลไม่ครบ',
                 errors : errors
             }
            
        }
        
        //let msg = 'บันทึกข้อมูลเรียบร้อย !'
        let msg = ''

        if(mode=='CREATE'){
            console.log('creat ...' + productDom.value)
            let alert = document.getElementById('infor')
            alert.innerText = "";
            const resp = await axios.get(`http://localhost:5000/api/product/searchname/${productDom.value}`)
            console.log(resp.data.length)
            if(resp.data.length>0){
                alert.style.color = "red";
                alert.style.fontWeight = 'blod';
                alert.innerText = "มีสินค้านี้แล้ว !";
                //document.getElementById("savebtn").disabled = true;
                //document.getElementById("savebtn").style.backgroundColor = '#a6acaf';

            }else{
                msg = 'บันทึกข้อมูลเรียบร้อย !'
                const response = await axios.post('http://localhost:5000/api/product',procudtData)
                await loadData('')
                messageresDom.innerText = msg
                messageresDom.className = 'message success'
                let btnsave = document.getElementById('savebtn')
                btnsave.disabled = 'true'
                btnsave.style.backgroundColor = '#888'        
        
            }

            
        }else{
            const response = await axios.put(`http://localhost:5000/api/product/${selectedId}`,procudtData)
            await loadData('')
            msg = 'แก้ไขข้อมูลเรียบร้อย !'
            messageresDom.innerText = msg
            messageresDom.className = 'message success'
            let btnsave = document.getElementById('savebtn')
            btnsave.disabled = 'true'
            btnsave.style.backgroundColor = '#888'        
    
        }

        // console.log('response : ', "  ===>"+response.message )

    }catch(error){
         
        //console.log(' ERRR ' , error.message)
        let messageDOM = `มีปัญหาเกิดขึ้น ${error.message}`
        if (error.errors && error.errors.length > 0) {
            messageDOM = '<div>'
            messageDOM += `<div>${error.message}</div>`
            messageDOM += '<ul>'
            for (let i = 0; i < error.errors.length; i++) {
                messageDOM += `<li>${error.errors[i]}</li>`
            }
            messageDOM += '</ul>'
            messageDOM += '</div>'
        }
        messageresDom.innerHTML = messageDOM
        messageresDom.className = 'message danger'

    }

}

const validateData =(prodtData) =>{
 
    let errors=[]
    if (!prodtData.prodt_name){
        errors.push('กรุณากรอกชื่อสินค้า')
    }
    if (!prodtData.prodt_short){
        errors.push('กรุณากรอกคีย์ลัด')
    }
    
    if(!prodtData.prodt_price){
        errors.push('กรุณากรอกราคาต่อหน่วย')
    }else{
        let cntqty =  parseInt(prodtData.prodt_price)
        //console.log(cntqty)
        if(cntqty<=0 ){
            errors.push('กรุณากรอกราคาต่อหน่วย')
        }
    }
    return errors

}

const cleardata =()=>{

    let productDom = document.querySelector('input[name=productName]')
    let shortcutDom = document.querySelector('input[name=shortcut]')
    let qtyDom = document.querySelector('input[name=qty]')
    let messageresDom = document.getElementById('message')

    productDom.value =''
    shortcutDom.value =''
    qtyDom.value = '0.00'
    messageresDom.className = 'message clear'
    document.getElementById('savebtn').disabled = false;
    document.getElementById('savebtn').style.backgroundColor = '#04754c'
    let alert = document.getElementById('infor')
    alert.innerText = "";

}

 const setAmount =(currElement)=>{

    let alert = document.getElementById('infor')
    alert.innerText = "";
    let number = currElement.value;
    number = number.replace(/,/g, '')
    //console.log(' zzz ',number)
    if(!isNaN(parseFloat(number)) && !isNaN(number)) {
        let formatter = new Intl.NumberFormat('en-US');
        let cstr = number.toString();
        let formattedNumber = formatter.format(cstr);
        //console.log(' aaa ',formattedNumber); 
        let idx = formattedNumber.search(/\./);
        console.log('Serch' +idx); 
        if(idx==-1){
            currElement.value = formattedNumber + ".00"
        }else{
            currElement.value = formattedNumber + "0"
        }
        document.getElementById("savebtn").disabled = false;
        document.getElementById("savebtn").style.backgroundColor = '#04754c';

    }else{
        alert.style.color = "red";
        alert.style.fontWeight = 'blod';
        alert.innerText = "!กรุณา กรอกข้อมูลเป็นตัวเลข..";
        document.getElementById("savebtn").disabled = true;
        document.getElementById("savebtn").style.backgroundColor = '#a6acaf';
    }   

 }

 const searchName = async()=>{

    let searchN = document.getElementById('search').value
    await loadData(searchN)

 }

 const cleardataProduct = ()=>{
   
   let productDom = document.querySelector('input[name=productName]')
   let shortcutDom = document.querySelector('input[name=shortcut]')
   let qtyDom = document.querySelector('input[name=qty]')
   document.getElementById('divEdit').innerHTML =''
   productDom.value = ''
   shortcutDom.value =''
   qtyDom.value ='0.00'

   let alert = document.getElementById('infor').innerHTML =''
   document.getElementById("savebtn").disabled = false;
   document.getElementById("savebtn").style.backgroundColor = '#04754c';
   let messageresDom = document.getElementById('message')
   messageresDom.className = 'message clear'
   document.getElementById('productName').focus()

 }