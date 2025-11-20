<template>
  <div class="photo-uploader">
    
    <div 
      class="upload-area"
      :class="{ 'is-dragging': isDragging }"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDropFile"
      @click="triggerFileInput"
    >
      <input 
        type="file" 
        ref="fileInput" 
        multiple 
        accept="image/*" 
        @change="handleFileChange" 
        style="display: none;"
      >
      <div class="upload-placeholder">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        <p>{{ t('uploader.label', { count: maxFiles }) }}</p>
        <small>{{ photoList.length }} / {{ maxFiles }}</small>
      </div>
    </div>

    <transition-group name="photo-list" tag="div" class="photo-list" v-if="photoList.length > 0">
      <div 
        v-for="(photo, index) in photoList" 
        :key="photo.uid"
        class="photo-item"
        draggable="true"
        @dragstart="onSortStart($event, index)"
        @drop="onSortDrop($event, index)"
        @dragover.prevent
        @dragenter.prevent
      >
        <img :src="photo.url" :alt="`Photo ${index}`" @click="openModal(photo.url)">
        
        <button 
          type="button" 
          class="remove-btn" 
          @click.stop="removePhoto(index)"
        >
          &times;
        </button>
        
        <div class="photo-badges">
          <span v-if="index === 0" class="badge-main">Main</span>
          <span v-if="photo.isNew" class="badge-new">New</span>
        </div>
      </div>
    </transition-group>

    <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
      <div class="modal-content">
        <img :src="currentImage" alt="Full size">
        <button class="close-modal" @click="closeModal">&times;</button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';

const toast = useToast();
const { t } = useI18n();

const props = defineProps({
  maxFiles: { type: Number, default: 10 },
  initialFiles: { type: Array, default: () => [] } // [{ url: '...', id: 123, ... }]
});

const emit = defineEmits(['files-updated', 'remove-existing']);

// ЕДИНЫЙ СПИСОК ФОТО (и старых, и новых)
const photoList = ref([]); 
const fileInput = ref(null);
const isDragging = ref(false);
const isModalOpen = ref(false);
const currentImage = ref('');

// Константы
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// Генератор уникальных ключей для v-for (чтобы Vue не путался при сортировке)
let uidCounter = 0;
const generateUid = () => `img-${Date.now()}-${uidCounter++}`;

// --- 1. ИНИЦИАЛИЗАЦИЯ ---
watch(() => props.initialFiles, (newFiles) => {
  // Заполняем список только если он пуст (первая загрузка), 
  // чтобы не перезатирать локальные изменения пользователя
  if (photoList.value.length === 0 && newFiles && newFiles.length > 0) {
    photoList.value = newFiles.map(f => ({
      uid: generateUid(),
      id: f.id,       // ID из базы данных (int)
      url: f.url,     // Ссылка
      file: null,     // Файла нет, это ссылка
      isExisting: true,
      isNew: false
    }));
    emitUpdate();
  }
}, { immediate: true });

// --- 2. ЗАГРУЗКА ФАЙЛОВ ---
function triggerFileInput() {
  fileInput.value.click();
}

function onDragOver() { isDragging.value = true; }
function onDragLeave() { isDragging.value = false; }

function onDropFile(event) {
  isDragging.value = false;
  const files = Array.from(event.dataTransfer.files || []);
  processFiles(files);
}

function handleFileChange(event) {
  const files = Array.from(event.target.files || []);
  processFiles(files);
  event.target.value = ''; // Сброс инпута
}

function processFiles(files) {
  if (!files.length) return;

  let addedCount = 0;

  for (const file of files) {
    // Валидация
    if (photoList.value.length >= props.maxFiles) {
      toast.warning(t('uploader.maxFilesWarning', { count: props.maxFiles }));
      break;
    }
    if (!file.type.startsWith('image/')) {
      toast.warning(t('uploader.imageOnlyWarning'));
      continue;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.warning(t('uploader.fileSizeWarning', { name: file.name, size: MAX_FILE_SIZE_MB }));
      continue;
    }

    // Добавление в общий список
    photoList.value.push({
      uid: generateUid(),
      id: null,            // ID нет, это новый файл
      url: URL.createObjectURL(file), // Превью
      file: file,          // Сам файл для отправки
      isExisting: false,
      isNew: true
    });
    addedCount++;
  }

  if (addedCount > 0) {
    emitUpdate();
  }
}

