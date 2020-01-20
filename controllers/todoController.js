const models = require("../models/index");
const todoModel = models['Todo'];
const todoitemModel = models['TodoItem'];


module.exports = {

    add(req, res) {
        todoModel.create({
            title: req.body.title
        })

            .then(todo => res.status(201).send({
                status: 201,
                data: todo,
                message: req.body.title + " created "
            }))
            .catch(error => res.status(400).send(error))

    },

    addTodoWithItems(req, res, next) {
        /* tasks
        -0 mettre les données dans une variable data
        -1 je dois vérifier les entrees, est ce que la request contient un titre
        -2 je dois vérifier les entrees, est ce que la request contient des items
        -3 je dois insérer le _todo (fields: title) et #3a puis récupérer le id de _todo enregistré et tester si il est créé ou non
        -4 boucle foreach pour insérer le todoitem un par un en rajoutant le _todo_id récupéré
        -5 envoyer la réponse qui contient le _todo avec deux methodes:
            soit on calcule le nombre des items enregistrés, soit on fait un promise all pour attendre la fin de l exécution de toutes les tachs
         */

        // tsk0
        const dataReceived = req.body;
        // task1
        if (!dataReceived.title) {
            return res.status(500).send({
                success: false,
                message: "no title inserted",
            });
        }

        // task2
        if (typeof dataReceived.items === "undefined" || dataReceived.items.length === 0) {
            return res.status(500).send({
                success: false,
                data: dataReceived,
                message: "no items inserted",
            });
        }

        // tsk3
        todoModel.create({
            title: dataReceived.title
        }).then(todoCreated => {
            let todoToReturn = JSON.parse(JSON.stringify(todoCreated));

            // taks3 #a: true
            if (todoCreated && todoCreated.id) {
                todoToReturn.items = [];

                // tsk4: method avec le foreach et on calcule les items enregistrés
                /*
                data.items.forEach(item => {
                    todoitemModel.create({
                        content: item.content,
                        complete: item.complete,
                        todo_id: todoCreated.id,
                    }).then(itemCreated => {
                        todoToReturn.items.push(itemCreated);

                        if (data.items.length === todoToReturn.items.length) {
                            // tsk5:
                            return res.send({
                                success: true,
                                message: "_todo created with success",
                                mon_todo_created: todoToReturn,
                            });
                        }
                    });
                });*/

                // tsk4: method avec le promise all
                const promises_a_attendre = [];
                dataReceived.items.forEach(item => {
                    promises_a_attendre.push(todoitemModel.create({
                        content: item.content,
                        complete: item.complete,
                        todo_id: todoCreated.id,
                    }));
                });

                Promise.all(promises_a_attendre).then(all_items_created => {
                    todoToReturn.items = all_items_created;

                    // tsk5:
                    return res.send({
                        success: true,
                        message: "_todo created with success",
                        mon_todo_created: todoToReturn,
                    });
                })


            } else {

                // tsk3 #a: false
                return res.status(500).send({
                    success: false,
                    message: "todo not created",
                });
            }
        });
    },

    list(req, res) {
        todoModel.findAll(
            {
                include: [
                    {
                        model: todoitemModel,
                        as: 'todoItems'
                    }
                ]
            }
        )
        .then(resultQuery => {
            res.send({
                data: resultQuery,
                success: true,
                messages: [{
                    code: "01",
                    message: "todolist.GetAllWithSuccess"
                }]
            });
        }).catch(error => res.status(400).send(error))
    },

    delete(req, res) {

        // step 0: je vérifie l id existe dans la requete
        // step 1: je vérifie le _todo exists ou non
        // step 2: je fais un delete pour les
        todoModel.findOne({
            where: {
                id: req.params.id
            }
        }).then(function (todoItem) {
            if (!todoItem) {
                return res.send({
                    status: 404,
                    message: "not found"
                });
            }

            // ici je dois supprimer les items avant
            todoitemModel.destroy({
                where: {
                    todo_id: todoItem.id
                }
            }).then(number_of_items_deleted => {
                return todoItem.destroy().then(() => res.send({
                    status: 204,
                    number_of_items_deleted: number_of_items_deleted,
                    message: "your object has been destroy"
                })).catch((error) => res.status(400).send(error))
            });
        })
        .catch((error) => res.status(400).send(error));
    }

};
