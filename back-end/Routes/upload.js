const express = require('express')
const router = express.Router();
const mysql = require('mysql2/promise');
const conn = require('../config/configdb');
const fs = require('fs')


const multer = require('multer');
const storage = multer.diskStorage({
    destination :   function(req,file,cb){
        cb(null,'uploads')
    },filename : function(req,file,cb){
        const filename = ` ${new Date().toLocaleDateString("fr-CA", {year:"numeric", month: "2-digit", day:"2-digit"})}_${file.originalname}`
        cb(null,filename)
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

module.exports = router;

