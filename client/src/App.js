import { useEffect, useState } from "react";
import "./App.css";
import Axios from "axios";

function App() {
  Axios.defaults.withCredentials = true;
  // register
  const [usernameReg, setUsernameReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");
  const register = () => {
    Axios.post("http://localhost:3001/register", {
      username: usernameReg,
      password: passwordReg,
    }).then((response) => {
      console.log(response);
    });
  };

  //login
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  const login = () => {
    Axios.post("http://localhost:3001/login", {
      username: username,
      password: password,
    }).then((response) => {
      console.log(response);
      //console.log(response.data[0]);
      if (response.data.message) {
        setLoginStatus(response.data.message);
      } else {
        setLoginStatus(response.data[0].username);
      }
    });
  };

  useEffect(() => {
    Axios.get("http://localhost:3001/login").then((res) => {
      if (res.data.loggedIn == true) {
        setLoginStatus(res.data.user[0].username);
      }
    });
  }, []);

  // render UI
  return (
    <div className="App">
      <div className="register">
        <h1>Registration</h1>
        <label>Username</label>
        <input
          type="text"
          placeholder="create username..."
          onChange={(e) => setUsernameReg(e.target.value)}
        />
        <label>Password</label>
        <input
          type="password"
          placeholder="create password..."
          onChange={(e) => setPasswordReg(e.target.value)}
        />
        <button onClick={() => register()}>register</button>
        <h4>Have a account ? login </h4>
      </div>
      <div className="login">
        <h1>Login</h1>
        <label>Username</label>
        <input
          type="text"
          placeholder="typing username..."
          onChange={(e) => setUsername(e.target.value)}
        />
        <label>Password</label>
        <input
          type="password"
          placeholder="typing password..."
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={() => login()}>login</button>
        <h4>Does'nt a account ? Register </h4>
      </div>
      <h2>{loginStatus}</h2>
    </div>
  );
}

export default App;
