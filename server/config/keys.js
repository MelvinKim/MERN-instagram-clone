
if(process.env.NODE_ENV ==='production'){
    module.exports = require('./prod')
}
else {
    module.exports = require('./dev')
}





// module.exports = {
//     MONGOURI: "mongodb+srv://Melvin:uv8vorVM0jrAF56B@cluster0-ccqyc.mongodb.net/<dbname>?retryWrites=true&w=majority",
//     JWT_SECRET : 'dhdjedkdcmqtwuwiqmsdlsnhfhksa;A'
// }
