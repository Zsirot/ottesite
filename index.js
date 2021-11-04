const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const nodemailer = require('nodemailer');
const helmet = require('helmet')
const session = require('express-session')



app.set('views', path.join(__dirname, 'views'));

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const sessionOptions = {
    secret: 'notagoodsecret',
    name: 'session',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        secure: true,
        sameSite: 'none'
    }
}

if (process.env.NODE_ENV !== 'production') { //if we ar enot in production mode
    require('dotenv').config();//require our .env file,

}

app.use(session(sessionOptions))


app.use(helmet())


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
    "https://unpkg.com/aos@next/dist/aos.js"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com",
    "https://stackpath.bootstrapcdn.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
    "https://cdn.jsdelivr.net",
    "https://cdnjs.cloudflare.com",
    "https://unpkg.com"
];
const childSrcUrls = [
    "https://www.youtube.com",
    "https://drive.google.com"
]

const fontSrcUrls = [
    "https://fonts.gstatic.com",
    "https://cdnjs.cloudflare.com",
];

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            "require-trusted-types-for": ["'script'"],
            defaultSrc: [

            ],
            connectSrc: ["'self'"],
            scriptSrc: ["'unsafe-inline'", "'self'", "'unsafe-eval'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:", ...childSrcUrls],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://images.unsplash.com",
                "https://i.ytimg.com"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

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

