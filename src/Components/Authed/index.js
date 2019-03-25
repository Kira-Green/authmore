import React from "react";
import css from "./authed.module.css";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";

// const API_URL = "http://localhost:5000";

const API_URL = process.env.REACT_APP_API_URL;

class Authed extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoggedIn: Boolean(localStorage.getItem("token")),
			email: "",
			password: "",
			secret: "",
			isLoading: false
		};
	}

	onChange = event => {
		const { value, name } = event.target;
		this.setState(state => ({
			[name]: value
		}));
	};

	login = event => {
		event.preventDefault();

		this.setState({ isLoading: true });
		fetch(`${API_URL}/login`, {
			method: "POST",
			headers: {
				"Content-type": "application/json",
				Accept: "application/json"
			},
			body: JSON.stringify({
				email: this.state.email,
				password: this.state.password
			})
		})
			.then(res => res.json())
			.then(({ sucess, token }) => {
				if (sucess && token) {
					localStorage.setItem("token", token);
					this.setState({
						isLoggedIn: true,
						secret: ""
					});
				}
			})
			.catch(err => console.error(err))
			.finally(() => this.setState({ isLoading: false }));
	};

	logout = () => {
		localStorage.removeItem("token");
		this.setState({ isLoggedIn: false, secret: "" });
	};
	showSecret = async () => {
		try {
			this.setState({ isLoading: true });
			const token = localStorage.getItem("token");
			const response = await fetch(`${API_URL}/private?token=${token}`);
			const data = await response.json();
			console.log(data);
			this.setState({ secret: data.message });
		} catch (err) {
			return {
				sucess: false,
				message: "Error logging in"
			};
		} finally {
			this.setState({ isLoading: false });
		}
	};

	render() {
		return (
			<div>
				<AppBar
					position="static"
					color="default"
					className={css.appBar}
				>
					<Toolbar className={css.toolBar}>
						<Typography variant="h6" color="inherit">
							Welcome to the App
						</Typography>
					</Toolbar>
				</AppBar>
				{this.state.isLoggedIn
					? "Welcome Home"
					: "You are not allowed to be here"}

				{!this.state.isLoggedIn ? (
					<Paper className={css.container}>
						<form onSubmit={this.login}>
							<TextField
								variant="outlined"
								onChange={this.onChange}
								value={this.state.email}
								name="email"
								type="email"
								placeholder="email"
							/>
							<TextField
								variant="outlined"
								onChange={this.onChange}
								value={this.state.password}
								name="password"
								type="password"
								placeholder="password"
							/>
							<Button type="submit">Login</Button>
						</form>
					</Paper>
				) : (
					<>
						<Button variant="fab" onClick={this.logout}>
							Log Out
						</Button>
						{this.state.secret ? (
							<div>{this.state.secret}</div>
						) : (
							<Button
								variant="extendedFab"
								onClick={this.showSecret}
							>
								Show Secret
							</Button>
						)}
					</>
				)}
				{this.state.isLoading ? (
					<div className={css.loader}>Loading...</div>
				) : (
					""
				)}
			</div>
		);
	}
}

export default Authed;
