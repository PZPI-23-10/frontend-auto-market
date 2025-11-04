<template>
  <div class="photo-uploader">
    <div class="upload-area">
      <label 
        for="file-input" 
        class="upload-label"
        :class="{ 'is-dragging': isDragging }"
        @dragover.prevent="onDragOver"
        @dragleave.prevent="onDragLeave"
        @drop.prevent="onDrop"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
        <span>Натисніть або перетягніть фото (до {{ maxFiles }} шт.)</span>
      </label>
      <input 
        id="file-input"
        type="file" 
        multiple 
        accept="image/*" 
        @change="handleFileChange"
        ref="fileInput"
      />
    </div>
    
    <div v-if="imagePreviews.length > 0" class="previews-grid">
      <div 
        v-for="(preview, index) in imagePreviews" 
        :key="index" 
        class="preview-item"
      >
        <img :src="preview" alt="preview" @click="openModal(preview)" /> <button type="button" class="delete-btn" @click="removeImage(index)">
          &times;
        </button>
      </div>
    </div>

    <div v-if="isModalOpen" class="image-modal-overlay" @click="closeModal">
      <div class="image-modal-content" @click.stop> <button class="modal-close-btn" @click="closeModal">&times;</button>
        <img :src="currentImage" alt="Повноекранне зображення" class="modal-image" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast();

const props = defineProps({
  maxFiles: {
    type: Number,
    default: 5
  }
});
const emit = defineEmits(['files-updated']);

const fileInput = ref(null);
const selectedFiles = ref([]); 
const imagePreviews = ref([]); 
const isDragging = ref(false);

// --- НОВИЙ СТАН ДЛЯ МОДАЛЬНОГО ВІКНА ---
const isModalOpen = ref(false);
const currentImage = ref(''); // URL зображення, яке зараз у модальному вікні

// --- НОВІ МЕТОДИ ДЛЯ МОДАЛЬНОГО ВІКНА ---
function openModal(imageSrc) {
  currentImage.value = imageSrc;
  isModalOpen.value = true;
  document.body.style.overflow = 'hidden'; // Заборонити скролл сторінки під модаллю
}

function closeModal() {
  isModalOpen.value = false;
  currentImage.value = '';
  document.body.style.overflow = ''; // Дозволити скролл сторінки
}
// ---

function onDragOver() {
  isDragging.value = true;
}
function onDragLeave() {
  isDragging.value = false;
}
function onDrop(event) {
  isDragging.value = false;
  const files = Array.from(event.dataTransfer.files);
  processFiles(files);
}

function handleFileChange(event) {
  const files = Array.from(event.target.files);
  processFiles(files);
  
  if (fileInput.value) {
    fileInput.value.value = null;
  }
}

function processFiles(files) {
  if (!files) return;

  for (const file of files) {
    if (selectedFiles.value.length >= props.maxFiles) {
      toast.warning(`Можна завантажити максимум ${props.maxFiles} фото.`);
      break;
    }
    if (!file.type.startsWith('image/')) {
      toast.warning('Можна обирати лише зображення.');
      continue;
    }
    
    selectedFiles.value.push(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreviews.value.push(e.target.result);
    };
    reader.readAsDataURL(file);
  }
  
  emit('files-updated', selectedFiles.value);
}

function removeImage(index) {
  selectedFiles.value.splice(index, 1);
  imagePreviews.value.splice(index, 1);
  emit('files-updated', selectedFiles.value);
}
</script>

<style scoped>
/* (Стилі .upload-label, .previews-grid, .delete-btn - без змін) */

.upload-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 150px;
  border-radius: 6px;
  background-color: rgba(255,255,255,0.1); 
  border: 2px dashed #555;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
}
.upload-label.is-dragging {
  border-color: #ffd700;
  background-color: rgba(255, 215, 0, 0.1);
}
.upload-label:hover {
  border-color: #ffd700;
  background-color: rgba(255,255,255,0.15);
}
.upload-label svg {
  width: 40px;
  height: 40px;
  margin-bottom: 10px;
  stroke: #ffd700;
  pointer-events: none; 
}
.upload-label span {
  font-weight: 500;
  text-align: center;
  pointer-events: none; 
  max-width: 100%; 
  box-sizing: border-box;
}
#file-input {
  display: none;
}
.previews-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 15px;
  margin-top: 20px;
}
.preview-item {
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #555;
}
.preview-item img {
  width: 100%;
  height: 100px;
  object-fit: cover;
  display: block;
  cursor: zoom-in;
}
.delete-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  line-height: 1;
}
.delete-btn:hover {
  background: #cc0000;
}

/* ---
 * ОНОВЛЕНІ СТИЛІ МОДАЛЬНОГО ВІКНА
 --- */
.image-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  
  /* --- 1. ВИПРАВЛЕННЯ (Додаємо скролл) --- */
  overflow-y: auto;
  /* Додаємо відступи зверху/знизу на випадок скролу */
  padding: 40px 0; 
  box-sizing: border-box;
}

.image-modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90vh; /* Використовуємо 'vh' для гнучкості */
  display: flex;
  justify-content: center;
  align-items: center;
  
  /* Стилі "скла" */
  background-color: rgba(30, 30, 30, 0.7);
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 40px rgba(8,7,16,0.6);
  
  /* --- 2. ВИПРАВЛЕННЯ (Переносимо відступ сюди) --- */
  padding: 20px;
  box-sizing: border-box;
  
  /* Це запобігає "стрибку" вікна при появі скролу */
  margin: auto 0; 
}

.modal-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  display: block;
  /* padding: 20px; (ВИДАЛЕНО ЗВІДСИ) */
}

.modal-close-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background: #070101;  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 28px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
  z-index: 10001;
}

.modal-close-btn:hover {
  background: #5f0707;
}
</style>