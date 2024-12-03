
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