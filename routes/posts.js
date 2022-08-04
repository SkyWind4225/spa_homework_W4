const express = require("express");
const { Post } = require("../models");
const router = express.Router();

router.get("/posts", async (req, res) => {
  
  try {
    let posts = await Post.findAll({where: {}, order: [['createdAt', 'DESC']]});
    let resultList = [];

    for (const post of posts) {
      resultList.push({
        postId: post.id,
        user: post.user,
        title: post.title,
      });
    }

    res.status(200).json({ data: resultList });
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    res.status(400).json({ message });
  }
});


router.get("/posts/:postId", async (req, res) => {
  try {
    const id = req.params.postId;

    if (!id) {
      res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
      return;
    }

    const post = await Post.findOne({where :{ id }});

    const result = {
      postId: post.id,
      user: post.user,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
    };

    res.status(200).json({ data: result });
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    res.status(400).json({ message });
  }
});


router.post("/posts", async (req, res) => {
  try {
    const {user, password, title, content} = req.body;

    if (!user || !password || !title || !content) {
      res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
      return;
    }

    await Post.create({ user, password, title, content });

    res.status(201).json({ message: "게시글을 생성하였습니다." });
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    res.status(400).json({ message });
  }
});

router.put("/posts/:postId", async (req, res) => {
  try {
    const id = req.params.postId;
    const {user, password, title, content} = req.body;

    if (!id || !user || !password || !title || !content) {
      res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
      return;
    }


    const isExist = await Post.findOne({ where: {id, password} });
    if (!isExist) {
      res.status(404).json({ message: '게시글 조회에 실패하였습니다.' });
      return;
    }

    await Post.update( { user, title, content }, {where: {id}});

    res.status(201).json({ message: "게시글을 수정하였습니다." });
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    res.status(400).json({ message });
  }
});


router.delete("/posts/:postId", async (req, res) => {
  try {
    const id = req.params.postId;
    const password = req.body["password"];

    if (!user || !password) {
      res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
      return;
    }

    const isExist = await Post.findOne({ id, password });

    if (!isExist || !id) {
      res.status(404).json({ message: '게시글 조회에 실패하였습니다.' });
      return;
    }

    await Post.destroy({where : { id }});
    res.status(201).json({ message: "게시글을 삭제하였습니다." });
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    res.status(400).json({ message });
  }
});

module.exports = router;
