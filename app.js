const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const index = require('./routes/index')
const users = require('./routes/users')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
    extension: 'pug'
}))

// logger
const Koa = require('koa');
var bcrypt = require('bcrypt');
const Jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const AWS = require('aws-sdk') // make sure you have the credentials file in C:\Users\<Username>\.aws\ otherwise it won't connect

const app = new Koa();

const pool = mysql.createPool({
    host: 'cs407jialudb.c0ughbdye66r.us-east-2.rds.amazonaws.com',
    user: 'cs407jialu',
    database: 'cs407dba',
    password: 'cs407pass',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
const promisePool = pool.promise()

const s3 = new AWS.S3({
    signatureVersion: 'v4',
    region: 'us-east-2'
});

const appsecret = 'secret'; //hard coded secret

app.use(async(ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});


module.exports = app

//function verifies if the authrization token from the client is vaild
function tokenIsVaild(ctx) {
    bearerHeader = ctx.header['authorization'];
    token = bearerHeader.split(' ')[1];
    console.log(token);
    try {
        Jwt.verify(token, appsecret);
    } catch {
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
const myKey = 'workingspace.zip' // Key is the id of the object, it should be <name provided by the user> + delimiter + uuid5 hased user email
const signedUrlExpireSeconds = 60 * 5 //how long you want the url to be valid


var params = { Bucket: myBucket, Key: myKey };
//const urlUpload = s3.getSignedUrl('putObject', params); // the upload url to aws s3, use put request to upload
//const urlDownload = s3.getSignedUrl('getObject', params); // the download url to aws s3, use get request to download
//console.log(urlUpload);

app.listen(3000);