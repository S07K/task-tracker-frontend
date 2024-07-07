import { useEffect } from "react";
import { useRouteError, useNavigate } from "react-router-dom";

export default function ErrorPage() {
  const error: any = useRouteError();
  console.error(error);
  const navigate = useNavigate();
  console.log("navigate", navigate);

  // Redirect to login page after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login', { replace: true });
    }, 100);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <span>Sorry, an unexpected error has occurred.</span>
      {
        error &&
        <p id="error-note">
          <i>{error.statusText || error.message}</i>
        </p>
      }
      <p>Redirecting to login page...</p>
    </div>
  );
}