import style from "./App.module.css";
import Header from "./components/Header";
import CalendarContainer from "./components/CalendarContainer";

function App() {
  return <main className={style.main}>
    <Header />
    <CalendarContainer />
  </main>;
}

export default App;
