import { verifyID } from "../common/index.js";


export const findOne = async ({
    model,
    filter = {},
    select = '',
    options = {}
})=>{
    let doc = model.findOne(filter);
    if (select) { 
        doc.select(select);
    }
    if (options.populate) { 
        doc.populate(options.populate);
    } 
    return await doc
}




export const findAll = async({
    model,
    filter = {},
    select = '',
    options = {}
})=>{
    let doc = model.find(filter);
    if (select) { 
        doc.select(select);
    }
    if(options.populate) { 
        doc.populate(options.populate);
    }
    return await doc
}


export const updateOne = async({
    model,
    filter = {},
    update = {},
    options = {}
})=>{
    return await model.updateOne(filter,update,options)
}

export const updateMany = async({
    model,
    filter = {},
    update = {},
    options = {}
})=>{
    return await model.updateMany(filter,update,options)
}

export const deleteOne = async({
    model,
    filter = {},
    options = {}
})=>{
    let doc = await model.deleteOne(filter);
    if (options.populate) { 
        doc.populate(options.populate);
    }
    return await doc;
}


export const deleteMany = async({
    model,
    filter = {},
    options = {}
})=>{
    let doc = model.deleteMany(filter);
    if (options.populate) { 
        doc.populate(options.populate);
    }
    return await doc;
}




export const findOneAndUpdate = async({
    model,
    filter = {},
    update = {},
    select = '',
    options = {}
})=>{
    let doc = model.findOneAndUpdate(filter, update, options);
    if (select) { 
        doc.select(select);
    }
    return await doc;
}




export const findOneAndDelete = async({
    model,
    filter = {},
    select = '',
    options = {}
})=>{
    let doc = model.findOneAndDelete(filter , options);
    if(select) { 
        doc.select(select);
    }
    return await doc;
}


export const insertOne = async({
    model,
    data = {},
    options = {}
}) =>{
    return await model.insertOne(data , options);
}


export const insertMany = async({
    model,
    data = [],
    options = {}
})=>{
    return await model.insertMany(data , options)
}


export const findById = async({
    model,
    id,
    select = '',
    options = {}
})=>{
    if (!id) {
        throw new Error("Id is required");
    } 
    verifyID(id);

    let doc = model.findById(id,null,options);
    if (select) { 
        doc.select(select);
    }
    return await doc;
}





export const findByIdAndUpdate = async({
    model,
    id,
    update,
    select = '',
    options = {}
})=>{
    if (!id) {
        throw new Error("Id is required");
    } 
    verifyID(id);

    let doc = model.findByIdAndUpdate(id, update, options);
    if (select) { 
        doc.select(select);
    }
    return await doc; 
}



export const findByIdAndDelete = async({
    model,
    id,
    select = '',
    options = {}
})=>{
    if (!id) {
        throw new Error("Id is required");
    }
    verifyID(id);
    
    let doc = model.findByIdAndDelete(id,options);
    if (select) { 
        doc.select(select);
    }
    return await doc;
}


