const uploadFile = async () =>{

    const fileInput = document.getElementById('fileInput')
    const progressBar = document.getElementById('uploadProgress')
    const uploadPercentageDisplay = document.getElementById('uploadPercentage')

    if (!fileInput.files.length) {
        return JSAlert.alert('กรุณาเลือก File ---> กดปุ่ม Choose File')
    }

    const formData = new FormData();
    formData.append('loadfile', fileInput.files[0]);
    try{
        const response = await axios
        .post(`http://localhost:5000/api/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: function(progressEvent) {
            // เพิ่ม update progress กลับเข้า UI ไป
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            progressBar.value = percentCompleted
            uploadPercentageDisplay.innerText = `${percentCompleted}%`
          },
        })

        console.log(response.data)
        JSAlert.alert('Upload file สำเร็จ');
    
    }catch( err){
        console.log(err.message)
        JSAlert.alert('มีข้อผิดพลาด : Upload file ไม่สำเร็จ');

    }


}


const downloadFile = async () => {
  try{
    await axios({
      url: 'http://localhost:5000/api/download',
      method: 'GET',
      responseType: 'blob',
    }).then((response) => {
       const url = window.URL.createObjectURL(new Blob([response.data]));
       const link = document.createElement('a');
       link.href = url;
       link.setAttribute('download', 'Product.xlsx');
       document.body.appendChild(link);
       link.click();
       JSAlert.alert('Download file สำเร็จ');
      
    });
  } catch(error){
    console.log(error)
  }
};