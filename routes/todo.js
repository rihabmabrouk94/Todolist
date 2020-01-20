const router = require('express').Router();
const  todoController = require('./../controllers/todoController');

router.post('/create', function (req, res, next) {
    todoController.add(req, res, next)
});
router.post('/addTodoWithItems', function (req, res, next) {
    todoController.addTodoWithItems(req, res, next)
});
router.get('/list', function (req, res, next) {
    todoController.list(req, res, next)
});
router.delete('/delete/:id', function (req, res, next) {
    todoController.delete(req, res, next)
});

module.exports = router;
