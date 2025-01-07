const express = require('express')
const router = express.Router();
const mysql = require('mysql2/promise');
const conn = require('../config/configdb');
const dt = require('../config/system')
const multer = require('multer');
const fs = require('fs')
const XLSX = require('xlsx')
let filename =''

const storage = multer.diskStorage({
    destination :   function(req,file,cb){
        cb(null,'uploads')
    },filename : function(req,file,cb){
        const newDate = dt(); 
        filename = `${newDate}_${file.originalname}`
        cb(null,filename)
        console.log(' upload Success :  ',filename)


    }

})
const upload = multer({
    storage
})

router.post('/upload',upload.single('loadfile') ,async(req, res) => {

    const db = await conn('TestDB');

    if(db){
        try{
            console.log('file:upload.js[ api:/upload ] upload ok --> ')
            
            const scuu = await readTextFile(filename)
            //const succ =  await reeadExcel(filename)
            res.status(200).json({
                message:  req.file
            })

        }catch(err){
            console.error('Error : file:upload.js[ api:/upload ]-->' ,err.message);
            res.status(500).json({
                err : 'มีข้อผิดพลาด : ',
                msg : err.message
            })
        }

    }else{
        res.status(500).json({
            err : 'มีข้อผิดพลาด : ',
            msg : 'Error:file name->upload.js|path api post[/upload]| Upload fail ---> Error Access denied'   
        })
    } 

});

const reeadExcel= (fileIn)=>{

    try{
        path = require('path')   
        let filePath = path.join('uploads', 'Refsnes', '..', fileIn);
        console.log( ' FFF ',filePath)
   
        const workbook = XLSX.readFile(`${filePath}`);
        const sheet_name_list = workbook.SheetNames;
        const xlData = XLSX.utils.sheet_to_txt(workbook.Sheets[sheet_name_list[0]]);
        console.log(xlData);

    }catch(error){
        console.error('Error:file name->upload.js|path api post[/upload]| ',error);
    }
 }

const readTextFile =(fileIn)=>{
    
    path = require('path')   
    let filePath = path.join('uploads', 'Refsnes', '..', fileIn);
    console.log( ' FFF ',filePath)
    fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
        if (!err) {
            console.log('received data: ' + data);
        } else {
            console.log(err);
        }
    });
}

module.exports = router;

