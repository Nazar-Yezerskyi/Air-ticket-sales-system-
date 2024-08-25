const app = require('./app.js')


const port = process. env.PORT || 5003

app.listen(port, function(){
    console.log(`Server on ${port}`)
})