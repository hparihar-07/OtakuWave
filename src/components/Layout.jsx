import { useState } from "react";
import { Outlet } from "react-router-dom";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import Footer from "./Footer";

const Layout = () => {
  const [currentSong, setCurrentSong] = useState(null);

  return (
    <div className="min-h-screen bg-black">
      <main className="pb-24">
        <Outlet context={{ setCurrentSong }} />
      </main>

      {currentSong && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg">
          <AudioPlayer
            src={currentSong.audio_url}
            showJumpControls={false}
            layout="stacked-reverse"
            customProgressBarSection={[
              "PROGRESS_BAR",
              "CURRENT_TIME",
              "DURATION",
            ]}
            customControlsSection={["MAIN_CONTROLS", "VOLUME_CONTROLS"]}
          />
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Layout;
