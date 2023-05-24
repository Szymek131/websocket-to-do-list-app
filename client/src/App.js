import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import shortid from 'shortid';

const App = () => {

  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [socket, setSocket] = useState();

  useEffect(() => {
    const socket = io('localhost:8000');
    setSocket(socket);
    socket.on('addTask', tasks => addTask(tasks));
    socket.on('removeTask', taskId => removeTask(taskId));
    socket.on('updateData', tasksList => updateTasks(tasksList));
    return () => {
      socket.disconnect();
    };
  }, []);

  const updateTasks = tasks => {
    setTasks(tasks);
  }

  const removeTask = id => {
    setTasks(tasks => tasks.filter(task => task.id !== id));
    socket.emit('removeTask', id);
  }

  const submitForm = e => {
    e.preventDefault();
    if (taskName.length >= 1) {
      const taskData = { name: taskName, id: shortid.generate() }
      addTask(taskData);
      socket.emit('addTask', taskData);
      setTaskName('');
    } else {
      window.alert('Task must be 1 character or longer !')
    }
  }

  const addTask = task => {
    setTasks(tasks => [...tasks, task]);
  }

  return (
    <div className="App">

      <header>
        <h1>ToDoList.app</h1>
      </header>

      <section className="tasks-section" id="tasks-section">
        <h2>Tasks</h2>

        <ul className="tasks-section__list" id="tasks-list">
          {tasks.map(task => (
            <li key={task.id} className="task">{task.name} <button onClick={() => removeTask(task.id)} className="btn btn--red">Remove</button></li>
          ))}
        </ul>

        <form id="add-task-form" onSubmit={submitForm}>
          <input onChange={e => setTaskName(e.target.value)} className="text-input" autoComplete="off" type="text" placeholder="Type your description" id="task-name" />
          <button className="btn" type="submit">Add</button>
        </form>

      </section>
    </div>
  );
}

export default App;