import React, { useCallback, useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import styled from "@emotion/styled";
import { AddInput } from "./components/AddInput";
import { TodoItem } from "./components/TodoItem";
import { TodoList } from "./components/TodoList";
import { Header } from "./components/Header";
import { Todo } from "./interface";

const Wrapper = styled.div({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: 300,
});

/**
* This is the initial todo state.
* Instead of loading this data on every reload,
* we should save the todo state to local storage,
* and restore on page load. This will give us
* persistent storage.
*/

const initialData: Todo[] = [
  {
    id: uuid(),
    label: "Buy groceries",
    checked: false,
  },
  {
    id: uuid(),
    label: "Reboot computer",
    checked: false,
  },
  {
    id: uuid(),
    label: "Ace CoderPad interview",
    checked: true,
  },
];

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const savedTodos = localStorage.getItem('todo-list');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Update localStorage whenever the todos list changes
  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem('todo-list', JSON.stringify(todos));
    }
    console.log("UseEffect", localStorage.getItem('todo-list'))
  }, [todos]);

  const addTodo = useCallback((label: string) => {
    setTodos((prev) => [
      {
        id: uuid(),
        label,
        checked: false,
      },
      ...prev,
    ]);
  }, []);

  const handleChange = useCallback((checked: boolean, index: number) => {
    setTodos((prev) => {
      let newTodos = [...prev];
      let changedIndex = { ...newTodos[index] }
      changedIndex.checked = checked;
      // remove index from array and add at last position
      newTodos.splice(index, 1);
      newTodos.push(changedIndex);
      return newTodos;
    });
  }, []);


  return (
    <Wrapper>
      <Header>Todo List</Header>
      <AddInput onAdd={addTodo} />
      <TodoList>
        {todos.map((todo, index) => (
          <TodoItem key={index} {...todo} index={index} onChange={handleChange} />
        ))}
      </TodoList>
    </Wrapper>
  );
}

export default App;
