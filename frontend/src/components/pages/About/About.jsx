import React from "react";
import VideoCarousel from './VideoCarousel';
import styles from "./about.module.css";
import Step1Icon from "./icons/Step1Icon";
import Step2Icon from "./icons/Step2Icon";
import Step3Icon from "./icons/Step3Icon";

const About = () => {
  return (
    <>
     {/* <div className="home-container">
      <div className="home-text">
        <h1>Connecting <span style={{ color: "#805AD5" }}>buyers and sellers</span>,one bid at a time.</h1>
        <p>The value of anything is what someone is willing to bid.</p>
      </div>
      <div className="home-video">
        <VideoCarousel />
      </div>
    </div> */}


 {/* below section is for about */}
    <section className={styles.biddingContainer}>
      <h2 className={styles.title}>How Bidding Works</h2>
      <p className={styles.introText}>
        Simply place your bids online and bid for top used Car at Surplex.
      </p>
      <div className={styles.stepsWrapper}>
        <div className={styles.step}>
          <div className={styles.stepIcon}><Step1Icon /></div>
          <h3 className={styles.stepTitle}>step_<span>01</span></h3>
          <h4 className={styles.stepHeading}>Find the right item</h4>
          <p className={styles.stepDesc}>Browse or use our search agent: Surplex has numerous used Car on offer</p>
        </div>
        <div className={styles.step}>
          <div className={styles.stepIcon}><Step2Icon /></div>
          <h3 className={styles.stepTitle}>step_<span>02</span></h3>
          <h4 className={styles.stepHeading}>Place a bid</h4>
          <p className={styles.stepDesc}>Place a direct bid or use our bidding agent to achieve the best price for an item.</p>
        </div>
        <div className={styles.step}>
          <div className={styles.stepIcon}><Step3Icon /></div>
          <h3 className={styles.stepTitle}>step_<span>03</span></h3>
          <h4 className={styles.stepHeading}>Pay & receive your item</h4>
          <p className={styles.stepDesc}>Winners receive invoices, pick payment options, and coordinate pickup with our service.</p>
        </div>
      </div>
    </section>
    
    </>
  );
};

export default About;
