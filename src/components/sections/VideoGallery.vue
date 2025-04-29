<template>
  <div class="video-gallery">
    <h3 class="gallery-title">Galería de Videos</h3>
    <div class="video-grid">
      <div 
        v-for="(video, index) in videos" 
        :key="index" 
        class="video-item"
        @click="openVideo(index)"
        @mouseenter="startPreview(index)"
        @mouseleave="stopPreview(index)"
      >
        <video 
          :ref="el => { if (el) videoRefs[index] = el }"
          :src="video.src" 
          class="video-thumbnail"
          muted
          loop
          playsinline
        ></video>
        <div class="video-overlay">
          <div class="play-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
              <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/>
            </svg>
          </div>
          <h4 class="video-title">{{ video.title }}</h4>
        </div>
      </div>
    </div>

    <!-- Video Popup -->
    <div v-if="selectedVideo !== null" class="video-popup" @click="closeVideo">
      <div class="popup-content" @click.stop>
        <button class="close-button" @click="closeVideo">&times;</button>
        <video 
          :src="videos[selectedVideo].src" 
          controls
          autoplay
          class="popup-video"
        ></video>
        <h3 class="popup-title">{{ videos[selectedVideo].title }}</h3>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Construccion0 from '../../assets/videos/Construccion0.mp4';
import Construccion1 from '../../assets/videos/Construccion1.mp4';
import Construccion2 from '../../assets/videos/Construccion2.mp4';

const videos = [
  { src: Construccion0, title: 'Proyecto de Demolición 1' },
  { src: Construccion1, title: 'Proyecto de Demolición 2' },
  { src: Construccion2, title: 'Proyecto de Demolición 3' }
];

const selectedVideo = ref(null);
const videoRefs = ref([]);

const startPreview = (index) => {
  if (videoRefs.value[index]) {
    videoRefs.value[index].play();
  }
};

const stopPreview = (index) => {
  if (videoRefs.value[index]) {
    videoRefs.value[index].pause();
    videoRefs.value[index].currentTime = 0;
  }
};

const openVideo = (index) => {
  selectedVideo.value = index;
  document.body.style.overflow = 'hidden';
};

const closeVideo = () => {
  selectedVideo.value = null;
  document.body.style.overflow = '';
};
</script>

<style scoped>
.video-gallery {
  padding: 2rem 0;
  margin-top: 2rem;
}

.gallery-title {
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  color: #111;
  position: relative;
  padding-bottom: 1rem;
}

.gallery-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background-color: #ffc107;
}

.gallery-subtitle {
  text-align: center;
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 3rem;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.video-item {
  position: relative;
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  aspect-ratio: 16/9;
}

.video-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
}

.video-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.video-item:hover .video-thumbnail {
  transform: scale(1.05);
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.video-item:hover .video-overlay {
  opacity: 1;
}

.play-button {
  width: 70px;
  height: 70px;
  background-color: rgba(255, 193, 7, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  transform: scale(0.8);
  transition: all 0.3s ease;
}

.video-item:hover .play-button {
  transform: scale(1);
}

.play-button svg {
  width: 30px;
  height: 30px;
  fill: #000;
}

.video-title {
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  text-align: center;
  margin: 0;
  padding: 0 1rem;
  transform: translateY(20px);
  transition: transform 0.3s ease;
}

.video-item:hover .video-title {
  transform: translateY(0);
}

.video-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.popup-content {
  position: relative;
  width: 90%;
  max-width: 1000px;
  background-color: #000;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  font-size: 2rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1;
  transition: all 0.3s ease;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.popup-video {
  width: 100%;
  height: auto;
  max-height: 80vh;
}

.popup-title {
  color: white;
  font-size: 1.5rem;
  text-align: center;
  padding: 1.5rem;
  margin: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
}

@media (max-width: 1024px) {
  .video-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .video-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 0 1rem;
  }
  
  .gallery-title {
    font-size: 2rem;
  }
  
  .gallery-subtitle {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
  
  .video-item {
    aspect-ratio: 16/9;
  }
  
  .play-button {
    width: 60px;
    height: 60px;
  }
  
  .video-title {
    font-size: 1.1rem;
  }
}
</style> 