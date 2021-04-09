import { useState, useEffect } from "react";
import Header from "./components/Header/Header";
import "./styles.css";

import { auth } from "./services/firebase";

export default function App() {

  const [state, setState] = useState({
    user: null,
    mountains: [],
    newMountain: {
      mountain: "",
      difficulty: "",
      date: "",
      firstTime: "",
      list: "",
      weather: "",
      comment: "",
    },
    editMode: false
  });


  async function getAppData() {
    if(!state.user) return;
    try {
      const BASE_URL = `http://localhost:3001/api/mountains?uid=${state.user.uid}`;
      const mountains = await fetch(BASE_URL).then(res => res.json());
      setState((prevState) => ({
        ...prevState,
        mountains,
      }));
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    getAppData();
    
    auth.onAuthStateChanged(user => {
      if(user) {
        setState(prevState => ({
          ...prevState,
          user,
        }));
      } else {
        setState(prevState => ({
          ...prevState,
          mountains: [],
          user,
        }));
      }
    });

  }, [state.user]);



  async function handleSubmit(e) {
    if(!state.user) return;
    
    e.preventDefault();
    
    const BASE_URL = 'http://localhost:3001/api/mountains';

    if(!state.editMode) {

      const mountains = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-type': 'Application/json'
        },
        body: JSON.stringify({...state.newMountain, uid: state.user.uid })
      }).then(res => res.json());
      
      setState((prevState) => ({
        ...prevState,
        mountains,
        newMountain: {
          mountain: "",
          difficulty: "",
          date: "",
          firstTime: "",
          list: "",
          weather: "",
          comment: ""
      },
      }));
    } else {
      const { mountain, difficulty, date, firstTime, list, weather, comment, _id } = state.newMountain;

      const mountains = await fetch(`${BASE_URL}/${_id}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'Application/json'
        },
        body: JSON.stringify({ mountain, difficulty, date, firstTime, list, weather, comment })
      }).then(res => res.json());

      setState(prevState => ({
        ...prevState,
         mountains,
        newMountain: {
          mountain: "",
          difficulty: "",
          date: "",
          firstTime: "",
          list: "",
          weather: "",
          comment: ""
      },
        editMode: false
      }));
    }
  }


  function handleChange(e) {
    setState((prevState) => ({
      ...prevState, 
      newMountain: {
        ...prevState.newMountain,
        [e.target.name]: e.target.value 
      }
    })) 
  }

  async function handleDelete(mountainId) {
    if(!state.user) return;
    const URL = `http://localhost:3001/api/mountains/${mountainId}`;
    
    const mountains = await fetch(URL, {
      method: 'DELETE'
    }).then(res => res.json());

    setState(prevState => ({
      ...prevState,
      mountains,
    }));
  }

  function handleEdit(mountainId) {
    const { mountain, difficulty, date, firstTime, list, weather, comment, _id } = state.mountains.find(mountain => mountain._id === mountainId);
    setState(prevState => ({
      ...prevState,
      newMountain: {
        mountain,
        difficulty,
        date,
        firstTime,
        list,
        weather,
        comment,
        _id
      },
      editMode: true
    }));
  }

  function handleCancel() {
    setState(prevState => ({
      ...prevState,
       newMountain: {
        mountain,
        difficulty,
        date,
        firstTime,
        list,
        weather,
        comment,
      },
      editMode: false
    }));
  }





  return (
    <>
      <Header user={state.user} />
      <main>
        <section>
          {state.mountains.map((s) => (
            <article key={s.mountain}>
              <div>{s.mountain}</div>
              <div>{s.difficulty}</div>
              <div>{s.date}</div>
              <div>{s.firstTime}</div>
              <div>{s.list}</div>
              <div>{s.weather}</div>
              <div>{s.comment}</div>
              <div onClick={() => handleDelete(s._id)}>{"🚫"}</div>
              { !state.editMode && <div onClick={() => handleEdit(s._id)}>{"✏️"}</div> }
            </article>
          ))}

          {
            state.user && 
            <>
              <hr />
              <form onSubmit={handleSubmit}>
                <label>
                  <span>Mountain</span>
                  
                  <input
                    name="mountain"
                    value={state.newMountain.mountain}
                    onChange={handleChange}
                  />
                </label>

                <label>
                  <span>Difficulty</span>
                  <select
                    name="difficulty"
                    value={state.newMountain.difficulty}
                    onChange={handleChange}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </label>

                <label>
                  <span>Date of Hike</span>
                  <input
                    type="date" 
                    name="date"
                    min="2018-01-01" 
                    max="2021-12-31"
                    value={state.newMountain.date}
                    onChange={handleChange}
                    />
                </label>

                
                <label>
                  <span>First time hiking this mountain?</span>
                  <select
                    name="firstTime"
                    value={state.newMountain.firstTime}
                    onChange={handleChange}
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>

                </label>

                <label>
                  <span>Peak List</span>
                  <select
                    name="list"
                    value={state.newMountain.list}
                    onChange={handleChange}
                  >
                    <option value="NH 4000 Footer Club">NH 4000 Footer Club</option>
                    <option value="VT 4000 Footer Club">VT 4000 Footer Club</option>
                    <option value="ME 4000 Footer Club">ME 4000 Footer Club</option>
                    <option value="State Highpoints">State Highpoints</option>
                    <option value="Adirondack High Peaks">Adirondack High Peaks</option>
                  </select>
                </label>

                <label>
                  <span>Weather</span>
                  
                  <input
                    name="weather"
                    value={state.newMountain.weather}
                    onChange={handleChange}
                  />
                </label>

                <label>
                  <span>Comments</span>
                  
                  <input
                    name="comment"
                    value={state.newMountain.comment}
                    onChange={handleChange}
                  />
                </label>
                  <button>{state.editMode ? 'EDIT Mountain' : 'ADD Mountain'}</button>
              </form>
                {state.editMode && <button onClick={handleCancel}>CANCEL</button> }
            </>
          }
        </section>
      </main>
    </>
  );
}