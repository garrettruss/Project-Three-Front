import { useState, useEffect } from "react";
import "./styles.css";
import Header from "./components/Header/Header";
import { login, logout, auth } from "./services/firebase";
export default function App() {

  const [state, setState] = useState({
    user: null,
    mountains: [{ 
      mountain: "Mt. Washington", 
      difficulty: "4", 
      date: "2021-04-01",
      firstTime: "No",
    }],
    newMountain: {
      mountain: "",
      difficulty: "4",
      date: "",
      firstTime: "No",
    },
  });


  async function getAppData() {
    const BASE_URL = "http://localhost:3001/api/mountains";
    const mountains = await fetch(BASE_URL).then((res) => res.json());
    setState((prevState) => ({
      ...prevState,
      mountains,
    }));
  }


  useEffect(() => {
    getAppData();
    auth.onAuthStateChanged((user) => {
      if (user) {
        setState((prevState) => ({
          ...prevState,
          user,
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          user: null,
        }));
      }
    });
  }, []);


  async function addMountain(e) {
    if (!state.user) return;
    e.preventDefault();
    const BASE_URL = "http://localhost:3001/api/mountains";
    const mountain = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-type": "Application/json",
      },
      body: JSON.stringify(state.newMountain),
    }).then((res) => res.json());
    setState((prevState) => ({
      ...prevState,
      mountains: [...prevState.mountains, prevState.newMountain],
      newMountain: {
        mountain: "",
        difficulty: "4",
        date: "",
        firstTime: "No",
      },
    }));
  }


  function handleChange(e) {
    setState((prevState) => ({
      ...prevState,
      newMountain: {
        ...prevState.newMountain,
        [e.target.name]: e.target.value,
      },
    }));
  }


  return (
    <>
      <Header user={state.user} />
      <main>
        <section>
          {state.mountains.map((s) => (
            <article key={s.mountain}>
              <div>{s.mountain}</div> <div>{s.difficulty}</div><div>{s.date}</div><div>{s.firstTime}</div>
            </article>
          ))}

          {state.user && (
            <>
              <hr />
              <form onSubmit={addMountain}>
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

                <button>ADD Mountain</button>

              </form>
            </>
          )}
        </section>
      </main>
    </>
  );
}