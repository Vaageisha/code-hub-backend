const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const {MongoClient}=require('mongodb');
const dotenv=require("dotenv");
var ObjectId= require("mongodb").ObjectId;

dotenv.config();
const uri=process.env.MONGO_URI;

let client;

async function connectClient(){
    if(!client){
       client = new MongoClient(uri);
       await client.connect();
    }
}

async function signup(req,res){
   const{username, password, email}=req.body;
   try{
    await connectClient();
    const db= client.db("gitclone"); //access
    const userCollection=db.collection("users");

    
    const salt= await bcrypt.genSalt(10);
    const hashedPassword= await bcrypt.hash(password, salt);

    const newUser={
        username,
        password:hashedPassword,
        email,
        repository:[],
        followedUser:[],
        starRepos:[]
    }

    const result = await userCollection.insertOne(newUser);

    const token=jwt.sign({id:result.insertedId},process.env.JWT_SECRET_KEY,{expiresIn:"1h"});
   res.json({token});
}
catch(err){
    console.error("Error during singup:", err.message);
    res.status(500).send("Server error");
}
  
} ;

async function login(req,res){
   const {email, password}=req.body;
   try{
      await connectClient();
      const db= client.db("gitclone"); //access
    const userCollection=db.collection("users");
 
     const user= await userCollection.findOne({email});
    if(!user){
        return res.status(400).json({message:"Invalid credentials"});

    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(400).json({message:"Invalid credentials"});

    }
    //token generation
    const token=jwt.sign({id:user._id}, process.env.JWT_SECRET_KEY, {expiresIn:"1hr"});
    res.json({token,userId:user._id});



   }
   catch(err){
    console.log("Error during login:",err.message);
    res.status(500).send("Server error!");
   }
};

async function getAllUsers (req,res){
 
    try{
 await connectClient();
      const db= client.db("gitclone"); //access
    const userCollection=db.collection("users");

    const users= await userCollection.find({}).toArray();
    res.json(users);
   }
   catch(err){
 console.log("Error during fetching:",err.message);
    res.status(500).send("Server error!");
   }
};



async function getUserProfile(req, res) {
  const currentID = req.params.id;

  if (!ObjectId.isValid(currentID)) {
    return res.status(400).json({ message: "Invalid user ID format" });
  }

  try {
    await connectClient();
    const db = client.db("gitclone");
    const userCollection = db.collection("users");

    const user = await userCollection.findOne({
      _id: new ObjectId(currentID),
    });

    console.log("User found:", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.send(user,{message:"Profile fetched!"});
  } catch (err) {
    console.log("Error during fetching:", err.message);
    res.status(500).send("Server error!");
  }
};


async function getUserProfile(req, res) {
  const currentID = req.params.id;

  if (!ObjectId.isValid(currentID)) {
    return res.status(400).json({ message: "Invalid user ID format" });
  }

  try {
    await connectClient();
    const db = client.db("gitclone");
    const userCollection = db.collection("users");

    const user = await userCollection.findOne({ _id: new ObjectId(currentID) });

    console.log("User found:", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile fetched!", user });
  } catch (err) {
    console.log("Error during fetching:", err.message);
    res.status(500).send("Server error!");
  }
}

async function updateUserProfile(req, res) {
  const currentID = req.params.id;
  const { email, password } = req.body;

  try {
    await connectClient();
    const db = client.db("githubclone");
    const usersCollection = db.collection("users");

    let updateFields = { email };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateFields.password = hashedPassword;
    }

    const result = await usersCollection.findOneAndUpdate(
      {
        _id: new ObjectId(currentID),
      },
      { $set: updateFields },
      { returnDocument: "after" }
    );
    if (!result.value) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.send(result.value);
  } catch (err) {
    console.error("Error during updating : ", err.message);
    res.status(500).send("Server error!");
  }
}

async function deleteUserProfile (req,res){
    const currentID= req.params.id;
    try{
       await connectClient();
    const db = client.db("gitclone");
    const userCollection = db.collection("users");

    const result= await userCollection.deleteOne({
          _id: new ObjectId(currentID)
    });

    if(result.deleteCount==0){
 return res.status(404).json({message:"User not found!"});
    }
    res.json({message:"User Profile deleted!"});
   }
   catch(err){
 console.log("Error during fetching:", err.message);
    res.status(500).send("Server error!");
   }
};


module.exports={
    getAllUsers,
    signup,
    login,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile
}