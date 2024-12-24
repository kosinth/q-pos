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
    
    let arrStrtoDate = domFromdate.split('/')
    let cont = parseInt(arrStrtoDate[2])
    cont = cont - 543
    const  dateBc = arrStrtoDate[0] + "/" + arrStrtoDate[1] + "/" + cont
    console.log(' HHHH ', arrStrtoDate[0] + "/" + arrStrtoDate[1] + "/" + cont )

    if(paramIn=='sell'){

        document.getElementById('dateinfo').innerText = " วันที่ " +domFromdate + "   -   "+ domTodate  + "  to "  + dateBc
        //showChartDonut();
        showChart();


      }else{
        //alert(paramIn)

    }


}


showChartDonut=()=>{

    var xValues = ["Italy", "France", "Spain", "USA", "Argentina"];
    var yValues = [55, 49, 44, 24, 15];
    var barColors = [
      "#b91d47",
      "#00aba9",
      "#2b5797",
      "#e8c3b9",
      "#1e7145"
    ];
    
    new Chart("myChart", {
      type: "doughnut",
      data: {
        labels: xValues,
        datasets: [{
          backgroundColor: barColors,
          data: yValues
        }]
      },
      options: {
        title: {
          display: true,
          text: "World Wide Wine Production 2018"
        }
      }
    });


}


showChart=()=>{

    var xValues = ["Italy", "France", "Spain", "USA", "Argentina"];
    var yValues = [55, 49, 44, 24, 15];
    var barColors = ["red", "green","blue","orange","brown"];
    
    new Chart("myChart", {
      type: "bar",
      data: {
        labels: xValues,
        datasets: [{
          backgroundColor: barColors,
          data: yValues
        }]
      },
      options: {
        legend: {display: false},
        title: {
          display: true,
          text: "World Wine Production 2018"
        }
      }
    });

}


 getDate = async() =>{
   
        //let msg = 'บันทึกข้อมูลเรียบร้อย !'
        let msg = ''
    try{
            const resp = await axios.get(`http://localhost:5000/api/systemdate/getdate`)
            console.log(resp.data)
            sysdate = resp.data
        // console.log('response : ', "  ===>"+response.message )
    }catch(err){
        console.log(' ERRR ' , err.message)

    }

}
