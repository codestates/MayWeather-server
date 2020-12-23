const express = require('express');

const app = express();

app.use('/', (req,res)=> {
    res.send('Hello 메이웨더 형')
});

app.listen(5000, ()=> {
    console.log('서버 온 5000')
});