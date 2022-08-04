const express = require("express");
const { Comment } = require("../models");
const router = express.Router();

router.get("/comments/:postId", async (req, res) => {
  try {
    const id = req.params.postId;

    if (!id) {
      res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
      return;
    }

    const comments = await Comment.findAll({ where: {postId: id}, order: [['createdAt', 'DESC']]});

    let resultList = [];

    for (const comment of comments) {
      resultList.push({
        commentId: comment.id,
        user: comment.user,
        content: comment.content,
      });
    }

    res.status(200).json({ data: resultList });
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    res.status(400).json({ message });
  }
});

router.post("/comments/:postId", async (req, res) => {
  try {
    const id = req.params.postId;
    const {user, password, content} = req.body;

    if (!content) {
      res.status(400).json({ message: '댓글 내용을 입력해주세요.' });
      return;
    }

    if (!id || !user || !password) {    
      res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
      return;
    }


    await Comment.create({ postId: id, user, password, content });

    res.status(201).json({ message: "댓글을 생성하였습니다." });
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    res.status(400).json({ message });
  }
});

router.put("/comments/:commentId", async (req, res) => {
  try {
    const id = req.params.commentId;
    const {password, content} = req.body;

    if (!content) {
      res.status(400).json({ message: '댓글 내용을 입력해주세요.' });
      return;
    }

    if (!id || !password) {
      res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
      return;
    }

    const isExist = await Comment.findOne({where: {id, password} });
    if (!isExist) {
      res.status(404).json({ message: '댓글 조회에 실패하였습니다.' });
      return;
    }

    await Comment.update( { content }, {where: {id}});

    res.status(201).json({ message: "댓글을 수정하였습니다." });
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    res.status(400).json({ message });
  }
});

router.delete("/comments/:commentId", async (req, res) => {
  try {
    const id = req.params.commentId;
    const password = req.body["password"];

    if (!id || !password) {
      res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
      return;
    }

    const isExist = await Comment.findOne({ where: {id, password} });

    if (!isExist || !id) {
      res.status(404).json({ message: '댓글 조회에 실패하였습니다.' });
      return;
    }

    await Comment.destroy({where : { id }});
    res.status(201).json({ message: "댓글을 삭제하였습니다." });
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    res.status(400).json({ message });
  }
});

module.exports = router;
