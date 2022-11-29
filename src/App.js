import React, { useState, useRef, useEffect } from 'react';
import TodoList from './TodoList'
import { v4 as uuidv4 } from 'uuid';

const LOCAL_STORAGE_KEY = 'todoApp.todos'

function App() {
  // Whenever setTodos is called, it edits the todos and changes state
  const [todos, setTodos] = useState([])

  // useRef changes text, for keyboard input
  const todoNameRef = useRef()

  // useEffect to LOAD the todos. Called only once, never recalled 
  useEffect(() => {
    // Set todos to what we get back from stored todso
    const storedTodos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
    if (storedTodos) setTodos( prevTodos => [...prevTodos, ...storedTodos] );
  }, [])

  // useEffect takes in parameter, updates/stores todos
  useEffect(() => {
    // Any time the array of todos changes, we save them to localstorage, refreshing will remove them    
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  // Takes in an id of the TODO we want to toggle
  function toggleTodo(id) {
    // get a new list of todos that is a copy of the current todos list, won't change current todos list
    // NEVER directly modify a STATE variable (todos), use copy to create a new state
    const newTodos = [...todos]
    const todo = newTodos.find(todo => todo.id === id)
    todo.complete = !todo.complete
    setTodos(newTodos) // Modify state by setting todos to the updated copy
  }

  function handleAddTodo(e) {
    const name = todoNameRef.current.value
    if (name === '') return
    setTodos(prevTodos => {
      return [...prevTodos, { id: uuidv4(), name: name, complete: false}]
    })
    todoNameRef.current.value = null
  }

  function handleClearTodos() {
    const newTodos = todos.filter(todo => !todo.complete)
    setTodos(newTodos)
  }

  return (
    <>
      <TodoList todos={todos} toggleTodo={toggleTodo} />
      <input ref={todoNameRef} type="text" />  
      <button onClick={handleAddTodo}>Add Todo</button>
      <button onClick={handleClearTodos}>Clear Complete</button>
      <div>{todos.filter(todo => !todo.complete).length} left to do</div>
    </>
  )
}

export default App;