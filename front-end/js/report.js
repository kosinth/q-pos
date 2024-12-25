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
        //showChartDonut();
        const resultArr =  showChart(dateFrm,dateTo);
          
        //find Max in array
        // console.log(Math.max(1, 3, 2));
        // // Expected output: 3
        // console.log(Math.max(-1, -3, -2));
        // // Expected output: -1
        // const array1 = [1, 3, 2];
        // console.log(Math.max(...array1));
        // // Expected output: 3


        // show chart
        // var xValues = ["1"
        // ];
        // var yValues = ["5500.00"
        // ];
        // var barColors = ["green"
        // ];
    
    
        // new Chart("myChart", {
        //   type: "bar",
        //   data: {
        //     labels: xValues,
        //     datasets: [{
        //       backgroundColor: barColors,
        //       data: yValues
        //     }]
        //   },
        //   options: {
        //     legend: {display: false},
        //     title: {
        //       display: true
        //       //text: "World Wine Production 2018"
        //     }
        //   }
        // });



      }else{
        //alert(paramIn)

    }


}


const showChart= async(datefrmIn,datetoIn)=>{

    // var xValues = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10" ,
    //     "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", 
    //     "21","22", "23", "24", "25", "26", "27", "28", "29", "30"

    // ];
    // var yValues = [55, 49, 44, 24, 75, 16, 17, 18, 19, 20,
    //     55, 49, 44, 24, 75, 16, 17, 18, 19, 20,
    //     55, 49, 44, 24, 75, 16, 17, 18, 19, 20

    // ];
    // var barColors = ["green", "green","green","green","green","green", "green","green","green","green",
    //     "green", "green","green","green","green","green", "green","green","green","green",
    //     "green", "green","green","green","green","green", "green","green","green","green"
    // ];

    const arr = [];
    let errmsg = document.getElementById('errMsg')
    let datefrm_to = datefrmIn+","+datetoIn

    try{
      //console.log(' Send Date from to XXX :  ',datefrm_to)
      const response = await axios.post(`http://localhost:5000/api/report/sellreport/${datefrm_to}`)
      console.log('reports :',response.data)
      arr.push(response.data)

    }catch(err){
        let messageErr = ''
        if(err.response){
            console.log(err.message)
            messageErr = err.response.data.err + " " +err.response.data.msg
            //messageErr = err.message
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
