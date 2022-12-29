const express = require('express')
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;


app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster1.xcc9tty.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log(uri)

async function run() {
    try{
        const myTaskCollection = client.db('taskSite').collection('myTasks')
        const completedTaskCollection = client.db('taskSite').collection('completedTasks')

        app.get('/myTasks', async(req, res) => {
            const query ={}
            const result = await myTaskCollection.find(query).toArray()
            res.send(result)
        })
        app.get('/myTask/:id', async(req, res) => {
            const id = req.params.id
            const query ={_id: ObjectId(id)}
            const result = await myTaskCollection.findOne(query)
            res.send(result)
        })
        app.get('/completedTasks', async (req, res) => {
            const query = {}
           
            const result = await completedTaskCollection.find(query).sort({index: -1}).toArray()
            res.send(result)
        })

        app.post('/myTask', async (req, res) => {
            const task = req.body
           
            const result = await myTaskCollection.insertOne(task)
            res.send(result)
        })
        app.post('/completedTasks', async (req, res) => {
            const completedTask = req.body
           
            const result = await completedTaskCollection.insertOne(completedTask)
            res.send(result)
        })
        app.put('/myTask/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const task = req.body;
            const options = {upsert: true}
            const updateTask = {
                $set: task
                
            }
            const result = await myTaskCollection.updateOne(query, updateTask,options)
            res.send(result)
        })
        app.put('/completedTask/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const completdTask = req.body;
            const options = {upsert: true}
            const updateCompletedTask = {
                $set: completdTask
                
            }
            const result = await completedTaskCollection.updateOne(query, updateCompletedTask,options)
            res.send(result)
        })
        app.delete('/myTask/:id', async(req, res) => {
            const id = req.params.id
         
           const query = {_id: ObjectId(id)}
         
           const myTask = await myTaskCollection.deleteOne(query)
       
           res.send(myTask)
           })
        app.delete('/completedTasks/:id', async(req, res) => {
            const id = req.params.id
         
           const query = {_id: ObjectId(id)}
         
           const completedTasks = await completedTaskCollection.deleteOne(query)
       
           res.send(completedTasks)
           })

    }
    finally{

    }

}
run().catch(err => console.log(err))
















app.get('/', (req, res) => {
    res.send('task server is running')
})
app.listen(port, () => {
    console.log('task running on ', port)
})