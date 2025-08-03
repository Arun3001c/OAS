// components/VideoCarousel.jsx
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import './VideoCarousel.css'; // optional for your custom styles
import video1 from '../../../assets/video1.mp4';
import video2 from '../../../assets/video2.mp4';
import video3 from '../../../assets/video3.mp4';

const VideoCarousel = () => {
  return (
    <div className="video-carousel">
      <Carousel
        showThumbs={false}
        autoPlay
        infiniteLoop
        showStatus={false}
        interval={4000}
        stopOnHover
      >
        {[video1, video2, video3].map((video, index) => (
          <div key={index}>
            <video
              src={video}
              controls
              style={{ width: "100%", borderRadius: "12px" }}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default VideoCarousel;
