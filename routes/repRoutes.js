const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(bodyParser.urlencoded({
    extended: false
}));

const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}

router.get('/perfil', isLoggedIn, (req, res) => {
    var payload = {
        email: req.user._json.email,
        foto:  req.user._json.picture,
        nome: req.user._json.given_name
    }
    res.status(200).render('perfil', payload)
})

router.get('/catalogo/:email/:id', isLoggedIn, (req, res) => {
    var payload = {
        email: req.params.email,
        id: req.params.id
    }
    res.status(200).render('catalogoID', payload)
})

router.get('/catalogo/:email', (req, res) => {
    var payload = {
        email: req.params.email
    }
    res.status(200).render('catalogos', payload)
})

module.exports = router;