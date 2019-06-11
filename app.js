const Koa = require('koa');
var bcrypt = require('bcrypt');
const Jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const AWS = require('aws-sdk') // make sure you have the credentials file in C:\Users\<Username>\.aws\ otherwise it won't connect

const app = new Koa();

// const pool = mysql.createPool({
//     host: 'cs407jialudb.c0ughbdye66r.us-east-2.rds.amazonaws.com',
//     user: 'cs407jialu',
//     database: 'cs407dba',
//     password: 'cs407pass',
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// });
const pool = require('@/config/dev').mysql('aws');
const promisePool = pool.promise()

const s3 = new AWS.S3({
    signatureVersion: 'v4',
    region: 'us-east-2'
});

const appsecret = 'secret'; //hard coded secret

app.use(async (ctx, next) => {

    const userA = {
        id: 0,
        username: 'aaa',
        email: 'aaa@gmail.com'
    }

    if (ctx.method === 'GET' && ctx.path === '/login'){

        //check username and password not implemented yet
        const dbres = await promisePool.execute(
            'create table users(Email varchar(255) not null, Pass varchar(255) not null, Username varchar(255) not null, primary key(Email));'
            );
        console.log(dbres);

        token = Jwt.sign({userA}, appsecret);
        ctx.body = token;
        return;
    }

    if (ctx.method === 'GET' && ctx.path === '/getprotected'){

        //check the authorization when the client wants to request upload and download
        if(!tokenIsVaild(ctx)){
            ctx.status = 403;
            return;
        }
        ctx.body = 'protectedcontent';
        return;
    }    
});

//function verifies if the authrization token from the client is vaild
function tokenIsVaild(ctx){
    bearerHeader = ctx.header['authorization'];
    token = bearerHeader.split(' ')[1];
    console.log(token);
    try{
        Jwt.verify(token, appsecret);
    }catch{
        return false;
    }
    return true;
}

/*
app.use(async (ctx, next) => {
    console.log("hellow1");
    ctx.body = 'Hello World';
});
*/

const myBucket = 'cs407projectjialu' // bucket name, don't change
const myKey = 'workingspace.zip' // Key is the id of the object, it should be <name provided by the user> + delimiter + uuid5 hashed user email
const signedUrlExpireSeconds = 60 * 5 //how long you want the url to be valid


var params = {Bucket: myBucket, Key: myKey};
//const urlUpload = s3.getSignedUrl('putObject', params); // the upload url to aws s3, use put request to upload
//const urlDownload = s3.getSignedUrl('getObject', params); // the download url to aws s3, use get request to download
//console.log(urlUpload);

app.listen(3000);
