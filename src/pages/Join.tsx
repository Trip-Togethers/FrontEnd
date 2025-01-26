import { styled } from "styled-components";
import { useState } from "react";
import { Plane } from "@assets/svg";
import { Logo } from "@assets/svg";
import { useForm } from "react-hook-form";



function Join() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [contact, setContact] = useState("");

	const handleSubmit = (event: React.
	FormEvent<HTMLFormElement>) => {
		event.preventDefault();
	}

	return (
		<JoinStyle>
			<Plane className="background-svg"/>
			<form onSubmit = {handleSubmit}>
				<fieldset>
					<Logo className="logo"/>
					<input type = "email" 
							placeholder = "이메일"
							value = {email}
							onChange={(e) => setEmail(e.target.value)}/>
					<input type = "text" 
							placeholder = "닉네임"
							value = {name}
							onChange={(e) => setName(e.target.value)}/>
					<input type = "password" 
							placeholder = "비밀번호"
							value = {password}
							onChange={(e) => setPassword(e.target.value)}/>
					<input type = "tel" 
							placeholder = "연락처"
							value = {contact}
							onChange={(e) => setContact(e.target.value)}/>		
					<button type = "submit">회원가입</button>
				</fieldset>
			</form>
		</JoinStyle>
		)
}

const JoinStyle = styled.div`
position: relative;
	width: 100vw;
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	background-color: ${({theme}) => theme.color.primary_green};
	z-index: -2;

	.background-svg {
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1; 
		object-fit: fill;
	}

	fieldset{
		width: 530px;
		height: 580px;
		border-radius: 14px;
		border: none;
		display: flex;
		flex-direction: column;
		text-align: center;
		background-color: ${({theme}) => theme.color.primary_white};
		box-shadow: rgba(0, 0, 0, 0.25) 0px 4px 5px 0px;
	}

	.logo{
		height: 42px;
		fill : ${({theme}) => theme.color.primary_green};
		margin: 40px auto 30px;
	}

`;

export default Join;
