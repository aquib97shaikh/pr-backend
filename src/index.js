//importing modules
const express = require("express");
const bodyParser = require("body-parser");
const { PrModels } = require("./PrModel");
const config = require("./config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const port = 9999;
const app = express();
const cors = require("cors");

// ////////////////////////////// Middleware //////////////////////////////
app.use(cors({
  credentials:true,
  origin:"http://localhost:3000"
}));
app.use(express.urlencoded());
app.use(express.json());
app.use(bodyParser.urlencoded({ extendend: false }));
app.use(bodyParser.json());
app.use((req,res,next)=>{
  const {url,query} =req;
  console.log({url,query});
  next();
});
const AuthMiddleware = async (req,res,next) =>{
  let  token= req.headers["x-jtoken"];
  if(!(token)) return res.status(401).send({er:"No token found",auth:false});
  jwt.verify(token,config.SECRET_KEY,async (err,decode)=>{
    if(err) return res.status(500).send({auth:false,er:"Authentication failed"});
    let result =await PrModels.Student.find({
      username:decode.username,
    });
    req.user =result[0]
    next()
  })
}



// ################################ UTILS function ########################
const isNoU = (val) => val===null || val===undefined || val===""


//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ Api $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
app.post("/login", async (req, res) => {
  let result = await PrModels.Student.find({
    username: req.body.username,
  });
  if (result.length > 0) {
    const isPasswordValid = bcrypt.compareSync(req.body.pwd,result[0].pwd);

    if(!isPasswordValid) return res.status(403).send({ er: "Password incorrect! " });
    let token = jwt.sign({ username :req.body.username}, config.SECRET_KEY, {
      expiresIn: 24 * 60 * 60 * 1000,
    });
    res.send({
      user:result[0],token
    });
  } else {
    res.status(403).send({
      er: `username ${req.body.username} does not exist!`,
    });
  }
});
app.post("/signup", async (req, res) => {
  let { fname, lname, username, email, pwd } = req.body;
  let findUser = await PrModels.Student.find({ username });
  if (findUser.length != 0) {
    res.status(409).send({
      er: `username ${username} already exists!`,
    });
  } else {
    pwd = bcrypt.hashSync(pwd, config.SALT);
    const user ={fname,lname,username,email,pwd};
    for (let key of Object.keys(user)){
      if(isNoU(user[key])) return res.status(400).send({er:"Fill all the fields"});
    }
    const newStudent = PrModels.Student(user);
    await newStudent.save();
    let token = jwt.sign({ username }, config.SECRET_KEY, {
      expiresIn: 24 * 60 * 60 * 1000,
    });
    res.send({ user: newStudent, token });
  }
});

app.post("/student", async (req, res) => {
  const body = req.body;
  const newStudent = PrModels.Student(body);
  await newStudent.save();
  res.send(newStudent);
});

app.get("/userinfo",async (req,res) =>{
  let  token= req.headers["x-jtoken"];
;
  if(!(token)) return res.status(401).send({er:"No token found",auth:false});
  jwt.verify(token,config.SECRET_KEY,async (err,decode)=>{
    if(err) return res.status(500).send({auth:false,er:"Authentication failed"});
    console.log(decode);
    let result =await PrModels.Student.find({
      username:decode.username,
    });
    res.send({user:result[0],token});
  })
})










app.get("/questions", AuthMiddleware,async (req, res) => {
  let { max, offset } = req.query;
  console.log({max,offset})

  max  = Number(max) || 10;
  offset = Number(offset) -1 || 0;
  console.log({max,offset})
  let result = await PrModels.Question.find({}).skip(offset*max).limit(max);
  const total2 = await PrModels.Question.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
      },
    },
  ]);
  const { total } = total2[0];
  result = {
    questions: result,
    total,
  };
  console.log("questions...",{result});
  res.send(result);
});

app.get("/question/:id",AuthMiddleware, async (req,res)=>{
  const id = req.params.id;
  const result = await PrModels.Question.findById(id);
  res.send(result);
})

app.post("/question",AuthMiddleware, async (req, res) => {
  const body = req.body;
  body.author = req.username;
  const newQuestion = PrModels.Question(body);
  await newQuestion.save();
  res.send({question:newQuestion});
});












app.listen(port, () => {
  console.log("Listening on http://localhost:" + port);
});
