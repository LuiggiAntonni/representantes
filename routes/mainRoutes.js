const express       = require('express');
const app           = express();
const router        = express.Router();
const bodyParser    = require('body-parser');

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));

router.get('/', (req, res, next) => {
    var payload = {
        pageTitle: "Home",
    }
    res.status(200).render('home');
});

router.get('/catalogo/:id', (req, res, next) => {
    var payload = {
        pageTitle: req.params.id,
    }
    console.log(payload.pageTitle)
    res.status(200).render('home', payload);
});

module.exports = router;