const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const nodemailer = require('nodemailer');

if (process.env.NODE_ENV !== 'production') { //if we ar enot in production mode
    require('dotenv').config();//require our .env file,
}

app.set('views', path.join(__dirname, 'views'));

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));


const videoData = [
    {
        title: 'How do you think about psychotherapy?',
        url: 'THdbhMlBmJ0',
        img: 'thumb1.jpg'
    },
    {
        title: 'How long have you been practicing psychotherapy?',
        url: '_XRtKqMjBfc',
        img: 'thumb2.jpg'
    },
    {
        title: 'How do people change?',
        url: 'EyJ3BkobeqU',
        img: 'thumb3.jpg'
    },
    {
        title: 'What to expect during a first session',
        url: 'QthnhTG8aj0',
        img: 'thumb4.jpg'
    },
    {
        title: 'How do you treat depression?',
        url: '4DK8GZySKQk',
        img: 'thumb5.jpg'
    },
    {
        title: 'How do you treat anxiety?',
        url: 'CEfaE8EfIz8',
        img: 'thumb6.jpg'
    },
    {
        title: 'How do you treat addiction?',
        url: 'JSSoRhMNgw4',
        img: 'thumb7.jpg'
    },
]





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
    res.redirect('/contact')
})
app.get('/about', (req, res) => {
    res.render('about')
})
app.get('/services', (req, res) => {
    res.render('services')
})
app.get('/videos', (req, res) => {
    res.render('videos', { videoData })
})






const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`APP IS LISTENING ON PORT ${port}`)
})

