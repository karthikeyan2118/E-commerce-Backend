const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get(`/`, async (req, res) =>{
    const userList = await User.find().select('-passwordHash');

    if(!userList) {
        res.status(500).json({success: false})
    } 
    res.send(userList);
})

router.get('get /:id', async(req,res)=>{
  
    const user = await User.findById(req.params.id).select('-passwordHash');

    if(!user) {
        res.status(500).json({message: 'The user with the given ID was not found.'})
    } 
    res.status(200).send(user);
})

router.post('/', async (req,res)=>{
    try{
    console.log(req.body)  ;  let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    })
    user = await user.save();


    if(!user)
    return res.status(400).send('the user cannot be created!')

    res.send(user);
}catch(e){
    console.log(e)
}
})

router.put('/:id',async (req, res)=> {

    const userExist = await User.findById(req.params.id);
    let newPassword
    if(req.body.password) {
        newPassword = bcrypt.hashSync(req.body.password, 10)
    } else {
        newPassword = userExist.passwordHash;
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            passwordHash: newPassword,
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country,
        },
        { new: true}
    )

    if(!user)
    return res.status(400).send('the user cannot be created!')

    res.send(user);
})

router.post('/login', async (req,res) => {
    const user = await User.findOne({email: req.body.email})
    const secret = process.env.secret;
    if(!user) {
        return res.status(400).send('The user not found');
    }

    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin
            },
            secret,
          
        )
       
        res.status(200).send({user: user.email , token: token}) 
    } else {
       res.status(400).send('password is wrong!');
    }

    
})


router.post('/register', async (req,res)=>{
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    })
    user = await user.save();

    if(!user)
    return res.status(400).send('the user cannot be created!')

    res.send(user);
})


router.delete('/:id', (req, res)=>{
    User.findByIdAndRemove(req.params.id).then(user =>{
        if(user) {
            return res.status(200).json({success: true, message: 'the user is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "user not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})

router.get(`/get/count`, async (req, res) =>{
    const userCount = await User.countDocuments((count) => count)

    if(!userCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        userCount: userCount
    });
})


const aggregationPipeline = [
    
     {
        $project:{
            username:{ $toUpper: "$name"},
        }
    },
     {
        $sort:{
            username:1

     }  
    }
];

router.get('/aggregation',async (req, res) =>{
    try {
        // let user = true//await User.findOne({})
        // console.log(user)
        // console.log("1", User.find())
        const users = await User.aggregate(aggregationPipeline);
          res.send(users);
      
    }
    catch(error){
        console.error("Error executing aggregation:",err);
        res.status(500).send("Internal Server Error");
    }


    });


    const aggregation = [
  {
    $group: {
      _id: "$country",
      count: { $sum: 1 },
      users: { $push: "$$ROOT" }
    }
  },
  {
    $project: {
      _id: 0,
      country: "$_id",
      count: 1,
      users: {
        $map: {
          input: "$users",
          as: "user",
          in: {
            username: "$$user.name",         
            email: "$$user.email",
            passwordHash: "$$user.passwordHash",
            phone: "$$user.phone",
            isAdmin: "$$user.isAdmin",
            address: {
              street: "$$user.street",
              apartment: "$$user.apartment",
              zip: "$$user.zip",
              city: "$$user.city",
              country: "$$user.country"
            }
          }
        }
      }
    }
  }
];
    router.get('/aggregation/group',async (req, res) =>{
        try {
            // let user = true//await User.findOne({})
            // console.log(user)
            // console.log("1", User.find())
            const users = await User.aggregate(aggregation);
              res.send(users);
          
        }
        catch(error){
            console.error("Error executing aggregation:",err);
            res.status(500).send("Internal Server Error");
        }
    
    
        });










// const users = db.users.("e-commerceshop_database") ;
// users.aggregate(aggregationpipeline).toArray((err,result)=>{
//     if (err){
//         console.error("Error executing aggregatin:",err);
//         return;
//     }
//     console.log("Aggregation result:",result);
//     users.close();

// });

















module.exports =router;