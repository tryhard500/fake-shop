let express = require(`express`);
let app = express();
let port = 3000;

app.listen(port, function () {
    console.log(`http://localhost:${port}`);
})

// Раздача статики
app.use(express.static(`public`));

// Настройка handlebars
let hbs = require('hbs');
app.set('views', 'views');
app.set('view engine', 'hbs');


// Настройка БД
let mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/fake-shop');
let shema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    isOnSale: Boolean,
    likes: Number,
    category: String
});

let Product = mongoose.model('product',shema);
let sortUp = null;
// Роуты
app.get('/',async (req,res)=>{
    if (sortUp == null) {
        let data = await Product.find();
        res.render('index',{array: data});
    } else if (sortUp) {
        let data = await Product.find().sort({price: -1});
        res.render('index',{array: data});
    } else {
        let data = await Product.find().sort({price: 1});
        res.render('index',{array: data});
    }
});

app.get('/category',async (req,res)=>{
    let name  = req.query.name;
    let data = await Product.find({category: name});
    res.render('index',{array: data});
});

app.get('/discount',async (req,res)=>{
    let data = await Product.find({isOnSale: true})
                            .sort({price: 1})
                            .limit(10);
    res.render('index',{array: data})
});

app.get('/product',async (req,res)=>{
    let id = req.query.id;
    let data = await Product.findOne({_id: id});
    res.render('product',data)
});

app.get('/sortup',async (req,res)=>{
    sortUp = true;
    res.redirect('/');
});

app.get('/sortdown',async (req,res)=>{
    sortUp = false;
    res.redirect('/');
});