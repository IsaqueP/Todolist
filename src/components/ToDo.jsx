import { useState } from 'react'

import styles from './ToDo.module.css'

import iconTrash from '../assets/icon-trash-can.svg'

export function ToDo({ ...props }){

  const [ isChecked, setIsChecked ] = useState(props.taskMarkedAsComplete)

  function handleTaskDone(){
    setIsChecked(!isChecked)
  
    
    if(isChecked === true){
      props.setTaskDone(props.taskDone+1)
    }else{
      props.setTaskDone(props.taskDone-1)
    }

    updateListInLocalStorage()
  }

  function updateListInLocalStorage(){
    let taskEdit = JSON.parse(localStorage.getItem("taskList"))
      .filter(item => item[0] !== props.item)

    taskEdit.push([props.item, !isChecked])

    changePosition(taskEdit, taskEdit.length-1, props.index)

    taskEdit.sort((a, b)=>{
      return a[1] - b[1];
    })

    localStorage.setItem('taskList', JSON.stringify(taskEdit))

    props.setTaskList(JSON.parse(localStorage.getItem('taskList')))
  }

  function changePosition(arr, from, to) {
    arr.splice(to, 0, arr.splice(from, 1)[0]);
    return arr;
  }
  
  return(
    <>
      <div className={styles.ToDo} >
        
        <label className={styles.container}>
          <input type="checkbox" checked={isChecked} onChange={()=>handleTaskDone()} />
          <span className={styles.checkmark}></span>
        </label>

        <p className={isChecked ? styles.ToDoTextDone : styles.ToDoText}>{props.item}</p> 

        <div className={styles.ToDoTrash} onClick={()=>{props.deleteTask(props.index, isChecked)}} >
          <img src={iconTrash} alt="ícone de lixo" />
        </div>
      </div>
    </>
  )
}