import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error: any = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <span>Sorry, an unexpected error has occurred.</span>
      <p id="error-note">
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}