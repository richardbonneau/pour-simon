import React, { Component } from "react";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginInput: "",
      passwordInput: ""
    };
  }

  LoginChange = evt => {
    this.setState({ LoginInput: evt.target.value });
  };
  passwordChange = evt => {
    this.setState({ passwordInput: evt.target.value });
  };
  submitHandler = async evt => {
    evt.preventDefault();
    console.log("Login", this.state.loginInput);
    console.log("password", this.state.passwordInput);
    let data = new FormData();
    data.append("username", this.state.loginInput);
    data.append("password", this.state.passwordInput);
    fetch("/new-user", { method: "POST", body: data });
    /////ici faire une methode qui change le state de app avec un username
  };

  render() {
    return (
      <form onSubmit={this.submitHandler}>
        Signup <input type="text" onChange={this.LoginChange} />
        Password <input type="text" onChange={this.passwordChange} />
        <input type="submit" value="login" />
      </form>
    );
  }
}

export default Login;
