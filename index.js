const express = require ("express")
const app = express();
const port = 8080
const bodyParser = require("body-parser")
const connection = require("./database/database")

const categoriesController = require("./categories/CategoriesController")
const articlesController = require("./articles/ArticlesController")
const UserController = require("./users/UserController")

const Article = require("./articles/Article")
const Category = require("./categories/Category")
const User = require("./users/User")

// view engine
app.set('view engine','ejs')

app.use(express.static('public')) // qualquer coisa
 
// body Parser
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

// Banco de dados = Conexão
connection.authenticate()
.then(() =>{
    console.log("Mysql conectado com Sucesso!")
}).catch(()=>{
    console.log(error) 
})

// Rotas de uso dos Controllers
app.use("/", categoriesController)
app.use("/", articlesController)
app.use("/", UserController)


app.get("/", (req,res)=>{

    Article.findAll({
        order:[
            ['id', 'DESC']
        ],
        limit: 4
    }).then( articles =>{
        Category.findAll().then( categories =>{
            res.render("index", { articles:articles, categories:categories})
        })
       
    })  
})

app.get("/:slug", (req,res)=>{
    var slug = req.params.slug
    Article.findOne({
        where: {
            slug:slug
        }
    }).then( article=>{
      if(article != undefined){

        Category.findAll().then( categories =>{
            res.render("article", { article:article, categories:categories})
        })
        
      } else{
          res.redirect("/")
      } 
    }).catch(err =>{
        res.redirect("/")
    })

})

app.get("/category/:slug", (req,res) =>{
    var slug = req.params.slug
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{ model:Article}]
    }).then( category =>{
        if(category != undefined){
            
            Category.findAll().then( categories => {
                res.render("index",{ articles: category.articles, categories: categories})
            })

        }else{
            res.redirect("/")
        }
    })
})

app.listen(port, ()=>{
    console.log(`Servidor iniciado na porta: ${port}`)
})