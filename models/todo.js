'use strict'
module.exports = (sequelize, DataTypes) => {
    const Todo = sequelize.define(
        'Todo',
        {
            title: {
                type: DataTypes.STRING
            }
        },
        {}
    )
    Todo.associate = function (models) {
        // associations can be defined here
        Todo.hasMany(models.TodoItem, {
            foreignKey: 'todo_id',
            as: 'todoItems'
        });
    };
    return Todo
};
