const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs')
const conn = require('../config/configdb');

exports.register = async (req,res) =>{
    
    const db = await conn('fposDb');
    if(db){
        try{
            const{user,password} = req.body
            console.log(user)        
            console.log(password)

            //1 check user
            const results = await db.query(`SELECT * FROM tbUser where user_name = '${user}';`);
            console.log(' user data length : ', results[0].length)
                // select user from DB  check avaible User
            if(results[0].length==0){
               // not avaiable to register
                res.status(200).send(req.body)
                // random 4 digit
                let val = Math.floor(1000 + Math.random() * 9000);
                const getId = await fnGenerateId(val,db)
                console.log('Random ',getId);
                const salt = await bcrypt.genSalt(10)


            }else{
                console.log(results[0])
                return res.status(200).send(' มี User นี้แล้ว')
            }
            //res.json(results[0]);
            db.end();

            //2 bcrypt password

            // const{user,password} = req.body
            // console.log(user)        
            // console.log(password)
            
        
        }catch(err){
            res.status(500).send(err)
        }

    }else{
        db.end();
        res.status(500).json({
           err : 'มีข้อผิดพลาด : ',
           msg : 'Error:file name->auth.js|path api post[/register]| register fail ---> Error Access denied'   
        })

    }  

}

const fnGenerateId = async (valIn,db)=>{
    
    const zeroPad = (num, places) => String(num).padStart(places, '0')
    let shopId =''
    for(let i =0;i<9999;i++){
        shopId = zeroPad(valIn, 4)
        const results = await db.query(`SELECT * FROM tbUser where shop_id = '${shopId}';`);
        if(results[0].length==0){
            console.log(' xx ', i + "  "+shopId)
            break;
        }
    }
    return shopId
    //console.log(zeroPad(5, 2)); // "05"
    //console.log('Out ',); // "0005"
}