const onclicksubmit = async() =>{


    let shopnameDom = document.querySelector('input[name=shopname]')
    let addrDom = document.querySelector('input[name=address]')
    let usrDom = document.querySelector('input[name=username]')
    let pswDom = document.getElementById('psw')
    let pswRepeatDom = document.getElementById('psw-repeat')
    let emailDom = document.getElementById('email')
    let promtpayDom = document.getElementById('promtpay')
    //message errors
    let messageresDom = document.getElementById('infor')

    let registData = {
        regist_shopname: shopnameDom.value,
        regist_addr: addrDom.value,
        regist_usr: usrDom.value,
        regist_psw: pswDom.value,
        regist_pswRepeat: pswRepeatDom.value,
        regist_email: emailDom.value,
        regist_promtpay: promtpayDom.value
    }
    
    try{
        console.log('send RegistData : ',registData)
        const errors = validateData(registData)
        if(errors.length>0){
             throw {
                 message : 'กรอกข้อมูลไม่ครบ',
                 errors : errors
             }
            
        }
        
        //let msg = 'บันทึกข้อมูลเรียบร้อย !'
        let msg = ''

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


const validateData =(registData) =>{
 
    let errors=[]
    if (!registData.regist_shopname){
        errors.push('กรุณากรอกชื่อร้าน/ห้างร้าน')
    }
   
    if(!registData.regist_addr){
        errors.push('กรุณากรอกที่อยู่')
    }
    if (!registData.regist_usr){
        errors.push('กรุณากรอก User name สำหรับ login')
    }

    if (!registData.regist_psw){
        errors.push('กรุณากรอก รหัสผ่าน')
    }

    if (!registData.regist_pswRepeat){
        errors.push('กรุณากรอก ยืนยันรหัสผ่าน')
    }
    if (!registData.regist_email){
        errors.push('กรุณากรอก e-mail')
    }

    if (!registData.regist_promtpay){
        errors.push('กรุณากรอก เลขบัญชี promt-pay')
    }


    return errors

}


function formatNumber(currElement){

    let alert = document.getElementById('infor')
    alert.innerText = "";
    let number = currElement.value;
    number = number.replace(/,/g, '')
    if(!isNaN(parseFloat(number)) && !isNaN(number)) {
    //   let formatter = new Intl.NumberFormat('en-US');
    //   let cstr = number.toString();
    //   let formattedNumber = formatter.format(cstr);
    //   //console.log(formattedNumber); 
      let idx = formattedNumber.search(/\./);
      console.log('Serch' +idx); 
        if(idx==-1){
          currElement.value = formattedNumber 
        }else{
          currElement.value = formattedNumber 
        }
    }else{
        console.log( 'xxx ' ,number)
       alert.style.color = "red";
       alert.style.fontWeight = 'blod';
       alert.innerText = "!กรุณา กรอกข้อมูลเป็นตัวเลข..";
    }

  }

  const showModal=()=>{
    
    //alert(' ok ')
        let domModual = document.getElementById('id01')
        domModual.style.display='block'
        domModual.class='w3-button w3-black'

  }