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

router.get('/categories',(req, res, next) => {
    categoriesRef.once('value').then((snapshot) => {
        // console.log('有喔');
        let categoryObj =snapshot.val();
        res.render('dashboard/categories', { 
            title: 'express',
            categoryObj
        });
    });
    
    
});

router.post('/categories/create',(req,res)=>{
    const data = req.body;
    const categoryRef = categoriesRef.push();
    // console.log(categoryRef.key);
    const key = categoryRef.key;
    data.id = key;
    categoryRef.set(data).then(()=>{
        res.redirect('/dashboard/categories')
    })
})

module.exports = router;

