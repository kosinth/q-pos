
window.onload = async ()=>{
    await loadData()
}

const loadData = async() =>{

    let errmsg = document.getElementById('errMsg')
    console.log('on Load')
    try{
        const response = await axios.get('http://localhost:5000/api/getall')

        console.log(' Get data : ',response.data)
        const userDom = document.getElementById('product')
        let htmlData = '<div style="overflow-x:auto;">'
        htmlData += '<table >'
        htmlData +=  '<tr>'
        htmlData += '<th>Id</th>'
        htmlData += '<th>ชื่อ</th>'
        htmlData += '<th>นามสกุล</th>'
        htmlData += '<th>เพศ</th>'
        htmlData += '<th>อายุ</th>'
        htmlData += '<th>โปรแกรม</th>'
        htmlData += '<th>สิ่งที่สนใจ</th>'
        htmlData += '<th>ที่อยู่</th>'

        htmlData += '</tr>'
        for (let i =0;i<response.data.length;i++){
            let user = response.data[i]
                htmlData += ' <tr>'
                //table row
                htmlData += `<td>${user.Id}</td>`
                htmlData += `<td>${user.Fname}</td>`
                htmlData += `<td>${user.Lname}</td>`
                htmlData += `<td>${user.Sex}</td>`
                htmlData += `<td>${user.Age}</td>`
                htmlData += `<td>${user.Program}</td>`
                htmlData += `<td>${user.Interest}</td>`
                htmlData += `<td>${user.Address}</td>`
                //htmlData += `<td> <button class='edit' data-id='${'EDIT'} ${user.Id}'> Edit</button> </td>`
                htmlData += `<td> <a href='register.html?id=${user.Id}'> <button >Edit </button> </a> </td>`
                htmlData += `<td> <button class='delete' data-id='${user.Id}^${user.Fname}'> Delete</button> </td>`
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
                        loadData()
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
                const arrEdtId = editId.split(" ")
                console.log('EDIT -->',arrEdtId[0] + "  " + arrEdtId[1])
            })
        }

    }catch(err){
        if(err.response){
            console.log(err.response.data.message)
            errmsg.innerText = err.response.data.err + " " +err.response.data.msg
            errmsg.style.color = 'red'
        }
    }


}




