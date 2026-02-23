export const findOne = async ({
    model,
    filter = {},
    select = '',
    options = {}
})=>{
    let doc = model.findOne(filter);
    if (select.length) { 
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
    if (select.length) { 
        doc.select(select);
    }
    if(options.populate) { 
        doc.populate(options.populate);
    }
    return await doc
}


export const findOneAndUpdate = async({
    model,
    filter = {},
    update = {},
    options = {}
})=>{
    return await model.findOneAndUpdate(filter, update, options);
}




export const findOneAndDelete = async({
    model,
    filter = {},
    options = {}
})=>{
    model.findById()
    return await model.findOneAndDelete(filter , options)
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
    projections = null,
    options = {}
})=>{
    if (!id) {
        throw new Error("Id is required");
    } 

    return await model.findById(id,projections,options)
}





export const findByIdAndUpdate = async({
    model,
    id,
    update,
    options = {}
})=>{
    if (!id) {
        throw new Error("Id is required");
    } 

    return await model.findByIdAndUpdate(id, update, options);
}



export const findByIdAndDelete = async({
    model,
    id,
    options = {}
})=>{
    if (!id) {
        throw new Error("Id is required");
    }

    return await model.findByIdAndDelete(id,options);
}


