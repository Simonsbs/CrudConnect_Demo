import React, { useState } from "react";
import axios from "axios";

function Login() {
  const [loginData, setLoginData] = useState({
    Email: "",
    Password: "",
  });
  const [token, setToken] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        "https://gnte7mjwg9.execute-api.us-east-1.amazonaws.com/newdev/login/3ee2483e-1fd3-4616-b6c1-9c96e06aae56",
        loginData
      )
      .then((response) => {
        setToken(response.data.token); // Assuming the token is returned as { token: 'your_token' }
      })
      .catch((error) => {
        console.error("Error logging in:", error);
      });
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="Email"
          value={loginData.Email}
          onChange={handleInputChange}
          placeholder="Email"
        />
        <input
          name="Password"
          type="password"
          value={loginData.Password}
          onChange={handleInputChange}
          placeholder="Password"
        />
        <button type="submit">Login</button>
      </form>
      {token && (
        <div>
          <label>Token:</label>
          <textarea readOnly value={token} />
        </div>
      )}
    </div>
  );
}

export default Login;
