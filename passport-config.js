const Localstrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

function init(passport, getUserByEmail, getUserByid){

    console.log("I am init now")

    const authenticateUser = async (email, password, done) => {
        
        const user = getUserByEmail(email);

        if(user === (null || undefined)){
            return done(null , false , {message : "No user with that email"})
        }

        try {
            if(await bcrypt.compare(password, user.password)){
                return done(null , user);
            }else{
                return done(null, false, {message : "Incorrect credentials"})
            }
        } catch (error) {
            return done(error);
        }

    }

    //Below usernameField is the field name which is considered from the payload request
    // usernameField - Optional, defaults to 'username'
    // passwordField - Optional, defaults to 'password'

    passport.use(new Localstrategy({usernameField : "email" , passwordField : "password"} , authenticateUser))

    /*
    The user used in seralizeUser is the ONE THAT IS PASSED IN THE DONE CALLBACK FN LINE-18 OF THIS PAGE AND WE ARE SERIALIZE THE ID PROPERTY OF THE USER 
    The structure of the user object is - 
        {
            id : Date.now().toString(),
            name : req.body.name,
            email : req.body.email,
            password : hashedPassword
        }
    */
    passport.serializeUser((user , done) => done(null , user.id));

    /*
        Now coming to deseralizing, we are deseralizing what we chose to serialize which is the ID property, hence we pass the id as the first parameter in the deserialaizeFunction below, and the second parameter done, and within it, the done function is supposed to get null as first arg, and the actual userObj as the second arg

        After serializeUser and deserializeuser, the req Object will have a user field attached to it which will be the user object sent in Line 18
    */

    passport.deserializeUser((id , done) => {
        done(null , getUserByid(id));
    });
}

module.exports = init;