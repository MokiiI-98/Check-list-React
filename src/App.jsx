import  { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Todo from "./components/Todo";
import Search from "./components/Search";
import Filter from "./components/Filter";
import "./App.css";
import TodoForm from "./components/TodoForm";

const App = () => {
  const [todos, setTodos] = useState([
    { id: 1, text: "Criar funcionalidade X no sistema", category: "Trabalho", isCompleted: false },
    { id: 2, text: "Ir para a academia", category: "Pessoal", isCompleted: false },
    { id: 3, text: "Estudar React", category: "Estudos", isCompleted: false },
  ]);

  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Asc");
  const [search, setSearch] = useState("");

  const addTodo = (text, category) => {
    const newTodos = [...todos, { id: Math.floor(Math.random() * 1000), text, category, isCompleted: false }];
    setTodos(newTodos);
  };

  const removeTodo = (id) => {
    const filteredTodos = todos.filter((todo) => todo.id !== id);
    setTodos(filteredTodos);
  };

  const completeTodo = (id) => {
    const newTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
    );
    setTodos(newTodos);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedTodos = Array.from(todos);
    const [movedTodo] = reorderedTodos.splice(result.source.index, 1);
    reorderedTodos.splice(result.destination.index, 0, movedTodo);

    setTodos(reorderedTodos);
  };

  const filteredTodos = todos
    .filter((todo) =>
      filter === "All"
        ? true
        : filter === "Completed"
        ? todo.isCompleted
        : !todo.isCompleted
    )
    .filter((todo) => todo.text.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      sort === "Asc"
        ? a.text.localeCompare(b.text)
        : b.text.localeCompare(a.text)
    );

  return (
    <div className="app">
      <h1>Lista de Tarefas</h1>
      <Search search={search} setSearch={setSearch} />
      <Filter filter={filter} setFilter={setFilter} setSort={setSort} />

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="todos">
          {(provided) => (
            <div
              className="todo-list"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {filteredTodos.map((todo, index) => (
                <Draggable key={todo.id} draggableId={String(todo.id)} index={index}>
                  {(provided) => (
                    <Todo
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      todo={todo}
                      completeTodo={completeTodo}
                      removeTodo={removeTodo}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <TodoForm addTodo={addTodo} />
    </div>
  );
};

export default App;
