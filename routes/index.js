const router = require('express').Router();
const todoRoute = require('./todo');
// const todoItemRoute = require('./todoitem');

router.use("/todo" , todoRoute);
// router.use("/todoitem" , todoItemRoute);

module.exports = router;
