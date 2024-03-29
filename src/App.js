import { useState, useEffect } from "react";
import Header from "./components/Header/Header";
import HikeInfo from "./components/HikeInfo/HikeInfo";
import SimpleSlider from "./components/HikeInfo/Carousel";
import "./styles.css"; 
import { auth } from "./services/firebase";


export default function App() {

  const [state, setState] = useState({
    user: null,
    mountains: [],
    newMountain: {
      mountain: "",
      location: "RI",
      firstTime: "No",
      list: "State Highpoints",
      weather: "",
      comment: "",
    },
    editMode: false
  });


  async function getAppData() {
    if(!state.user) return;
    try {
  
      //const BASE_URL = `http://localhost:3001/api/mountains?uid=${state.user.uid}`;
      const BASE_URL = `https://project3back.herokuapp.com/api/mountains?uid=${state.user.uid}`
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
    
    //const BASE_URL = 'http://localhost:3001/api/mountains';
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
          location: "RI",
          firstTime: "No",
          list: "State Highpoints",
          weather: "",
          comment: "",
      },
      }));
    } else {
      const { mountain, location, firstTime, list, weather, comment, _id } = state.newMountain;

      const mountains = await fetch(`${BASE_URL}/${_id}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'Application/json'
        },
        body: JSON.stringify({ mountain, location, firstTime, list, weather, comment })
      }).then(res => res.json());

      setState(prevState => ({
        ...prevState,
         mountains,
        newMountain: {
         mountain: "",
          location: "RI",
          firstTime: "No",
          list: "State Highpoints",
          weather: "",
          comment: "",
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
    //const URL = `http://localhost:3001/api/mountains/${mountainId}`;
    const URL = `https://project3back.herokuapp.com/api/mountains/${mountainId}`;
    
    const mountains = await fetch(URL, {
      method: 'DELETE'
    }).then(res => res.json());

    setState(prevState => ({
      ...prevState,
      mountains,
    }));
  }

  function handleEdit(mountainId) {
    const { mountain, location, firstTime, list, weather, comment, _id } = state.mountains.find(mountain => mountain._id === mountainId);
    setState(prevState => ({
      ...prevState,
      newMountain: {
        mountain,
        location,
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
        location,
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
        <HikeInfo user={state.user}/>
        
        <main>
             
           <div  className="results" >
             
            {state.user &&
              
              <table > 
                <tbody>
                  <tr>
                    <th>Mountain</th>
                    <th>Location</th>
                    <th>First Time?</th>
                    <th>List</th>
                    <th>Weather</th>
                    <th>Comment</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                  
                  {state.mountains.map((m) => (
                    <tr key={m.mountain}>
                      <td>{m.mountain}</td>
                      <td>{m.location}</td>
                      <td>{m.firstTime}</td>
                      <td>{m.list}</td>
                      <td>{m.weather}</td>
                      <td>{m.comment}</td>
                      <td onClick={() => handleEdit(m._id)}>{"✏️"}</td>
                      <td onClick={() => handleDelete(m._id)}>{"🚫"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            }
             
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
                    type="text"
                    placeholder="Name of mountain"
                    value={state.newMountain.mountain}
                    onChange={handleChange}
                  />
                </label>

             

              <label>
                  <span>location</span>
                  <select
                    name="location"
                    value={state.newMountain.location}
                    onChange={handleChange}
                  >
                    <option value="Abroad">Abroad</option>
                   	<option value="AL">Alabama</option>
                    <option value="AK">Alaska</option>
                    <option value="AZ">Arizona</option>
                    <option value="AR">Arkansas</option>
                    <option value="CA">California</option>
                    <option value="CO">Colorado</option>
                    <option value="CT">Connecticut</option>
                    <option value="DE">Delaware</option>
                    <option value="DC">District Of Columbia</option>
                    <option value="FL">Florida</option>
                    <option value="GA">Georgia</option>
                    <option value="HI">Hawaii</option>
                    <option value="ID">Idaho</option>
                    <option value="IL">Illinois</option>
                    <option value="IN">Indiana</option>
                    <option value="IA">Iowa</option>
                    <option value="KS">Kansas</option>
                    <option value="KY">Kentucky</option>
                    <option value="LA">Louisiana</option>
                    <option value="ME">Maine</option>
                    <option value="MD">Maryland</option>
                    <option value="MA">Massachusetts</option>
                    <option value="MI">Michigan</option>
                    <option value="MN">Minnesota</option>
                    <option value="MS">Mississippi</option>
                    <option value="MO">Missouri</option>
                    <option value="MT">Montana</option>
                    <option value="NE">Nebraska</option>
                    <option value="NV">Nevada</option>
                    <option value="NH">New Hampshire</option>
                    <option value="NJ">New Jersey</option>
                    <option value="NM">New Mexico</option>
                    <option value="NY">New York</option>
                    <option value="NC">North Carolina</option>
                    <option value="ND">North Dakota</option>
                    <option value="OH">Ohio</option>
                    <option value="OK">Oklahoma</option>
                    <option value="OR">Oregon</option>
                    <option value="PA">Pennsylvania</option>
                    <option value="RI">Rhode Island</option>
                    <option value="SC">South Carolina</option>
                    <option value="SD">South Dakota</option>
                    <option value="TN">Tennessee</option>
                    <option value="TX">Texas</option>
                    <option value="UT">Utah</option>
                    <option value="VT">Vermont</option>
                    <option value="VA">Virginia</option>
                    <option value="WA">Washington</option>
                    <option value="WV">West Virginia</option>
                    <option value="WI">Wisconsin</option>
                    <option value="WY">Wyoming</option>
                    
                  </select>
                </label>


                
                <label>
                  <span>First time hiking this mountain?</span>
                  <select
                    name="firstTime"
                    type="text"
                    placeholder="Yes/No"
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
                    type="text"
                    placeholder="list"
                    value={state.newMountain.list}
                    onChange={handleChange}
                  >
                    <option value="NH 4000 Footer Club">NH 4000 Footer Club</option>
                    <option value="VT 4000 Footer Club">VT 4000 Footer Club</option>
                    <option value="ME 4000 Footer Club">ME 4000 Footer Club</option>
                    <option value="State Highpoints">State Highpoints</option>
                    <option value="Adirondack High Peaks">Adirondack High Peaks</option>
                    <option value="Appalachian Trail">Appalachian Trail</option>
                    <option value="Pacific Crest Trail">Pacific Crest Trail</option>
                    <option value="Continental Divide Trail">Continental Divide Trail</option>
                    <option value="International Hikes">International Hikes</option>
                  </select>
                </label>

                <label>
                  <span>Weather</span>
                  
                  <input
                    name="weather"
                    placeholder='Weather conditions'
                    type="text"
                    value={state.newMountain.weather}
                    onChange={handleChange}
                  />
                </label>

                <label>
                  <span>Comments</span>
                  
                  <input
                    name="comment"
                    placeholder='share details about your hike'
                    type="text"
                    value={state.newMountain.comment}
                    onChange={handleChange}
                  />
                </label>
                  <button>{state.editMode ? 'EDIT Mountain' : 'ADD Mountain'}</button>
              </form>
                {state.editMode && <button onClick={handleCancel}>CANCEL</button> }
               <SimpleSlider className ="slider" user={state.user} />
            </>
          }
    
      </main>
      
    </>
  );
}