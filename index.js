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
const crypto = require("crypto");
const events = require("./store/events");
const substack = require("./store/substack");

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
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 7,
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
  "data:",
];
const imageSrcUrls = ["https://cdn.jotfor.ms/", "*.jotfor.ms", "*.jotform.com"];
const connectSrcUrls = [
  "*.jotform.com",
  "https://cdn.jsdelivr.net",
  "https://www.youtube.com",
  "https://youtube.com",
];

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
      frameSrc: [
        "'self'",
        "https://www.youtube.com",
        "https://youtube.com",
        "https://form.jotform.com",
        "*.jotform.com",
      ],
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
      mediaSrc: ["'self'", "https://www.youtube.com", "https://youtube.com"],
    },
  })
);

// Truncate to n chars at a word boundary, adding an ellipsis when clipped.
function truncate(str, n) {
  const s = String(str || "").trim();
  if (s.length <= n) return s;
  let cut = s.slice(0, n);
  const lastSpace = cut.lastIndexOf(" ");
  if (lastSpace > n * 0.6) cut = cut.slice(0, lastSpace);
  return cut.trimEnd() + "…";
}

app.get("/", (req, res) => {
  const title = substack.getLatestTitle();
  res.render("home", { latestPost: title ? truncate(title, 70) : null });
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
// app.get("/video", (req, res) => {
//   res.render("video", { videoData });
// });
// app.get("/writings", (req, res) => {
//   res.render("writings");
// });
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

// ===========================================================================
// Calendar (public) + admin (single-password login)
// ===========================================================================
function requireAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) return next();
  return res.redirect("/login");
}

// Constant-time comparison against the password in ADMIN_PASSWORD.
function passwordMatches(input) {
  const expected = process.env.ADMIN_PASSWORD || "";
  if (!expected) return false;
  const a = Buffer.from(String(input || ""));
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// Simple in-memory brute-force limiter for /login: after MAX_LOGIN_ATTEMPTS
// failures from one IP, lock that IP out for LOGIN_WINDOW_MS.
const loginAttempts = new Map(); // ip -> { count, resetAt }
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

function loginLockRemaining(ip) {
  const rec = loginAttempts.get(ip);
  if (rec && rec.count >= MAX_LOGIN_ATTEMPTS && Date.now() < rec.resetAt) {
    return rec.resetAt - Date.now();
  }
  return 0;
}

function recordFailedLogin(ip) {
  const now = Date.now();
  let rec = loginAttempts.get(ip);
  if (!rec || now >= rec.resetAt) rec = { count: 0, resetAt: now + LOGIN_WINDOW_MS };
  rec.count += 1;
  if (rec.count >= MAX_LOGIN_ATTEMPTS) rec.resetAt = now + LOGIN_WINDOW_MS; // (re)start the lockout
  loginAttempts.set(ip, rec);
  // Keep the map from growing without bound under a distributed attack.
  if (loginAttempts.size > 5000) {
    for (const [k, v] of loginAttempts) if (now >= v.resetAt) loginAttempts.delete(k);
  }
}

function clearLoginAttempts(ip) {
  loginAttempts.delete(ip);
}

// Add display fields (month/day badge + a human "when") for the calendar view.
function formatEvent(ev) {
  const d = new Date(ev.start);
  if (isNaN(d.getTime())) return { ...ev, month: "", day: "", when: ev.start };
  const hasTime = /T\d{2}:\d{2}/.test(ev.start) && !/T00:00(:00)?$/.test(ev.start);
  let when = d.toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  if (hasTime) {
    when += " · " + d.toLocaleString("en-US", { hour: "numeric", minute: "2-digit" });
  }
  return {
    ...ev,
    month: d.toLocaleString("en-US", { month: "short" }).toUpperCase(),
    day: d.toLocaleString("en-US", { day: "numeric" }),
    when,
  };
}

app.get("/calendar", (req, res) => {
  res.render("calendar", { events: events.upcoming().map(formatEvent) });
});

app.get("/login", (req, res) => {
  if (req.session.isAdmin) return res.redirect("/admin");
  res.render("login", { error: req.flash("error") });
});

app.post("/login", (req, res) => {
  const lockMs = loginLockRemaining(req.ip);
  if (lockMs > 0) {
    req.flash("error", `Too many attempts. Please wait ${Math.ceil(lockMs / 60000)} minute(s) and try again.`);
    return res.redirect("/login");
  }
  if (!passwordMatches(req.body.password)) {
    recordFailedLogin(req.ip);
    req.flash("error", "Incorrect password.");
    return res.redirect("/login");
  }
  clearLoginAttempts(req.ip);
  // Regenerate the session on login to prevent session fixation.
  req.session.regenerate((err) => {
    if (err) {
      req.flash("error", "Something went wrong. Please try again.");
      return res.redirect("/login");
    }
    req.session.isAdmin = true;
    res.redirect("/admin");
  });
});

app.post("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

app.get("/admin", requireAdmin, (req, res) => {
  res.render("admin", {
    events: events.all(),
    max: events.MAX_EVENTS,
    success: req.flash("success"),
    error: req.flash("error"),
  });
});

app.post("/admin/events", requireAdmin, (req, res) => {
  const { title, start } = req.body;
  if (!title || !title.trim() || !start) {
    req.flash("error", "A title and a date/time are both required.");
    return res.redirect("/admin");
  }
  // events.add() truncates over-long fields and returns false when at capacity.
  if (!events.add(req.body)) {
    req.flash("error", `You can have at most ${events.MAX_EVENTS} events. Remove one before adding another.`);
    return res.redirect("/admin");
  }
  req.flash("success", "Event added.");
  res.redirect("/admin");
});

app.post("/admin/events/:id/delete", requireAdmin, (req, res) => {
  events.remove(req.params.id);
  req.flash("success", "Event removed.");
  res.redirect("/admin");
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
