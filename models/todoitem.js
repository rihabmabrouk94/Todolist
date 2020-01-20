'use strict'
module.exports = (sequelize, DataTypes) => {
  const TodoItem = sequelize.define(
      'TodoItem',
      {
        content: { type: DataTypes.STRING },
        complete: { type: DataTypes.BOOLEAN, defaultValue: false },
        todo_id: { type: DataTypes.INTEGER, defaultValue: null }
      },
      {}
  );

  TodoItem.associate = function(models) {
    // associations can be defined here
    TodoItem.belongsTo(models.Todo, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    })
  };
  return TodoItem;
};
