import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  X as CloseIcon,
} from "lucide-react";

const defaultCover =
  "https://img.freepik.com/free-photo/purple-mountain-landscape_1048-10720.jpg?ga=GA1.1.1406304143.1745563632&semt=ais_hybrid&w=740";

const Home = () => {
  const [songs, setSongs] = useState([]);
  const [trendingSong, setTrendingSong] = useState(null);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    fetchSongs();
  }, []);

  useEffect(() => {
    if (currentSong) {
      audioRef.current.src = currentSong.audio_url;
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [currentSong]);

  useEffect(() => {
    const handleSongEnd = () => {
      skipToNext(); // Automatically skip to the next song when current song ends
    };

    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener("ended", handleSongEnd);
    }

    // Cleanup event listener when component unmounts
    return () => {
      if (audioElement) {
        audioElement.removeEventListener("ended", handleSongEnd);
      }
    };
  }, [currentSong]);

  const fetchSongs = async () => {
    const { data, error } = await supabase.from("songs").select("*");
    if (!error && data.length > 0) {
      setSongs(data);
      const randomIndex = Math.floor(Math.random() * data.length);
      setTrendingSong(data[randomIndex]);
    }
  };

  const filteredSongs = songs.filter((song) =>
    song.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const playSong = (song) => {
    if (currentSong?.id === song.id && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setCurrentSong(song);
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    const current = audioRef.current.currentTime;
    const total = audioRef.current.duration;
    setCurrentTime(current);
    setDuration(total);
    if (progressRef.current) {
      progressRef.current.value = (current / total) * 100 || 0;
    }
  };

  const handleProgressChange = (e) => {
    const newTime = (e.target.value / 100) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const skipToPrevious = () => {
    if (!currentSong) return;
    const index = songs.findIndex((s) => s.id === currentSong.id);
    const prevIndex = (index - 1 + songs.length) % songs.length;
    setCurrentSong(songs[prevIndex]);
  };

  const skipToNext = () => {
    if (!currentSong) return;
    const index = songs.findIndex((s) => s.id === currentSong.id);
    const nextIndex = (index + 1) % songs.length; // Loop back to the first song if at the end
    setCurrentSong(songs[nextIndex]); // Set the next song
  };

  const closePlayer = () => {
    audioRef.current.pause();
    setCurrentSong(null);
    setIsPlaying(false);
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="min-h-screen bg-black text-white pb-32 px-4 sm:px-6 lg:px-8 font-roboto">
      <header className="flex flex-col sm:flex-row justify-between items-center py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl heat sm:text-6xl font-poppins font-extrabold text-[#ADFF2F] mb-8 sm:mb-0 neon-text glow-effect">
          OtakuWave
        </h1>

        <input
          type="text"
          placeholder="Search songs or artists..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-[#BEE4D0] effect text-black font-bold px-4 py-2 rounded-md w-full sm:w-72 lg:w-96 focus:outline-none font-roboto"
        />
      </header>

      {trendingSong && (
        <section className="mb-10 w-full p-4">
          <h2 className="text-2xl sm:text-3xl font-poppins text-center font-bold underline mb-6 text-teal-300">
            Trending Song
          </h2>
          <div className="bg-[#D0F0C0] p-6 effect rounded-lg w-full sm:w-11/12 lg:w-9/12 mx-auto overflow-hidden">
            <div className="relative w-full h-64 sm:h-80 lg:h-96">
              <img
                src={trendingSong.cover_url || defaultCover}
                alt={trendingSong.name}
                className="w-full h-full rounded-3xl object-contain"
              />
            </div>
            <div className="p-7">
              <h3 className="text-xl sm:text-2xl font-mono font-bold text-[#FF00FF] truncate">
                {trendingSong.name}
              </h3>
              <p className="text-sm sm:text-base font-roboto text-black mb-4">
                {trendingSong.artist}
              </p>
              <button
                onClick={() => playSong(trendingSong)}
                className="w-full bg-indigo-600 text-white p-3 rounded-lg effect hover:bg-[#FF3bff] transition-colors"
              >
                <Play className="w-5 h-5 inline-block" />
                <span className="ml-2 font-roboto">Play</span>
              </button>
            </div>
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl sm:text-2xl font-poppins text-center font-bold underline mb-6 text-teal-300">
          All Songs
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {filteredSongs.map((song) => (
            <div
              key={song.id}
              className="bg-[#98FB98] effect rounded-lg p-4 shadow-md hover:bg-[#ffd787] transition duration-200"
            >
              <img
                src={song.cover_url || defaultCover}
                alt={song.name}
                className="w-full h-48 sm:h-56 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl sm:text-xl font-poppins text-center font-bold bg-pink-100 rounded text-[#FF00FF] truncate">
                {song.name}
              </h3>
              <button
                className="mt-3 bg-indigo-500 px-12 py-2 rounded-full hover:bg-[#FF3bff] transition"
                onClick={() => playSong(song)}
              >
                <Play className="h-7 w-7 text-white" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {currentSong && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#222222] py-4 px-7 flex flex-col items-center">
          <div className="flex items-center justify-between w-full mb-2">
            <div className="flex items-center space-x-4">
              <img
                src={currentSong.cover_url || defaultCover}
                alt={currentSong.name}
                className="w-16 h-16 rounded-xl object-cover mb-2"
              />
              <div className="flex flex-col justify-center">
                <h4 className="font-poppins font-semibold text-lg text-green-400">
                  {currentSong.name}
                </h4>
                <p className="text-sm text-[#F4F8F6] font-roboto">
                  {currentSong.artist}
                </p>
              </div>
            </div>
            <button
              onClick={closePlayer}
              className="text-green-400 bg-amber-100 rounded-full"
              title="Close Player"
            >
              <CloseIcon />
            </button>
          </div>

          <div className="w-full flex flex-col items-center space-y-2">
            <input
              type="range"
              ref={progressRef}
              min="0"
              max="100"
              value={(currentTime / duration) * 100 || 0}
              onChange={handleProgressChange}
              className="w-full h-1 bg-green-500 rounded-full cursor-pointer"
            />
            <div className="flex justify-between text-sm text-[#F4F8F6] w-full">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={skipToPrevious}
                className="text-green-500 bg-black p-2 rounded-full hover:text-[#FF3bff]"
              >
                <SkipBack />
              </button>
              <button
                onClick={handlePlayPause}
                className="bg-green-500 text-white p-2 rounded-full hover:bg-[#FF3bff]"
              >
                {isPlaying ? <Pause /> : <Play />}
              </button>
              <button
                onClick={skipToNext}
                className="text-green-500 bg-black p-2 rounded-full hover:text-[#FF3bff]"
              >
                <SkipForward />
              </button>
            </div>
          </div>
        </div>
      )}

      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(audioRef.current.duration)}
      />
    </div>
  );
};

export default Home;
