const express = require("express");
const router = express.Router();
const Exceptions = require("../exceptions/exceptions");
const pool = require("../services/sqlPool");

router.post("/addTodo", async (req, res) => {
  const { data } = req.currentUser;
  const { title, status = false } = req.body;
  if (!title) {
    res.status(Exceptions["EX11"].status).send(Exceptions["EX11"]);
  }
  try {
    let result = await pool.query(
      `INSERT into todos(title,status,userId) values  ( '${title}',${status},'${data.id}')`
    );
    let todoToSend = { title, status, id: result.insertId };
    res.send({
      error: false,
      data: {
        todo: todoToSend,
      },
    });
  } catch (e) {
    res
      .status(Exceptions["EX10"].status)
      .send({ ...Exceptions["EX10"], meta: e });
  }
});
router.put("/editTodo", async (req, res) => {
  let { id } = req.query;
  const { title, status = false } = req.body;
  if (!id) {
    return res.status(Exceptions["EX12"].status).send(Exceptions["EX12"]);
  }
  if (!title) {
    res.status(Exceptions["EX11"].status).send(Exceptions["EX11"]);
  }
  // `SELECT * FROM todos WHERE userId= '${currentUser.id}'`
  try {
    let result = await pool.query(
      `UPDATE todos SET title = '${title}' , status=${status}  WHERE id=${id} `
    );
    console.log(result);

    res.send({
      error: false,
      data: { todo: { title, status, id: parseInt(id) } },
    });
    //res.send(result);
  } catch (e) {
    res
      .status(Exceptions["EX10"].status)
      .send({ ...Exceptions["EX10"], meta: e });
  }
});
router.delete("/deleteTodo", async (req, res) => {
  let { id } = req.query;
  if (!id) {
    return res.status(Exceptions["EX12"].status).send(Exceptions["EX12"]);
  }
  try {
    let result = await pool.query(`DELETE FROM todos WHERE id=${id} `);
    res.send({ error: false, data: { deletedId: id } });
    //res.send(result);
  } catch (e) {
    res
      .status(Exceptions["EX10"].status)
      .send({ ...Exceptions["EX10"], meta: e });
  }
});
router.get("/all", async (req, res) => {
  let currentUser = req.currentUser.data;
  try {
    let result = await pool.query(
      `SELECT * FROM todos WHERE userId= '${currentUser.id}' ORDER BY date desc`
    );
    res.send({
      error: false,
      data: {
        todos: result,
      },
    });
  } catch (e) {
    res
      .status(Exceptions["EX10"].status)
      .send({ ...Exceptions["EX10"], meta: e });
  }
});

module.exports = router;
