import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import style from "./App.module.css";
import error401 from "./assets/svg/undraw_page_not_found_re_e9o6.svg"

export default function ErrorPage() {
  const navigate = useNavigate();

  // Redirect to login page after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home', { replace: true });
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={style.errorPage}>
      <div className={style.infoContainer}>
        <h1>Oops!</h1>
        <span>Sorry, an unexpected error has occurred.</span>
        <p>Redirecting to login page...</p>
      </div>
      <img src={error401} alt="Error 401" />
    </div>
  );
}