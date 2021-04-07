import { useState, useEffect } from "react";
import "./styles.css";
import Header from "./components/Header/Header";
import { login, logout, auth } from "./services/firebase";
export default function App() {

  const [state, setState] = useState({
    user: null,
    mountains: [{ mountain: "Mt. Washington", difficulty: "4" }],
    newMountain: {
      mountain: "",
      difficulty: "3",
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
        difficulty: "3",
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
              <div>{s.mountain}</div> <div>{s.difficulty}</div>
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
                <button>ADD Mountain</button>
              </form>
            </>
          )}
        </section>
      </main>
    </>
  );
}