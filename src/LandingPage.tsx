import React from "react";
import Header from "./components/Header";
import { Box, Text } from "@chakra-ui/react";
import style from "./LandingPage.module.css";
import { motion, Variants } from "framer-motion";
import { Link } from "react-router-dom";

const LandingPage: React.FC = () => {
  const animVariants: Variants = {
    offscreen: {
      opacity: 0,
      y: -5,
    },
    onscreen: {
      opacity: 1,
      y: 0,
    },
  };
  return (
    <>
      <Header />
      <Box className={style.pageWrapper}>
        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: false, amount: 0.8 }}
          variants={animVariants}
        >
          <section className={style.section}>
            <div className={style.content}>
              <span className={style.smallTitle}>Master Your Day</span>
              <p className={style.bigTitle}>
                <span>
                  <span>Simplify Tasks, </span>
                  Amplify <span className={style.highlight}>Productivity</span>
                </span>
              </p>
              {/* <button className={style.section1Button}>Get Started</button> */}
            </div>
            <div className={style.imageWrapper}>
              <img
                src="src/assets/images/eventSchedule.png"
                alt="landing page"
                className={style.image}
              />
            </div>
          </section>
        </motion.div>

        <section className={style.section2}>
          <div className={style.imageWrapper}>
            <img
              src="src/assets/images/centerCalendar.png"
              alt="landing page"
              className={style.image}
            />
          </div>
          <div className={style.content}>
            <p className={style.bigTitle}>
              “ Your Ultimate Companion for{" "}
              <span className={style.highlight}>Effortless Organization</span> ”
            </p>
          </div>
        </section>
      </Box>
      <footer className={style.footerWrapper}>
        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: false, amount: 0.8 }}
          variants={animVariants}
        >
          <span className={style.bigTitle}>Task Tracker</span>
        </motion.div>
        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: false, amount: 0.8 }}
          variants={animVariants}
        >
          <span className={style.smallText}>Built by <Text _hover={{textDecoration: 'underline'}} style={{display: 'contents'}}><Link to={'https://s07k.github.io/portfolio/'}>Shubham</Link></Text> with 🤍</span>
        </motion.div>
      </footer>
    </>
  );
};

export default LandingPage;
