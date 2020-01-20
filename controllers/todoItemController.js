const models = require("../models/index");
const todoModel = models['Todo'];
const todoitemModel = models['TodoItem'];

module.exports = {

    add(req, res) {
        todoitemModel.create({
            content: req.body.content,
            complete: req.body.complete,
            todo_id: req.body.todo_id,
        })
            .then((todo) => res.state(201).send({
                data: todo,
                message: "created"
            }))
            .catch(error => {
                res.status(400).send(error)
            });
    }

};
