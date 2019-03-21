import React from "react";
import css from "./authed.module.css";

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
		fetch("http://localhost:5000/login", {
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

		// .then(data => localStorage.setItem("token", data.token))
		// .then(data => this.setState({ isloggedin: true }))
		// .then(_ => this.sendToPrivate);
	};

	logout = () => {
		localStorage.removeItem("token");
		this.setState({ isLoggedIn: false, secret: "" });
	};
	showSecret = async () => {
		try {
			this.setState({ isLoading: true });
			const token = localStorage.getItem("token");
			const response = await fetch(
				`http://localhost:5000/private?token=${token}`
			);
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
				{this.state.isLoggedIn
					? "Welcome Home"
					: "You are not allowed to be here"}

				{!this.state.isLoggedIn ? (
					<form onSubmit={this.login}>
						<input
							onChange={this.onChange}
							value={this.state.email}
							name="email"
							type="email"
							placeholder="email"
						/>
						<input
							onChange={this.onChange}
							value={this.state.password}
							name="password"
							type="password"
							placeholder="password"
						/>
						<button type="submit">Login</button>
					</form>
				) : (
					<>
						<button onClick={this.logout}>Log Out</button>
						{this.state.secret ? (
							<div>{this.state.secret}</div>
						) : (
							<button onClick={this.showSecret}>
								Show Secret
							</button>
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
