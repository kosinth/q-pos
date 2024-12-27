let sysdate = ''
function openCity(evt, cityName) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
    onActive(cityName)

}

onActive =(paramIn)=>{

    let domFromdate = document.querySelector('input[name=fromdate]').value
    let domTodate = document.querySelector('input[name=todate]').value
    let arrStrFrmDate = domFromdate.split('/')
    let convtFromdate = parseInt(arrStrFrmDate[2])
    convtFromdate = convtFromdate - 543
    const  dateFrm = convtFromdate+ "-" + arrStrFrmDate[1] + "-" + arrStrFrmDate[0]
    //console.log(' HHHH ', arrStrFrmDate[0] + "/" + arrStrFrmDate[1] + "/" + dateFrm )

    let arrStrToDate = domTodate.split('/')
    let convtTodate = parseInt(arrStrToDate[2])
    convtTodate = convtTodate - 543
    const  dateTo = convtFromdate + "-" + arrStrToDate[1] + "-" + arrStrToDate[0]

    if(paramIn=='sell'){

        document.getElementById('dateinfo').innerText = " วันที่ " +domFromdate + "   -   "+ domTodate  
        const resultArr  =   showChart(dateFrm,dateTo);

    }else{
        //alert(paramIn)
    }


}


const showChart= async(datefrmIn,datetoIn)=>{

    let errmsg = document.getElementById('errMsg')
    let datefrm_to = datefrmIn+","+datetoIn
    const arr = [];

    try{
      //console.log(' Send Date from to XXX :  ',datefrm_to)
      const response = await axios.post(`http://localhost:5000/api/report/sellreport/${datefrm_to}`)
      console.log('reports :',response.data)
      arr.push(response.data)
      await generateReport(arr);

    }catch(err){
        let messageErr = ''
        if(err.response){
            console.log(err.message)
            messageErr = err.response.data.err + " " +err.response.data.msg
            messageErr = err.message
            //errmsg.style.color = 'red'
        }else{
            messageErr = 'มีข้อผิดพลาด: ' +err.message+ "---> ไม่สามารถเชื่อมต่อ Server ได้...! "
            console.log(messageErr)
        }
        errmsg.innerText = messageErr
        errmsg.style.color = 'red'
        
    }  
    return arr;
  
}

getDate = async() =>{
   
    try{
        const resp = await axios.get(`http://localhost:5000/api/systemdate/getdate`)
        //console.log(resp.data)
        sysdate = resp.data
    }catch(err){
        console.log(' Err :  ' , err.message)
    }

}

generateReport = async(arrParam)=>{
    
    let v_innerHtml="";
    let domTable = document.getElementById('tableReport')

    let sumTotal =0
    let cntSell =0
    let arrday=[]
    let arrtotal=[]
    let arrcolor=[]

     for(let row=0;row<3;row++){
        v_innerHtml += ` <tr>`;
        switch(row) {
            case 0:
                v_innerHtml += `<td class='tdReport' >วันที่</td>`;
                break;
            case 1:
                v_innerHtml += `<td class='tdReport' >จำนวน</td>`;
                break;
              case 2:
                v_innerHtml += `<td class='tdReport' >ขาย</td>`;
                break;
        }
        for(let i=0;i<arrParam[0].length;i++){
            //console.log( ' COl : xx  ',arrParam[0][i].cntOrder)
            switch(row) {
                case 0:
                    let dateCnvtTh = convertDateTH(arrParam[0][i].Day)
                    v_innerHtml += `<td>${dateCnvtTh} </td>`;
                    arrday.push(dateCnvtTh)
                    break;
                case 1:
                    cntSell += parseInt(arrParam[0][i].cntOrder)
                    v_innerHtml += `<td>${arrParam[0][i].cntOrder} </td>`;
                    //arrtotal.push(arrParam[0][i].cntOrder)
                    break;
                  case 2:
                    sumTotal += parseFloat(arrParam[0][i].total)
                    v_innerHtml += `<td>${setAmountFormatTh(arrParam[0][i].total)} </td>`;
                    arrtotal.push(parseFloat(arrParam[0][i].total))
                    break;
              }
        }
        v_innerHtml += `  </tr>`;
    }

    domTable.innerHTML=v_innerHtml
    document.getElementById('total').innerText =  setAmountFormatTh(sumTotal) 
    document.getElementById('sumCntsell').innerText =cntSell
    
    console.log(arrday)
    console.log(arrtotal)
    await generateSellChart(arrday,arrtotal)


}

convertDateTH = (dateIn)=>{

    let arrdate = dateIn.split('-')
    let datecnvt = parseInt(arrdate[0])
    datecnvt = datecnvt + 543
    const  dateTh = arrdate[2]+ "/" + arrdate[1] + "/" + datecnvt
    return   dateTh

}

generateSellChart = (dayin,totalin)=>{

    //console.log(' ArrIN :  ',totalin)
    let max= Math.max.apply(Array, totalin);
    console.log(' Max :  ',max)
    let arrColor=[]
    let icntColor=1
    for(let i=0;i<totalin.length;i++){
        if(max==totalin[i]){
            arrColor.push("#1e7145")
        }else{
            switch (icntColor){
                case 1:
                    arrColor.push("#b91d47")
                    break;
                case 2:
                    arrColor.push("#00aba9")
                    break;
                break;
                case 3:
                    arrColor.push("#2b5797")
                    break;
                case 4:
                    arrColor.push("orange")
                    break;
                case 5:
                    arrColor.push("#e8c3b9")
                    break;
            }
            if(icntColor==5){
                icntColor = 0
            }
            icntColor++;
        }
    }
        
    let pieChartContent = document.getElementById('pieChartContent');
    pieChartContent.innerHTML = '&nbsp;';
    $('#pieChartContent').append('<canvas id="sellChart" ><canvas>');
    // console.log('day : ',dayin)
    // console.log('color : ',arrColor)
    new Chart("sellChart", {
    type: "bar",
    data: {
        labels: dayin,
        datasets: [{
            backgroundColor: arrColor,
            data: totalin
        }]
        },
        options: {
        legend: {display: false},
        title: {
            display: true
            //text: "World Wine Production 2018"
            }
        }
    });

}