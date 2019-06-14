module.exports = {
    env: 'dev',
    port: 700,
    mysql: {
        aws: {
            host: 'cs407jialudb.c0ughbdye66r.us-east-2.rds.amazonaws.com',
            user: 'cs407jialu',
            database: 'cs407dba',
            password: 'cs407pass',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        }
    },
    s3: {
        signatureVersion: 'v4',
        region: 'us-east-2'
    }
}
