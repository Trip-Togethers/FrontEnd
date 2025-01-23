import { styled } from "styled-components";

interface Props {
	icon: any;
	text: string;
}

function SidebarButton({ icon, text }: Props) {
	return (
		<SidebarButtonStyle>
				<div>{icon}</div>
				<div><p>{text}</p></div>
		</SidebarButtonStyle>
	);
}

const SidebarButtonStyle = styled.div`
	display: flex;
	flex-direction: column;
	width: 50px;
	height: 70px;
	margin: 10px 0;

	div {
		display: flex;
		justify-content: center;
		align-items: center;

		p {
			margin: 0;
			padding: 0;
			color: ${({ theme }) => theme.color.name_gray};
			font-family: ${({ theme }) => theme.font.family.default};
		};
	};

`;

export default SidebarButton;