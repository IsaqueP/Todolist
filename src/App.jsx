import { React, useState } from 'react'

import { ToDo } from './components/ToDo'

import style from './App.module.css'


function App() { 
  //verifica se o localStorage está vazio, se estiver adiciona um valor vazio
  if(localStorage.getItem('taskList') === null){
    localStorage.setItem('taskList', JSON.stringify([]))
  }

  const [ taskInput, setTaskInput ] = useState('')
  const [ taskList, setTaskList ] = useState(JSON.parse(localStorage.getItem('taskList')))
  const [ taskDone, setTaskDone ] = useState(()=>updateTasksDone())
  
  function updateTasksDone(){
    let numberOfTaskPending = 0

    for(let i=0;i<JSON.parse(localStorage.getItem('taskList')).length;i++){
      if(JSON.parse(localStorage.getItem('taskList'))[i][1] === false){
        numberOfTaskPending+=1
      }
    }

    return numberOfTaskPending
  }

  function handleKeyPress(event){
    if(event.key === "Enter"){
      event.preventDefault()
      handleAddItemToList()
    }
  }

  function handleAddItemToList(){
    //Não adiciona se estiver vazio
    if (!taskInput){
      return
    }

    //Verifica se já há uma tarefa igual
    for(let i=0;i<taskList.length;i++){
      if(taskInput === taskList[i][0]){
        alert('Você já adicionou essa tarefa!')
        return
      }
    }

    //adiciona a nova tarefa no localStorage
    localStorage.setItem('taskList',
    JSON.stringify([
      ...JSON.parse(localStorage.getItem('taskList')),
      [taskInput, false]
    ])) 

    //ordena a lista para que a tarefa adicionada não fique no último lugar do array se tiver outra marcada como "feita"
    let taskEdit = JSON.parse(localStorage.getItem('taskList'))
    taskEdit.sort((a, b)=>{
      return a[1] - b[1];
    })
    
    localStorage.setItem('taskList', JSON.stringify(taskEdit))

    //adiciona os valores do localStorage na lista para serem renderizados
    setTaskList(JSON.parse(localStorage.getItem('taskList')))
    setTaskInput('')
    setTaskDone(taskDone+1)
  }

  function handleRemoveItemToList(index, checked){
    if(checked===false){
      setTaskDone(taskDone-1)
    }

    taskList.splice(index, 1)
    setTaskList([...taskList])
    localStorage.setItem('taskList', JSON.stringify(taskList))

  }

  function handleRemoveAllItemToList(){
    setTaskList([])
    localStorage.clear();
    setTaskDone(0)
  }

  return (
  
    <div className={style.container}>
      <div>
        {/* Header */}
        <div className={style.header}>
          <div>
            <h1>Todo App</h1> 
          </div>

          <div className={style.addTodo}>
            <input 
              enterKeyHint='enter' 
              autoFocus 
              type="text" 
              onKeyPress={(event) => handleKeyPress(event)}
              placeholder='Adicione sua nova tarefa' 
              value={taskInput} 
              onChange={(e)=>setTaskInput(e.target.value)} 
            />
            
            <div className={style.btnAddTodo} onClick={handleAddItemToList}>
              <span className={style.tracoHorizontal}></span>
              <span className={style.tracoVertical}></span>
            </div>
          </div>
        </div>

        {/* Main */}
        <div className={style.main}>

        {taskList.map((item, index) => (
          <ToDo key={item[0].toString()} item={item[0]} index={index} deleteTask={handleRemoveItemToList} taskDone={taskDone} setTaskDone={setTaskDone} taskMarkedAsComplete={item[1]} setTaskList={setTaskList}/>
        ))}

        </div>
      </div>
      
      {/* Footer */}
      <div>
        <div className={style.footer}>

          {
            taskDone ? 
              <p>Você tem {taskDone} {taskDone > 1 ? 'tarefas pendentes' : ' tarefa pendente'}</p> 
              : 
              <p>
                {taskList.length > 0 ? 'Você não possui tarefas pendentes' : 'Você não possui tarefas'}
              </p>
          }

          <button onClick={handleRemoveAllItemToList}>Apagar todas</button>
        </div>
      </div>
     </div>
  )
}

export default App
