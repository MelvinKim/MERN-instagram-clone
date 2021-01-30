import React, { useState, useEffect } from "react";
import M from "materialize-css";
import EmailValidator from "email-validator";

const CreatePost = (props) => {
	const [title, setTitle] = useState("");
	const [body, setBody] = useState("");
	const [image, setImage] = useState("");
	const [url, setUrl] = useState("");

	useEffect(
		() => {
			//to the backend
			if (url) {
				fetch("/createpost", {
					method: "post",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + localStorage.getItem("jwt"),
					},
					body: JSON.stringify({
						//remember image
						title: title,
						body: body,
						pic: url,
					}),
				})
					.then((res) => res.json())
					.then((data) => {
						if (data.error) {
							M.toast({
								html: data.error,
								classes: "#c62828 red darken-3",
							});
						} else {
							M.toast({
								html: "Created Post successfully",
								classes: "#43a047 green darken-1",
							});
							props.history.push("/");
						}
					})
					.catch((err) => {
						console.log("err while saving user", err);
					});
			}
		},
		[url]
	);

	const postDetails = () => {
		const data = new FormData();
		data.append("file", image);
		//cloudinary
		data.append("upload_preset", "insta-clone");
		data.append("cloud_name", "dyjp6vejk");
		fetch("https://api.cloudinary.com/v1_1/dyjp6vejk/image/upload", {
			method: "post",
			body: data,
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				setUrl(data.url);
			})
			.catch((err) => {
				console.log("No internet connection" + err);
			});
	};

	return (
		<div
			className="card input-field"
			style={{
				margin: "3rem auto",
				maxWidth: "500px",
				padding: "20px",
				textAlign: "center",
			}}>
			<input
				type="text"
				placeholder="title"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
			/>
			<input
				type="text"
				placeholder="body"
				value={body}
				onChange={(e) => setBody(e.target.value)}
			/>
			<div className="file-field input-field">
				<div className="btn #64b5f6 blue darken-1">
					<span>UPLOAD IMAGE</span>
					<input type="file" onChange={(e) => setImage(e.target.files[0])} />
				</div>
				<div className="file-path-wrapper">
					<input type="text" className="file-path validate" />
				</div>
			</div>
			<button
				onClick={() => postDetails()}
				className="btn waves-effect waves-light #64b5f6 blue darken-1"
				type="submit">
				SUBMIT POST
			</button>
		</div>
	);
};

export default CreatePost;
