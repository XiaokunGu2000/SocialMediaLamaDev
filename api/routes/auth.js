const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// register
router.post("/register", async (req, res) => {

    try {
        // generate password
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(req.body.password, salt);
        
        // create new user
        const newuser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedpassword,
            city: req.body.city,
            from: req.body.from,
            desc: req.body.desc,
            relationship: req.body.relationship
        });

        // return response
        const user = await newuser.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({email:req.body.email});
        !user && res.status(404).json("user not found");
        
        const validpassword = await bcrypt.compare(req.body.password, user.password);
        !validpassword && res.status(400).json("wrong password");

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
});


module.exports = router
