import './App.css';

import {useState, useEffect} from 'react';
import {BsTrash, BsBookmarkCheck, BsBookmarkCheckFill } from "react-icons/bs";

const API = "http://localhost:5000"

function App() {
  const [title, setTitle] = useState ("");
  const [time, setTime] = useState ("");
  const [tasklist, setTastklist] = useState ([]);
  const [loading, setLoading] = useState (false);

  //load tasklists on page load
  useEffect(() => {

    const loadData = async() => {
      setLoading(true)

      const res = await fetch(API + "/tasklists")
      .then((res) => res.json())
      .then((data) => data)
      .catch((err) => console.log(err));

    setLoading(false);

    setTastklist(res);
    };

    loadData();

  }, [])

  //isso aqui para o envio do formulario e deixa ele no fluxo do SPA. Nao atualiza a pagina
  const handleSubmit = async (e) => {
    e.preventDefault()

    const tasklist = {
      id: Math.random(),
      title,
      time,
      done: false,
    };

    await fetch(API + "/tasklists", {
      method: "POST",
      body: JSON.stringify(tasklist),
      headers: {
        "Content-Type": "application/json",
      },
    });

    //envio para API
    setTastklist((prevState) => [...prevState, tasklist]);

    setTitle("");
    setTime("");
  };

  const handleDelete = async (id) => {
    await fetch(API + "/tasklists/" + id , {
      method: "DELETE",
    });

    setTastklist((prevState) => prevState.filter((tasklist) => tasklist.id !== id));
  }

  const handleEdit = async (tasklist) => {
    tasklist.done = !tasklist.done;

    const data = await fetch(API + "/tasklists/" + tasklist.id , {
      method: "PUT",
      body: JSON.stringify(tasklist),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setTastklist((prevState) => 
      prevState.map((t) => (t.id === data.id ? (t = data) : t))
    );
  }
  
  if (loading){
    return <p>Carregando...</p>
  }

  return (
    <div className="App">
      <div className='tasklist-header'>
        <h1>React Tasklist</h1>
      </div>
      <div className='form-tasklist'>
        <h2>Insira a sua próxima tarefa
          <form onSubmit={handleSubmit}>
            <div className='form-control'>
              <label htmlFor='title'>O que vc irá fazer ?</label>
              <input type='text' name='title' placeholder='Título da tarefa' onChange={(e) => setTitle(e.target.value)}
              value={title || ""}
              required
              />
            </div>
            <div className='form-control'>
              <label htmlFor='time'>Duração em horas: </label>
              <input  
                type='text' 
                name='time' 
                placeholder='Tempo estimado' 
                onChange={(e) => setTime(e.target.value)}
                value={time || ""}
                required
              />
            </div>
            <input type='submit' value="Criar Tarefa" />
          </form>
        </h2>
      </div>
      <div className='list-tasklist'>
        <h2>Lista de tarefas: 
          {tasklist.length === 0 && <p>Não há tarefas</p>}
          {tasklist.map((tasklist) => (
            <div className='tasklist' key={tasklist.id}>
              <h3 className={tasklist.done ? "tasklist-done" : ""}>{tasklist.title}</h3>
              <p>{tasklist.time} {tasklist.time == 1 ? "hora" : "horas"}</p>
              <div className='actions'>
                <span onClick={() => handleEdit(tasklist)}>
                  {!tasklist.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill />}
                </span>
                <BsTrash onClick={() => handleDelete(tasklist.id)}/>
              </div>
            </div>
          ))}
        </h2>
      </div>
    </div>
  );
}

export default App;
