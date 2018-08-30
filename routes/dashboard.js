var express = require('express');
var router = express.Router();
var firebaseAdminDb = require('../connections/firebase_admin');

const categoriesRef= firebaseAdminDb.ref('categories');
const articlesRef = firebaseAdminDb.ref('articles');

router.get('/archives', function(req, res, next) {
    res.render('dashboard/archives', { title: '' });
});


// 文章頁面
router.get('/article/create', function(req, res) {
    categoriesRef.once('value').then((snapshot)=>{
        let catalogObj = snapshot.val();
        res.render('dashboard/article', { 
            catalogObj
        });
    })
});

// 文章更新後轉址位置
router.get('/article/:id', (req, res)=> {
    const id = req.param('id');
    let info = req.flash('info')
    // console.log(id)
    let catalogObj = {};
    categoriesRef.once('value').then((snapshot)=>{
        catalogObj = snapshot.val();
        // consloe.log(catalogObj);
        return articlesRef.child(id).once('value');
    }).then((snapshot)=>{
        let article = snapshot.val();
        // console.log(article);

        res.render('dashboard/article', { 
            catalogObj,
            article,
            info,
            hasInfo: info.length > 0
        });
    })
    
});

// 路徑頁面
router.get('/categories',(req, res) => {
    const msg = req.flash('info');
    categoriesRef.once('value').then((snapshot) => {
        // console.log('有喔');
        let categoryObj =snapshot.val();
        console.log(categoryObj);
        res.render('dashboard/categories', { 
            title: 'express',
            categoryObj,
            hasInfo: msg.length > 0,
            msg
        });
    });
    
});


// 新增文章
router.post('/article/create',(req,res)=>{
    // console.log(req.body);
    const data = req.body;
    const articleRef = articlesRef.push();
    const key = articleRef.key;
    const updateTime = Math.floor(Date.now() / 1000);
    data.id = key;
    data.updateTime = updateTime;

    articleRef.set(data).then(()=>{
        req.flash('info','已更新文章')
        res.redirect(`/dashboard/article/${key}`);
    })

    
})



// categories 新增 路徑
router.post('/categories/create',(req,res)=>{
    const data = req.body;
    const categoryRef = categoriesRef.push();
    // console.log(categoryRef.key);
    const key = categoryRef.key;
    data.id = key;

    categoriesRef.orderByChild('path').equalTo(data.path).once('value').then((snapshot)=>{
        if(snapshot.val() !== null){
            req.flash('info','已有相同路徑');
            res.redirect('/dashboard/categories');
        }else{
            categoryRef.set(data).then(()=>{
                res.redirect('/dashboard/categories');
            })
        }
    })
})

// categories 刪除 路徑
router.post('/categories/delete/:id',(req,res)=>{
    const id = req.param('id');
    categoriesRef.child(id).remove();
    req.flash('info','欄位已刪除');
    res.redirect('/dashboard/categories')
})

module.exports = router;

