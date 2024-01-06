const wrapper = document.querySelector(".wrapper"),
  img = wrapper.querySelector("img"),
  musicName = wrapper.querySelector(".name"),
  musicArtist = wrapper.querySelector(".artiste"),
  progressArea = wrapper.querySelector(".progress_area"),
  progressBar = wrapper.querySelector(".progress_bar .bar"),
  currentTimeEl = wrapper.querySelector(".timer .start"),
  durationEl = wrapper.querySelector(".timer .duration"),
  audioEl = wrapper.querySelector("#audio"),
  btnPlayPause = wrapper.querySelector(".fa-play"),
  prevBtn = wrapper.querySelector(".prev"),
  nextBtn = wrapper.querySelector(".next"),
  repeatBtn = wrapper.querySelector(".controls i"),
  toggleListMusic = wrapper.querySelector(".controls .fa-list-ul"),
  listeMusicContent = wrapper.querySelector(".music_list"),
  closeListMusic = wrapper.querySelector(".music_list .close"),
  listMusic = wrapper.querySelector(".lists");

let musicIndex = 1;
let durationAudio;

window.addEventListener("load", () => {
   loadMusic();
   playingNow();
})

img.addEventListener("click", (e) => {
  wrapper.classList.contains("paused") ? pauseMusic() : playMusic();
});

function loadMusic() {
  img.src = `imgs/${allMusic[musicIndex].img}.jpg`;
  musicName.innerText = allMusic[musicIndex].name;
  musicArtist.innerText = allMusic[musicIndex].artist;
  audioEl.src = `audios/${allMusic[musicIndex].src}.mp3`;
}

loadMusic();

function playMusic() {
  wrapper.classList.add('paused');
  btnPlayPause.className = `fa-solid fa-pause`;
  audioEl.play();
  playingNow();
}

function pauseMusic() {
  wrapper.classList.remove("paused");
  btnPlayPause.className = `fa-solid fa-play`;
  audioEl.pause();
}

btnPlayPause.addEventListener("click", () => {
//   wrapper.classList.toggle("played");
  wrapper.classList.contains("paused") ? pauseMusic() : playMusic();
});

function nextMusic() {
  musicIndex++;
  musicIndex > allMusic.length - 1
    ? (musicIndex = 0)
    : (musicIndex = musicIndex);
//   console.log(musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}

function prevMusic() {
  musicIndex--;
  musicIndex < 0
    ? (musicIndex = allMusic.length - 1)
    : (musicIndex = musicIndex);
//   console.log(musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}

prevBtn.addEventListener("click", prevMusic);
nextBtn.addEventListener("click", nextMusic);

audioEl.addEventListener("timeupdate", (e) => {
  audioEl.addEventListener("loadeddata", () => {
    durationAudio = audioEl.duration;
    let durationAudioMin = Math.floor(durationAudio / 60);
    let durationAudioSec = Math.floor(durationAudio % 60);

    if (durationAudioMin < 10) {
      durationAudioMin = `0${durationAudioMin}`;
    }

    if (durationAudioSec < 10) {
      durationAudioSec = `0${durationAudioSec}`;
    }

    durationEl.innerText = `${durationAudioMin}:${durationAudioSec}`;
  });

  const currentTime = e.target.currentTime;
  let progressBarWidth = (currentTime / durationAudio) * 100;
  progressBar.style.width = progressBarWidth + '%'; 

  let currentTimeMin = Math.floor(currentTime / 60);
  let currentTimeMSec = Math.floor(currentTime % 60);

  if (currentTimeMin < 10) {
    currentTimeMin = `0${currentTimeMin}`;
  }

  if (currentTimeMSec < 10) {
    currentTimeMSec = `0${currentTimeMSec}`;
  }

  currentTimeEl.innerText = `${currentTimeMin}:${currentTimeMSec}`;
});

progressArea.addEventListener('click', e => {
  let positionX = e.offsetX,
  progressAreaWidth = progressArea.clientWidth,
  duration = audioEl.duration;
  audioEl.currentTime = (positionX / progressAreaWidth) * duration;
});

repeatBtn.addEventListener("click", () => {
  let repeatClasses = repeatBtn.className;
  
  if (repeatClasses == "fa-solid fa-repeat") {
    repeatBtn.className = "fa-solid fa-reply";
  }
  
  if (repeatClasses == "fa-solid fa-reply") {
    repeatBtn.className = "fa-solid fa-shuffle";
  }
  
  if (repeatClasses == "fa-solid fa-shuffle") {
    repeatBtn.className = "fa-solid fa-repeat";
  }
})

audioEl.addEventListener('ended', () => {
  console.log(audioEl.currentTime);
  console.log(repeatBtn.className);
  if (repeatBtn.className == "fa-solid fa-repeat") {
    nextMusic();
  } else if (repeatBtn.className == "fa-solid fa-reply") {
    audioEl.currentTime = 0;
    // loadMusic(musicIndex);
    playMusic();
  } else {
    let randomMusic = Math.floor(Math.random() * allMusic.length);
    musicIndex = randomMusic;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
  }
})

toggleListMusic.addEventListener("click", () => {
  listeMusicContent.classList.add("show");
});
closeListMusic.addEventListener("click", () => {
  listeMusicContent.classList.remove("show");
});;

allMusic.forEach((item, index) => {
  // console.log(item.src);
  let tagLiEl = `<li class="list" id=${index} onclick="clickedLi(this)">
                   <div class="content_list">
                      <div class="name_list">${item.name}</div>
                      <div class="artist_list">${item.artist}</div>
                   </div>
                   <div class="time_list">
                   <audio src="audios/${item.src}.mp3" class="${item.src}"></audio>
                    <span id=${item.src} class="span_duration"></span>
                   </div>
                </li>`;
  listMusic.insertAdjacentHTML("Beforeend", tagLiEl);

   const audioTag = listMusic.querySelector(`.${item.src}`);
   const spanTimeEl = listMusic.querySelector(`#${item.src}`);

   audioTag.addEventListener("loadeddata", () => {
      durationAudio = audioTag.duration;
      let durationAudioMin = Math.floor(durationAudio / 60);
      let durationAudioSec = Math.floor(durationAudio % 60);

      if (durationAudioMin < 10) {
        durationAudioMin = `0${durationAudioMin}`;
      }
      
      if (durationAudioSec < 10) {
        durationAudioSec = `0${durationAudioSec}`;
      }

      spanTimeEl.innerText = `${durationAudioMin}:${durationAudioSec}`;
      spanTimeEl.setAttribute(
        "t_duration",
        `${durationAudioMin}:${durationAudioSec}`
      );
    })
})

let allLiEl = listMusic.querySelectorAll('.list');
function playingNow() {
  allLiEl.forEach((liEl) => {
    let getdurationAudio = liEl.querySelector(".span_duration");
    // console.log(getdurationAudio);
    // console.log(liEl.id+" => "+musicIndex);
    if (liEl.id == musicIndex) {
      liEl.classList.add("playing");
      getdurationAudio.innerText = "Playing...";
    } else {
      liEl.classList.remove("playing");
      getdurationAudio.innerText = getdurationAudio.getAttribute("t_duration");
    }
  });
}

function clickedLi(element) {
  element.id == musicIndex
  musicIndex = element.id;
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}