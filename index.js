import express from "express"
import session from "express-session"
import pkg from 'redis';
const { createClient } = pkg;


(async () => {
    const client = createClient();

    client.on('error', (err) => console.log('Redis Client Error', err));
    await client.connect();

    const subscribeDuplicar =  client.duplicate()
    await subscribeDuplicar.connect()

    subscribeDuplicar.subscribe("hopar",(message) => {
        count = message
    })

    // await client.set('value', 'mamikon');
    // const value = await client.get('value');

    // Node

    const app = express()
    var  count;
    let i = 1
    app.use(express.static("client/build"))
    app.use(session({
        secret:process.env.SECRET,
        saveUninitialized:false,
        resave:false
    }))
    app.use(express.json())
    app.use(express.urlencoded({extended:true}))
    app.get("/button", async (req,res) => {
        await client.publish("hopar",`${i}`)
        i++;if(i > 5){i = 0} 
        res.send({"message": count})
    })

    app.get("/receive",(req,res) => {
        subscribeDuplicar.subscribe("channel",(message) => {
            count = message 
            res.send("message")
        })
    })

    app.listen(process.env.PORT,() => {
        console.log("listening on ",process.env.PORT)
    })
})();


