import { useRouteError } from "react-router-dom";

interface RouteError {
    status: number;
    statusText: string;
}

const Error = () => {
    const error = useRouteError() as RouteError;
    return (
        <>
            <h1>에러가 발생했습니다.</h1>
            <div>다음과 같은 오류가 발생했습니다.</div>
            <div>{error.status}</div>
            <div>{error.statusText}</div>
        </>
    );
};

export default Error;
