import Experience from "./Experience.js";

// Function to decrease the volume gradually.
function decreaseVolume(audio, volumeChangeRate, interval) {
  if (audio.volume > 0) {
    audio.volume -= volumeChangeRate;
  } else {
    clearInterval(interval);
    audio.pause();
  }
}

// Function to increase the volume gradually.
function increaseVolume(audio, volumeChangeRate, interval) {
  if (audio.volume < 0.5) {
    audio.volume += volumeChangeRate;
  } else {
    clearInterval(interval);
  }
}

export default class SongController {
  constructor() {
    this.experience = new Experience();
    this.debug = this.experience.debug;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("audio");
    }

    this.setMainSong();
  }

  setMainSong() {
    // Create an Audio object and provide the URL to your audio file.
    this.mainSong = new Audio("songs/song-of-little-ducks.mp3");
    let mainSong = this.mainSong;
    mainSong.volume = 0.5;

    mainSong.addEventListener("ended", function () {
      mainSong.play(); // ! When the song ends, play again
    });
    mainSong.load(); // ? Start loading the audio.
    mainSong.play(); // ? Automatically start playing the audio.

    // Increase/Decrease volume gradually in the start & end
    // Define the rate at which the volume changes (e.g., 0.02 per 100 milliseconds).
    const volumeChangeRate = 0.02;
    const intervalDuration = 100; // 100 milliseconds
    let decreaseInterval, increaseInterval;
    mainSong.addEventListener("play", function () {
      let originalVolume = mainSong.volume;
      mainSong.volume = 0;
      clearInterval(decreaseInterval);
      increaseInterval = setInterval(() => {
        increaseVolume(
          mainSong,
          volumeChangeRate,
          increaseInterval,
          originalVolume
        );
      }, intervalDuration);
    });

    // Debug
    if (this.debug.active) {
      this.debugFolder
        .add(mainSong, "volume")
        .name("mainSongVolume")
        .min(0)
        .max(1)
        .step(0.001);
    }
  }
}
