import { BadRequestException } from "../common/utils/responses/error.response.js";
import { client } from "./redis.js";

export const set = async ({key , value , ttl}={})=>{
    if (typeof value == 'object') { 
        value = JSON.stringify(value);
    }
    let data = await client.set(
        key,
        value,
        {EX: ttl}
    )
    return data;
}


export const get = async(key)=>{
    let data = await client.get(key);
    try {
        data = JSON.parse(data);
    } catch (error) {
    }
    return data;
}


export const ttl = async(key)=>{
    let data = await client.ttl(key);
    return data;
}

export const exists = async(key)=>{
    let existedData = await client.exists(key);
    return existedData;
}

export const redisDelete = async(key)=>{
    let deletedData = await client.del(key);
    return deletedData;
}

export const mSet = async(...keys)=>{
    let data = await client.mSet(keys);
    return data;
}

export const mget = async(...keys)=>{
    let data = await client.mGet(keys);
    return data;
}


export const keys = async(prefix)=>{
    let data = await client.keys(`${prefix}*`)
    return data;
}
