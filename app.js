const Koa = require('koa');
var bcrypt = require('bcrypt');
const Jwt = require('jsonwebtoken');
const AWS = require('aws-sdk') // make sure you have the credentials file in C:\Users\<Username>\.aws\ otherwise it won't connect

const app = new Koa();

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

const myBucket = 'cs407projectjialu'
const myKey = 'workingspace.zip'
const signedUrlExpireSeconds = 60 * 5


var params = {Bucket: myBucket, Key: myKey};
const urlUpload = s3.getSignedUrl('putObject', params); // the upload url to aws s3, use put request to upload
const urlDownload = s3.getSignedUrl('getObject', params); // the download url to s3, use get request to download
console.log(urlUpload);

app.listen(3000);