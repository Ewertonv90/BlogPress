const express = require("express")
const router = express.Router()
const Category = require("../categories/Category")
const Article = require("./Article")
const slugify = require("slugify")

// lista de artigos
router.get("/admin/articles", (req,res)=>{

    Article.findAll({
        include: [ {model:Category}]
    }).then( articles=>{

        res.render("admin/articles/index" , { articles: articles})
    }) 
    
})

// novo artigo
router.get("/admin/articles/new", (req,res)=>{
    Category.findAll().then(categories =>{
        res.render("admin/articles/new" , { categories: categories})
    })
   
})

// salvar
router.post("/articles/save" , (req,res) =>{
    var title = req.body.title
    var body = req.body.body
    var category = req.body.category

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(()=>{
        res.redirect("/admin/articles")
    })
    
})

// deletar artigo

router.post("/articles/delete", (req,res)=>{
    var id= req.body.id
    if(id != undefined){ // se não for indefinido
        if(!isNaN(id)){

            Article.destroy({
                where:{
                    id:id
                }
            }).then( ()=>{
                res.redirect("/admin/articles")
            })

        }else{ // Não for numero
            res.redirect("/admin/articles")
        }
    }else{ // se for nullo
        res.redirect("/admin/articles")
    }
})

// editar artigo
router.get("/admin/articles/edit/:id" , (req,res) =>{
    var id = req.params.id

        if( isNaN(id)){
            res.redirect("/admin/articles/index")
            alert("Artigo não encontrado!")
        }

        
        Article.findByPk(id).then( article =>{
            if(article != undefined){

                Category.findAll().then( categories =>{
                    res.render("admin/articles/edit", {categories: categories, article:article})
                })
                

            }else{
                res.redirect("/")
                alert("Artigo não encontrado!")
            }
    }).catch( error =>{
            res.redirect("/")
    })
    

})

// atualizar artigo 
router.post("/articles/update", (req, res) => {
    var id= req.body.id
    var title = req.body.title
    var body = req.body.body
    var category = req.body.category

    Article.update({ title:title, body:body, categoryId:category, slug:slugify(title)},{
            where: { id: id }
    }).then(()=>{
        res.redirect("/admin/articles")
    }).catch(err =>{
        
    })
})

// paginação
router.get('/articles/page/:num',(req,res)=>{

    var page = req.params.num
    var offset = 0

    if (isNaN(page) || page == 1){
        offset = 0
    }else{
        offset= parseInt(page) * 4
    }

    Article.findAndCountAll({
        limit: 4,
        offset: offset,
        order:[
            ['id', 'DESC']
        ]
    }).then( articles =>{

        var next;
        if(offset + 4 >= articles.count){
            next = false
        }else{
            next = true
        }

        var result = {
            page : parseInt(page),
            next : next,
            articles : articles,
        }

        Category.findAll().then( categories =>{
            res.render('admin/articles/page', { result : result , categories: categories })
        })
        
    })
})

module.exports = router