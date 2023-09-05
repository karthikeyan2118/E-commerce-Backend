const Category = require('../models/category');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) =>{
    const categoryList = await Category.find();

    if(!categoryList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(categoryList);
})

router.get('getcategory/:id', async(req,res)=>{
    const category = await Category.findById(req.params.id);

    if(!category) {
        res.status(500).json({message: 'The category with the given ID was not found.'})
    } 
    res.status(200).send(category);
})



router.post('/', async (req,res)=>{
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    })
  
    category = await category.save();

    if(!category){
    return res.status(400).send('the category cannot be created!')
    }

   return res.send(category);
})


router.put('/:id',async (req, res)=> {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            icon: req.body.icon || category.icon,
            color: req.body.color,
        },
        { new: true}
    )

    if(!category)
    return res.status(400).send('the category cannot be created!')

    res.send(category);
})

router.delete('/:id', (req, res)=>{
    Category.findByIdAndRemove(req.params.id).then(category =>{
        if(category) {
            return res.status(200).json({success: true, message: 'the category is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "category not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})














// const aggrevar = [
//     {
//         $group:{
//             _id:"$category",
//             count:{$sum:1}
//         }
//     }
// ];
// router.get('/aggrevar',async (res,req)=>{
//     try{
//          const category = await Category.aggregate(aggrevar);
//          res.send(category);
//     }
//     catch(error){
//         console.error("Error in executing aggregation:",error);
//         return res.status(500).send("Internal server error")

//     }
// });











const aggregationvar = [
         {
               $group:{
                 _id:"$category",
                 count:{$sum:1}
             }
         }
    ];
router.get('/aggregation',async (req, res) =>{
   try {
      
       const cate = await Category.aggregate(aggregationvar);
         res.send(cate);
     
   }
   catch(error){
       console.error("Error executing aggregation:",error);
       res.status(500).send("Internal Servers Error");
   }


   });


module.exports = router;