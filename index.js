const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const nodemailer = require('nodemailer');

if (process.env.NODE_ENV !== 'production') { //if we ar enot in production mode
    require('dotenv').config();//require our .env file,
}

const email = process.env.EMAIL

app.set('views', path.join(__dirname, 'views'));

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));



app.get('/', (req, res) => {
    res.render('home')
})
app.get('/contact', (req, res) => {
    res.render('contact')
})
app.post('/contact', (req, res) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.MAILPASS,
        }
    })
    const mailOptions = {
        from: req.body.email,
        to: process.env.EMAIL,
        subject: `Message from ${req.body.name}: ${req.body.subject}`,
        text: `Phone Number: ${req.body.phone}
        Email: ${req.body.email} 
        Message: ${req.body.message}`

    }
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.send('error')
        } else {
            console.log('Email Sent: ' + info.response)
            res.send('success')
        }
    })
})
app.get('/about', (req, res) => {
    res.render('about')
})
app.get('/services', (req, res) => {
    res.render('services')
})







app.listen(3000, () => {
    console.log("APP IS LISTENING ON PORT 3000!")
})

