const multer = require('multer');

const storage = multer.diskStorage({
    destination(req,file,cb){
        cb(null, './public/uploads/plant_group/')
    },
    filename(req, file, cb){
        cb(null,new Date().toISOString()+'-'+file.originalname)
    }
})

const types = ['image/png','image/jpeg','image/jpg']

const fileFilter = (req,res, cb)=>{
    if(types.includes(file.mimetype)){
        cb(null, true)
    }else{
        cb(null,false)
    }
}


module.exports = multer({storage})