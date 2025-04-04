const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const nodemailer = require("nodemailer");
// const Joi = require('joi');
const helmet = require("helmet");
const session = require("express-session");
const flash = require("connect-flash");
const videoData = require("./videoData");
const AppError = require("./utils/AppError");

app.set("views", path.join(__dirname, "views"));

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "notagoodsecret",
  name: "session",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    // secure: true,
    // sameSite: 'none'
  },
};

if (process.env.NODE_ENV !== "production") {
  //if we ar enot in production mode
  require("dotenv").config(); //require our .env file,
}

app.use(session(sessionOptions));
app.use(flash());
app.use(helmet());

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com",
  "https://kit.fontawesome.com",
  "https://cdnjs.cloudflare.com",
  "https://cdn.jsdelivr.net",
  "https://unpkg.com/aos@next/dist/aos.js",
  "https://code.jquery.com/jquery-3.6.0.min.js",
  "*.jotform.com",
  "*.jotfor.ms",
  "https://hcaptcha.com",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com",
  "https://stackpath.bootstrapcdn.com",
  "https://fonts.googleapis.com",
  "https://use.fontawesome.com",
  "https://cdn.jsdelivr.net",
  "https://cdnjs.cloudflare.com",
  "https://unpkg.com",
  "*.jotfor.ms",
  "*.jotform.com",
];
const childSrcUrls = [
  "https://www.youtube.com",
  "https://drive.google.com",
  "*.hcaptcha.com",
  "*.jotform.com",
];

const fontSrcUrls = [
  "https://fonts.gstatic.com",
  "https://cdnjs.cloudflare.com",
  "*.jotfor.ms",
];
const imageSrcUrls = ["https://cdn.jotfor.ms/", "*.jotfor.ms", "*.jotform.com"];
const connectSrcUrls = ["*.jotform.com"];

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: [
        "'unsafe-inline'",
        "'self'",
        "'unsafe-eval'",
        ...scriptSrcUrls,
      ],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      childSrc: ["blob:", ...childSrcUrls],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://images.unsplash.com",
        "https://i.ytimg.com",
        ...imageSrcUrls,
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/contact", (req, res) => {
  res.render("contact", {
    error: req.flash("error"),
    success: req.flash("success"),
  });
});
app.post("/contact", (req, res) => {
  // const contactSchema = Joi.object({
  //     name: Joi.string().required(),
  //     email: Joi.string().email().required(),
  //     phone: Joi.string().min(10).required(),
  //     subject: Joi.string().required(),
  //     message: Joi.string().required(),
  //     honey: Joi.string().allow('')
  // })
  // const { error } = contactSchema.validate(req.body)
  // if (error || contactSchema.honey !== undefined) {
  //     const msg = error.details.map(el => el.message).join(',')
  //     req.flash('error', msg);
  //     res.redirect('/contact');
  // } else {
  //     try {
  //         const transporter = nodemailer.createTransport({
  //             service: 'gmail',
  //             auth: {
  //                 user: process.env.SENDING_EMAIL,
  //                 pass: process.env.MAILPASS,
  //             }
  //         })
  //         const mailOptions = {
  //             from: req.body.email,
  //             to: process.env.RECIPIENT,
  //             subject: `JohnAOtte.com: Message from ${req.body.name}: ${req.body.subject}`,
  //             text: `Phone Number: ${req.body.phone}
  //     Email: ${req.body.email}
  //     Message: ${req.body.message}`
  //         }
  //         transporter.sendMail(mailOptions, (error, info) => {
  //             if (error) {
  //                 console.log(error);
  //                 throw new AppError('Outgoing message failed, please contact by phone', error.status)
  //             } else {
  //                 console.log('Email Sent: ' + info.response)
  //             }
  //         })
  //         req.flash('success', 'Message sent successfully')
  //         res.redirect('/contact')
  //     } catch (e) {
  //         throw new AppError('Outgoing message failed, please contact by phone', e.status)
  //     }
  // }
});
app.get("/about", (req, res) => {
  res.render("about");
});
app.get("/services", (req, res) => {
  res.render("services");
});
app.get("/video", (req, res) => {
  res.render("video", { videoData });
});
app.get("/writings", (req, res) => {
  res.render("writings");
});
app.get("/chapter1", (req, res) => {
  res.render("chapter1");
});
app.get("/chapter2", (req, res) => {
  res.render("chapter2");
});
app.get("/chapter3", (req, res) => {
  res.render("chapter3");
});
// app.get("/chapter4", (req, res) => {
//   res.render("chapter4");
// });
app.get("/chapter5", (req, res) => {
  res.render("chapter5");
});
app.get("/blog1", (req, res) => {
  res.render("blog1");
});
app.get("/blog2", (req, res) => {
  res.render("blog2");
});
app.get("/blog3", (req, res) => {
  res.render("blog3");
});
app.get("/blog4", (req, res) => {
  res.render("blog4");
});
app.get("/blog5", (req, res) => {
  res.render("blog5");
});
app.get("/blog6", (req, res) => {
  res.render("blog6");
});
app.get("/blog7", (req, res) => {
  res.render("blog7");
});
app.get("/blog8", (req, res) => {
  res.render("blog8");
});
app.get("/blog9", (req, res) => {
  res.render("blog9");
});
app.get("/holidayblog", (req, res) => {
  res.render("holidayblog");
});
app.get("/holidayblog2", (req, res) => {
  res.render("holidayblog2");
});

app.all("*", (req, res, next) => {
  next(new AppError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).render("error", { err, statusCode });
  // res.redirect(`${req.originalUrl}`) //save this for flash error redirection
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`APP IS LISTENING ON PORT ${port}`);
});
