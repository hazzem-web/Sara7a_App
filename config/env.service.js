import dotenv from 'dotenv';

dotenv.config({path:'./config/.env'});

const mongoURI = process.env.MONGO_URI;
const REDIS_URI = process.env.REDIS_URI;
const Salt = process.env.SALT;
const Secret = process.env.SECRET;
const Port = process.env.PORT;
const envMood = process.env.MOOD
const Jwt_Key = process.env.JWT_KEY;
const JwtAdminSignature = process.env.JWT_ADMIN_SIGNATURE;
const JwtUserSignature = process.env.JWT_USER_SIGNATURE;
const JwtAdminRefreshSignature = process.env.JWT_ADMIN_REFRESH_SIGNATURE;
const JwtUserRefreshSignature = process.env.JWT_USER_REFRESH_SIGNATURE;
const BASE_URL = `${process.env.BASE_DOMAIN}${Port}`;
export { mongoURI , REDIS_URI , Salt , Secret , Port , envMood , Jwt_Key , JwtAdminSignature , JwtUserSignature , JwtAdminRefreshSignature , JwtUserRefreshSignature , BASE_URL};