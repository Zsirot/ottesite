const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');

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




app.listen(3000, () => {
    console.log("APP IS LISTENING ON PORT 3000!")
})

