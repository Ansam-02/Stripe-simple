import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import dotenv from 'dotenv';
import Stripe from 'stripe';



const STRIPE_KEY = 'pk_test_XXXXXXXXXXXXXXXXXXXXXXX';
const STRIPE_SECRET = 'sk_test_XXXXXXXXXXXXXXXXXXXX';

const stripe = new Stripe(STRIPE_SECRET, {
  apiVersion: '2023-10-16',
});

const app = express();  

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())


app.set('view engine', 'ejs');

dotenv.config();

const PORT = 8000;

app.get('/', (req, res) => {
  res.render('Home',{
    key:STRIPE_KEY
  });
});

app.post('/payment',(req,res)=>{
  stripe.customers.create({
    email:req.body.stripeEmail,
    source:req.body.stripeToken,
    name:'XpressCart',
    address:{
      line1:'27 oldtown',
      postal_code:'9020000',
      city:'Hebron',
      state:'West Bank',
      country:'Palestine'
    }
  })
  .then((customer)=> {
    return stripe.charges.create({
       amount:7000,
       description: '',
       currency: 'ils',
       customer:customer.id
    })
  })
  .then((charge) =>{
    console.log(charge)
    res.send("Success")
  })
  .catch((err) => {
    res.send(err)
  })

})



app.listen(PORT,()=>{
  console.log(`App is Running on ${PORT}`)
});

