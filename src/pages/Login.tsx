import { styled } from "styled-components";
import { useState } from "react";
import Plane from "@assets/svg/Plane";
import Logo from "@assets/svg/Logo";
import KakaoLogo from "@assets/svg/KakaoLogo";
import { Link } from "react-router-dom";

export interface LoginProps{
	email: string;
	password: string;
}

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	return (
		<LoginStyle>
			<Plane className="background-svg"/>
			<form>
				<fieldset>
					<Logo className="logo"/>
					<input type = "email" 
							placeholder = "이메일"
							value = {email}/>
					<input type = "password" 
							placeholder = "비밀번호"
							value = {password}/>
					<button type = "submit">로그인</button>
					<div>
						<div className="hr-sect">또는 다음으로 로그인</div>
						<KakaoLogo className="kakao"/>
					</div>
					<span className="join">
						<StyledLink to = '/users/join'>
							회원가입
						</StyledLink>
					</span>
				</fieldset>
			</form>
		</LoginStyle>
	);
}

const LoginStyle = styled.div`
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

	.hr-sect {
		display: flex;
		align-items: center;
		color: ${({theme}) => theme.color.input_text};
		font: ${({theme}) => theme.font.title};
		opacity: 0.4;
	}

	.hr-sect::before,
	.hr-sect::after {
		content: "";
		flex-grow: 1;
		background:${({theme}) => theme.color.input_text};
		height: 0.5px;
		font-size: 0px;
		line-height: 0px;
		margin: 0px 16px;
	}

	.kakao{
		height: 50px;
	}
`;

const StyledLink = styled(Link)`
    color: ${({theme}) => theme.color.primary_green};
`;

export default Login;