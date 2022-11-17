import React, { Component } from 'react';
import Form from 'react-validation/build/form'
import Input from 'react-validation/build/input'
import CheckButton from 'react-validation/build/button'
import AuthService from '../Services/AuthService';
import "bootstrap/dist/css/bootstrap.min.css";

const required = value => {
    if (!value) {
        return (
            // <div className="alert alert-danger" role="alert">
            <div className="login-error">
                This field is required!
            </div>
        );
    }
};

export default class Login extends Component {

    state = {
        username: "",
        password: "",
        loading: false,
        message: ""
    };

    onChangeUsername = (e) => {
        this.setState({
            username: e.target.value
        });
    }

    onChangePassword = (e) => {
        this.setState({
            password: e.target.value
        });
    }

    handleLogin = (e) => {
        e.preventDefault();

        this.setState({
            message: "",
            loading: true
        });

        this.form.validateAll();

        if (this.checkBtn.context._errors.length === 0) {
            AuthService.login(this.state.username, this.state.password).then(
                () => {
                    this.props.history.push("/home");
                    window.location.reload();
                },
                error => {
                    const resMessage = "Invalid Username or Password"
                        // (error.response &&
                        //     error.response.data &&
                        //     error.response.data.message) ||
                        // error.message ||
                        // error.toString();

                    this.setState({
                        loading: false,
                        message: resMessage
                    });
                }
            ).then(console.log(AuthService.getCurrentUser()));
        } else {
            this.setState({
                loading: false
            });
        }
    }

    render() {
        return (
            <div className="login-card-out">
                <div className="col-md-5">
                    <div className="card card-container">
                        <div className="card login-card">
                            <h2 style={{textAlign:'center'}} className="fw-bold">Login</h2><br/>

                            <Form
                                onSubmit={this.handleLogin}
                                ref={c => {
                                    this.form = c;
                                }}
                            >
                                <div className="form-group">
                                    <Input
                                        type="text"
                                        className="form-control"
                                        name="username"
                                        placeholder="Username"
                                        value={this.state.username}
                                        onChange={this.onChangeUsername}
                                        validations={[required]}
                                    />
                                </div>

                                <div className="form-group">
                                    <Input
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        placeholder="Password"
                                        value={this.state.password}
                                        onChange={this.onChangePassword}
                                        validations={[required]}
                                    />
                                </div>

                                <div className="form-group">
                                    <button
                                        className="btn btn-dark btn-block"
                                        disabled={this.state.loading}
                                    >
                                        {this.state.loading && (
                                            <span className="spinner-border spinner-border-sm"></span>
                                        )}
                                        <span>Login</span>
                                    </button>
                                </div>

                                {this.state.message && (
                                    <div className="form-group">
                                        <div className="login-error">
                                            {this.state.message}
                                        </div>
                                    </div>
                                )}
                                <CheckButton
                                    style={{ display: "none" }}
                                    ref={c => {
                                        this.checkBtn = c;
                                    }}
                                />
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}