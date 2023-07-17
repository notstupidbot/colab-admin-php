import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);
  const statusToIcons = status => {
    if(status){
      return status.toString().split('').map((number,index) => <i key={index} className={`bi bi-${number}-square`}/>)
    }
  }
  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      <p>{statusToIcons(error.status)}</p>
    </div>
  );
}