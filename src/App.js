import { useState, useEffect } from "react";
import "./styles.css";

export default function App() {
  const [state, setState] = useState({
    mountains: [{ mountain: "Mt. Washington", difficulty: "4" }],
    newMountain: {
      mountain: "",
      difficulty: "3",
    },
  });

  async function getAppData() {
    try {
      const BASE_URL = 'http://localhost:3001/api/mountains';
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
  }, []);

  async function addMountain(e) {
    e.preventDefault();
    
    const BASE_URL = 'http://localhost:3001/api/mountains';
    
    const mountain = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-type': 'Application/json'
      },
      body: JSON.stringify(state.newMountain)
    }).then(res => res.json());

    setState((prevState) => ({
      mountains: [...prevState.mountains, mountain],
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
        ...prevState.newSkill,
        [e.target.name]: e.target.value 
      }
    })) 
  }

  return (
    <section>
      <h2>Peak Baggers</h2>
      <hr />
      {state.mountains.map((s) => (
        <article key={s.mountain}>
          <div>{s.mountain}</div> <div>{s.difficulty}</div>
        </article>
      ))}
      <hr />
      <form onSubmit={addMountain}>
        <label>
          <span>Mountain</span>
          <input name="mountain" value={state.newMountain.mountain} onChange={handleChange} />
        </label>
        <label>
          <span>Difficulty</span>
          <select name="difficulty" value={state.newMountain.difficulty} onChange={handleChange} >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </label>
        <button>ADD Mountain</button>
      </form>
    </section>
  );
}