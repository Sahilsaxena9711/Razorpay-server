const express = require('express');
const bodyParser = require('body-parser');
const Razorpay = require('razorpay');
var hmacSha256 = require("crypto-js/hmac-sha256");

var app = express();
app.use(bodyParser.json());

var instance = new Razorpay({
    key_id: 'rzp_test_kIh93cUpuVfzue',
    key_secret: 'Kq2GByY8E3uxIko9TFHJDqqK',
  });
  
app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Auth' );
    if(req.method == 'OPTIONS'){
        return res.sendStatus(200); 
    }
    next();
});

app.post('/create_order', (req, res) => {
    instance.orders.create({amount: req.body.amount ,currency: req.body.currency, receipt: req.body.receipt, payment_capture: req.body.payment_capture, notes: req.body.notes}).then((resp) => {
        res.send({
            status: 200,
            data: resp
        });
    }).catch((e) => {
        console.log(e)
    });
});

app.post('/capture_payment', (req, res) => {
    console.log(req.body)
    generated_signature = hmacSha256(req.body.order_id + "|" + req.body.payment_id, 'Kq2GByY8E3uxIko9TFHJDqqK');
    console.log(generated_signature == req.body.razorpay_signature);
    if (generated_signature == req.body.razorpay_signature) {
        instance.payments.capture(req.body.payment_id, req.body.amount, req.body.currency).then((resp) => {
            res.send({
                status: 200,
                data: resp
            });
        }).catch((e) => {
            console.log(e)   
        });
    }else{
        console.log('Not Successful')
    }
    
});

app.listen(8080, function () {
    console.log(`Starting app on port 8080`);
});