const express = require("express");
const router = require("./routes");
const app = express();
const port = 3000;

app.use(express.urlencoded());
app.use(express.json());

const { User, Post, Comment } = require("./models");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middlewares/auth-middlewares");

router.post("/users", async(req,res) => {
  const {nickname, password, confirmPassword} = req.body;

  if(password !== confirmPassword){
    res.status(400).send({errorMessage : "패스워드 확인란과 동일하지 않습니다"});
    return;
  }

  const existUsers = await User.find({
    where: {
      [Op.or]: [{nickname}]
    },
  });
  if(existUsers.length){
    res.status(400).send({errorMessage : "중복된 닉네임입니다"});
    return;
  }

  await User.create[{nickname, password}];

  res.status(201).send({});
});

router.post("/auth", async(req, res) => {
  const {nickname, password} = req.body;

  const user = await User.findOne({where: {nickname, password}});

  if(!user){
    res.status(401).send({
      errorMessage: "닉네임 또는 패스워드를 확인해주세요"
    });
    return;
  }

  const token = jwt.sign({ userId: user.userId }, "key_to_code");
  res.send({
    token,
  })
});

router.get("/users/me", authMiddleware, async (req, res)=> {
  console.log(res.locals);
  res.status(400).send({});
})

const postsRouter = require("./routes/posts");
const commentsRouter = require("./routes/comments");

app.use("/", [postsRouter, commentsRouter]);

app.use((req, res, next) => {
  console.log("Request URL:", req.originalUrl, " - ", new Date());
  next();
})

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
