import { useState, useEffect } from "react";
import Header from "./components/Header/Header";
import "./styles.css";

import { auth } from "./services/firebase";

import {fetchMountains} from './services/api-service';
import {deleteMountain} from './services/api-service';

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
      const mountains = await fetchMountains(state.user.uid);
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

    const cancelSubscription = auth.onAuthStateChanged(user => {
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

    return function() { // cleanup function
      cancelSubscription();
    }

  }, [state.user]);



  async function handleSubmit(e) {
    if(!state.user) return;
    
    e.preventDefault();
    
    const BASE_URL = 'https://project3back.herokuapp.com/api/mountains';

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
    const mountains = await deleteMountain(skillId);

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
      <div className="results">
            <table > 
              <tr>
                <th>mountain</th>
                <th>difficulty</th>
                <th>date</th>
                <th>firstTime</th>
                <th>list</th>
                <th>weather</th>
                <th>comment</th>
                <th>edit</th>
                <th>delete</th>
              </tr>
     {state.mountains.map((s) => (
              <tr key={s.mountain}>
                <td>{s.mountain}</td>
                <td>{s.difficulty}</td>
                <td>{s.date}</td>
                <td>{s.firstTime}</td>
                <td>{s.list}</td>
                <td>{s.weather}</td>
                <td>{s.comment}</td>
                <td onClick={() => handleEdit(s._id)}>{"✏️"}</td>
                <td onClick={() => handleDelete(s._id)}>{"🚫"}</td>
              </tr>
            
          ))}
          </table>
          </div>
         

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
