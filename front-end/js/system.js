
setAmountFormatDec =(amount)=>{

    formattest = new Intl.NumberFormat().format(amount)
    //console.log('xxxx' +formattest); 
    let idx = formattest.search(/\./);
    //console.log('Serch ' +idx); 
    let returnval = ''
    if(idx==-1){
        returnval = formattest + ".00"
    }else{
        returnval = formattest + "0"
    }
    return returnval

 }

 setAmoutFormat =(amount)=>{

    formattest = new Intl.NumberFormat().format(amount)
    //console.log('xxxx' +formattest); 
    return formattest

 }

 clearAmount =(amount)=>{
    
    return amount.replace(/,/g, '')

 }
 
 clearAmountSymbol =(amount)=>{
    
   return amount.replace(/[฿,]/g,"")

}


 setAmountFormatTh =(amount)=>{

    formattest = Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    }).format(amount)
    return formattest

 }

 setDateEn =(dateIn)=>{

      const result = date.toLocaleDateString('en', {
         year: 'numeric',
         month: 'numeric',
         day: 'numeric',
      })
      return result

 }

 function formatNumber(currElement){

      let alert = document.getElementById('infor')
      alert.innerText = "";
      let number = currElement.value;
      number = number.replace(/,/g, '')
      //console.log(number)
      if(!isNaN(parseFloat(number)) && !isNaN(number)) {
        let formatter = new Intl.NumberFormat('en-US');
        let cstr = number.toString();
        let formattedNumber = formatter.format(cstr);
        //console.log(formattedNumber); 
        let idx = formattedNumber.search(/\./);
        console.log('Serch' +idx); 
      if(idx==-1){
        currElement.value = formattedNumber + ".00"
      }else{
        currElement.value = formattedNumber + "0"
      }
      changeMoney();
      }else{
        document.getElementById("btnSubmit").disabled = true;
        document.getElementById("btnSubmit").style.backgroundColor = '#a6acaf';
        alert.style.color = "red";
        alert.style.fontWeight = 'blod';
        alert.innerText = "!กรุณา กรอกข้อมูลเป็นตัวเลข..";
      }

    }