// --- 3. УДАЛЕНИЕ ---
function removePhoto(index) {
  const photo = photoList.value[index];

  // Если это существующее фото, сообщаем родителю ID для удаления из базы
  if (photo.isExisting) {
    emit('remove-existing', photo.id);
  } 
  // Если новое - чистим память превью
  else if (photo.url) {
    URL.revokeObjectURL(photo.url);
  }

  photoList.value.splice(index, 1);
  emitUpdate();
}

// --- 4. СОРТИРОВКА (Drag & Drop внутри списка) ---
let draggedItemIndex = null;

function onSortStart(event, index) {
  draggedItemIndex = index;
  event.dataTransfer.effectAllowed = 'move';
  // Небольшой хак, чтобы скрыть "призрака" элемента при перетаскивании (опционально)
  // event.dataTransfer.setDragImage(new Image(), 0, 0);
}

function onSortDrop(event, targetIndex) {
  // Перемещаем элемент в массиве
  const itemToMove = photoList.value[draggedItemIndex];
  photoList.value.splice(draggedItemIndex, 1); // Удалить со старого места
  photoList.value.splice(targetIndex, 0, itemToMove); // Вставить на новое
  
  draggedItemIndex = null;
  emitUpdate();
}

// --- 5. ОТПРАВКА ДАННЫХ РОДИТЕЛЮ ---
function emitUpdate() {
  // Отправляем ВЕСЬ список в том порядке, в котором он сейчас на экране.
  // Родитель (getFormData) сам разберется, где File, а где ID.
  emit('files-updated', photoList.value);
}

// --- 6. УТИЛИТЫ ---
function openModal(src) {
  currentImage.value = src;
  isModalOpen.value = true;
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  isModalOpen.value = false;
  document.body.style.overflow = '';
}

// Очистка памяти при уходе со страницы
onBeforeUnmount(() => {
  photoList.value.forEach(p => {
    if (p.isNew && p.url) URL.revokeObjectURL(p.url);
  });
});
</script>

<style scoped>
.photo-uploader {
  width: 100%;
}

/* Зона загрузки */
.upload-area {
  border: 2px dashed #555;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.02);
  color: #ccc;
  margin-bottom: 20px;
}

.upload-area:hover, .upload-area.is-dragging {
  border-color: #cc0000;
  background: rgba(204, 0, 0, 0.05);
  color: #fff;
}

.upload-placeholder svg {
  margin-bottom: 10px;
  color: #888;
}

/* Сетка фото */
.photo-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 15px;
}

/* Анимация списка */
.photo-list-move {
  transition: transform 0.4s;
}

.photo-item {
  position: relative;
  aspect-ratio: 1; /* Квадрат */
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #444;
  cursor: grab;
  background: #000;
}

.photo-item:active {
  cursor: grabbing;
}

.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.2s;
}

.photo-item:hover img {
  opacity: 0.8;
}

/* Кнопка удаления */
.remove-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  line-height: 1;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.remove-btn:hover {
  background: #cc0000;
}

/* Бейджи */
.photo-badges {
  position: absolute;
  bottom: 5px;
  left: 5px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.badge-main, .badge-new {
  font-size: 10px;
  padding: 2px 5px;
  border-radius: 4px;
  font-weight: bold;
  text-transform: uppercase;
}

.badge-main {
  background: #ffd700;
  color: #000;
}

.badge-new {
  background: #cc0000;
  color: #fff;
}

/* Модалка */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content img {
  max-width: 90vw;
  max-height: 90vh;
  border-radius: 4px;
}

.close-modal {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: white;
  font-size: 40px;
  cursor: pointer;
}
</style>