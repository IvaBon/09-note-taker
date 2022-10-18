const express=require('express');
const need=require('./db/db.json')
const path=require('path');
const uuid=require('./helpers/uuid');
const fs = require('fs');


const app=express();
const PORT=process.env.PORT||3001;

app.use(express.static('public'));
app.use(express.json())

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'/public/index.html'))
})

app.get('/notes',(req,res)=>{
    res.sendFile(path.join(__dirname,'/public/notes.html'))
})

app.get('/api/notes',(req,res)=>{
    res.sendFile(path.join(__dirname,'/db/db.json'))
})

//post data
app.post('/api/notes',(req,res)=>{
    const { title, text }=req.body;

    if(title && text){
        const newNote={
            title,
            text,
            id:uuid(),
        };
        need.push(newNote);

        
        fs.writeFile('./db/db.json',JSON.stringify(need),(err)=>{
            if(err){
                res.status(400).json({msg:'error'})
            } else{
                res.status(200).json({msg:'success'})
            }
        })
    }  else{
        res.status(400).json({msg:'error'})
    }
})
// trying to dealth the data
app.delete('/notes/:id',(req,res)=>{

    fs.readFile(("./db/db.json"),"utf-8",function(err){
        err? console.log(err) : console.log('succes')
        
   
        const remove=need.filter(task=>task.id!==req.params.id)

        fs.writeFile('./db/db.json',JSON.stringify(remove),(err)=>{
            if(err){
                res.status(400).json({msg:'error'})
            } else{
                res.status(200).json({msg:'success'})
            }
        })
    
    });      
   

   
})


app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'/public/notes.html'))
})

app.listen(PORT,()=>{
    console.log(`Listening at http://localhost:${PORT}`)
})



