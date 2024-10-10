const mongoose= require('mongoose');
const {isEmail}=require('validator');
const bcrypt=require('bcrypt');
const userSchema =new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:[true,'Please enter the email'],
        lowercase:true,
        validate: [isEmail,'Please enter the valid email'] 
    },
    password:{
        type:String,
        required:[true,'Please enter the password'],
        minlength:[6,'Min length is six charcaters']

    },
});

//Fire a function after doc is saved 
userSchema.post('save',function(doc,next){
    console.log('new user was created & saved',doc);
    next();
})

// fire a function before doc saved to db
userSchema.pre('save',async function(next){
    const salt=await bcrypt.genSalt();
    this.password=await bcrypt.hash(this.password,salt);
     console.log('User about to be created & saved',this);
     next();
});

//Static file to login user
userSchema.statics.login= async function(email,password){
    const user=await this.findOne({email});
    if(user){
    const auth=await bcrypt.compare(password,user.password);
    if(auth){
        return user;
    }
    throw Error('incorrect password')
    }
    throw Error('incorrect email')
}

const User= mongoose.model('user',userSchema);
module.exports=User;
