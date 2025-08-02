import VideoCarousel from './VideoCarousel';

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-text">
        <h1>Connecting <span style={{ color: "#805AD5" }}>buyers and sellers</span>,one bid at a time.</h1>
        <p>The value of anything is what someone is willing to bid.</p>
      </div>
      <div className="home-video">
        <VideoCarousel />
      </div>
    </div>
  );
};

export default Home;
