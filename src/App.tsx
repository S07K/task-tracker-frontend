import style from "./App.module.css";
import Header from "./components/Header";
import CalendarContainer from "./components/CalendarContainer";
import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const brandPrimary = defineStyle({
  background: "var(--lightPrimayBGColor)",
  color: "var(--lightPrimaryFontColor)",
});

export const buttonTheme = defineStyleConfig({
  variants: { brandPrimary },
});

function App() {
  return (
    <>
      <main className={style.main}>
        <Header />
        <CalendarContainer />
      </main>
    </>
  );
}

export default App;
