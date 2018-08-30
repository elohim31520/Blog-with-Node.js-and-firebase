var express = require('express');
var router = express.Router();
var firebaseAdminDb = require('../connections/firebase_admin');

const categoriesRef= firebaseAdminDb.ref('categories');


router.get('/archives', function(req, res, next) {
    res.render('dashboard/archives', { title: '' });
});

router.get('/article', function(req, res, next) {
    res.render('dashboard/article', { title: '' });
});

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

