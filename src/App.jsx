import React, { useState, useEffect } from 'react'
import './App.css'
import MyCalendarApp from './Calendar.jsx';

export default function App() {
  
  const [myDate, setMyDate]=useState(new Date());

//Initialize todoItems from localStorage if available
  const [todoItems, setToDoItems] = useState(() => {
    const savedTodos = localStorage.getItem('todoTasks');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  //Initialize completedItems from localStorage if available
  const [completedItems, setcompletedItems] = useState(() => {
    const savedCompleted = localStorage.getItem('completedTasks');
    return savedCompleted ? JSON.parse(savedCompleted) : [];
  });

 
      // Generate Id
    const generateSimpleId =function(){
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 9)
}

 // Save todoItems to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('todoTasks', JSON.stringify(todoItems));
  }, [todoItems]);

  //  Save completedItems to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('completedTasks', JSON.stringify(completedItems));
  }, [completedItems]);

  function handleAddTask(event){

        event.preventDefault();
        const trimmedValue=inputValue.trim();

      if (trimmedValue.length<=20 && trimmedValue.length !=0){  
      setToDoItems((preValue)=>[...preValue, {Id: generateSimpleId(), Name: trimmedValue, date:null}]) 

          setInputValue('') // clear input field up on submit
    }
}

 // #region input value & Char count
     // Track Input Value
 const[inputValue, setInputValue]=useState('');
 
 const inputListener=(event)=>{
       setInputValue(event.target.value)
      }     

      // Count the number of Character & display the information
    const characterCount= inputValue.trim().length<=20 ? 
        <div  className='charHandling'>
         <p>{inputValue.trim().length}/20</p>
         </div>

      : <div className='charHandling'><h5>Character too long!</h5>
      <p>20/20</p>
      </div>
      
      // #endregion

  // ---Return To Do List Section---
       const createdTasks=todoItems.map((taskDetail, index)=>
      <li className='ListAction' key={taskDetail.Id}>
          <button onClick={()=>moveTaskToCompleted(index)}>
            &#x26AA;
          </button>
          <div className='toDoTaskList' 
          onDoubleClick={()=>handleTextEdit(taskDetail.Id)}>
              {taskDetail.Name} 
          </div>

        {/*  {!taskDetail.date? 
         <button onClick={()=>actionCalendar(taskDetail.Id)}>🔔</button> 
             :
         <div className='calendarDate' onClick={calendarState()}>
           {taskDetail.date}
         </div>} */}

         <div onClick={()=>actionCalendar(taskDetail.Id)}  className='calendarDate'>
        {!taskDetail.date ? '🔔' : 
        <span><button>&#128197;</button> {taskDetail.date} </span>}
         </div>
      </li> 
        )

     //------Return completed Tasks-------

    const markedTaskLists=completedItems.map((marked, idx)=>
      <li className='markedTask-section' key={marked.Id}>
       
        <button onClick={()=>moveTaskBackToTodo(idx)}>
          &#9989;
        </button>

        <span className='marked-text'>{marked.Name}</span>
        
        <button className='Thrash-icon' onClick={()=>moveTaskToTrash(idx)}>
          &#x1F5D1;
        </button>
       
        </li>
     )

             // Edit the task list
      function handleTextEdit(id){

       const editItem=todoItems.find (element=> element.Id===id);

          if (editItem){
                 setInputValue(editItem.Name)

         // Filter non-clicked items
         const remainValue=todoItems.filter(element=> element.Id!==id)
         setToDoItems(remainValue)
}
      }

        const [taskId, setTaskId]=useState(null)
        const [calendarState, setCalendarState]=useState(false);

  function actionCalendar(itemId){

          setTaskId(itemId)
          setCalendarState(prevState=>!prevState)
          
  }

  function setCalendarDate(selectedDate){ // the parameter is a built-in inside the calendar library
    const  newDate= selectedDate.toDateString();
    setToDoItems( prevItems=> prevItems.map(item=> {
        
              if (item.Id===taskId){
                return {...item, date:newDate}//date will now have a value
              }

              return {...item}
            }
          
          ))

        setCalendarState(false);
        setTaskId(null);
       
  }
  
  function moveTaskToCompleted(index){
         // Filter To-Do list
      const filteredItems= todoItems.filter((_, i)=>  i!==index ) 
        
       setToDoItems([...filteredItems])
        
          // Filter Completed tasks list
       const completedTask=todoItems.filter((_, i)=> i===index);

      setcompletedItems((TaskDone)=> [...TaskDone, 
        ...completedTask])

        // hide calendar up on task completion
        setCalendarState(false)
      }

      // Returns task back to TO-DO List
      function moveTaskBackToTodo(idx){
         const unmark=completedItems.filter((_, i)=> idx===i) 
         setToDoItems(((reverseTask)=>[...reverseTask, ...unmark]))

         const unmarkedTask=completedItems.filter((_, i)=>idx!==i)
         setcompletedItems([...unmarkedTask])
      }

      function moveTaskToTrash(idx){
        const trashTask=completedItems.filter((_, i)=>idx!==i)
        setcompletedItems( [...trashTask])
      }

    // ----------Rendering Section-------------------

  return (
    <main className='mainPage'>
      
      <h1 className='todo-header'>To-Do List App</h1>

  <form onSubmit={handleAddTask}>

    <input type='text' name='toDo' id='toDo' className='toDoSpace' placeholder='Do Grocery!' 
    onChange={inputListener} value={inputValue} />

    {inputValue && <button className='addTask'>Add</button>}
 </form>

        {characterCount}
       
        {todoItems.length>0 && 
           <div className='toDoList-Container'> 
              <h3> To-Do Lists:</h3> 
              <ul>{createdTasks}</ul>
           </div>
        }

          {calendarState &&  
                <MyCalendarApp 
                   date={myDate}    
                   setDate={setMyDate}
                   setCalendar={setCalendarDate}
         />
      }
       {completedItems.length >0 && 
       <div>
            <h3>Completed Tasks:</h3>
            <ul className='completedTask-Section'>{markedTaskLists}</ul>
       </div> }

    </main>
  )
}

