import multer from 'multer';
import fs from 'node:fs';

export let extensions = {
    image: [ 'image/jpeg' , 'image/jpg' , 'image/webp' , 'image/png'],
    video: [ 'video/mp4' , 'video/webm' , 'video/ogg' ],
    pdf  : [ 'application/pdf' ]
}

export const upload = ({customPath = 'general' , allowedExtensions = [] , maxSize = 5} = {})=>{
    let storage = multer.diskStorage({
        destination: function(req ,file , cb){
            let filesPath = `uploads/${customPath}`;
            if (!fs.existsSync(filesPath)) { 
                fs.mkdirSync(filesPath,{recursive:true});
            }
            cb(null, filesPath);
        },

        filename: function(req,file,cb){
            let prefix = Date.now();
            let filename = `${prefix}-${file.originalname}`;
            cb(null,filename);
        }
    })


    let fileFilter = function(req,file,cb){
        if (!allowedExtensions.includes(file.mimetype)) { 
            return cb(new Error("file type is not allowed") , false);
        }
        cb(null , true);
    }

    return multer({storage , fileFilter , limits:{fileSize: maxSize * 1024 * 1024}})
}