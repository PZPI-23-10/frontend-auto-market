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
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0  0  24  24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
        <span>{{ t('uploader.label', { count: maxFiles }) }}</span>
      </label>

      <input
        id="file-input"
        ref="fileInput"
        type="file"
        multiple
        accept="image/*"
        @change="handleFileChange"
        :disabled="allPhotos.length >= maxFiles"
      />
    </div>

    <div v-if="allPhotos.length > 0" class="previews-grid">
      <div v-for="photo in allPhotos" :key="photo.id" class="preview-item">
        <img
          :src="photo.url || photo.preview"
          :alt="t('uploader.previewAlt')"
          @click="openModal(photo.url || photo.preview)"
        />
        <button type="button" class="delete-btn" @click="removeImage(photo.id, photo.isNew)">
          &times;
        </button>
      </div>
    </div>

    <div v-if="isModalOpen" class="image-modal-overlay" @click="closeModal">
      <div class="image-modal-content" @click.stop>
        <button class="modal-close-btn" @click="closeModal">&times;</button>
        <img :src="currentImage" :alt="t('uploader.modalAlt')" class="modal-image" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';

const toast = useToast();
const { t } = useI18n();

const props = defineProps({
  maxFiles: { type: Number, default: 5 },
  initialFiles: { type: Array, default: () => [] }
});

// Добавляем событие 'remove-existing' для корректного общения с сервером
const emit = defineEmits(['files-updated', 'remove-existing']);

const fileInput = ref(null);
const existingPhotos = ref([]);
const newFiles = ref([]);
const isDragging = ref(false);

const isModalOpen = ref(false);
const currentImage = ref('');
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// ИСПРАВЛЕНИЕ 1: Более надежная генерация ID
// Использование счетчика гарантирует уникальность даже в быстрых циклах
let uniqueIdCounter = 0;
const uid = () => `photo-${Date.now()}-${Math.floor(Math.random() * 10000)}-${uniqueIdCounter++}`;

const allPhotos = computed(() => {
  return [...existingPhotos.value, ...newFiles.value];
});

// Watcher для initialFiles
watch(
  () => props.initialFiles,
  (newInitial) => {
    if (newInitial && newInitial.length > 0) {
      existingPhotos.value = newInitial.map((file) => ({
        id: file.id || uid(), // Если ID нет, создаем стабильный
        url: file.url,
        isNew: false,
        isExisting: true
      }));
    } else {
      existingPhotos.value = [];
    }
  },
  { deep: true, immediate: true }
);

function openModal(imageSrc) {
  currentImage.value = imageSrc;
  isModalOpen.value = true;
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  isModalOpen.value = false;
  currentImage.value = '';
  document.body.style.overflow = '';
}

// Drag & Drop
function onDragOver() { isDragging.value = true; }
function onDragLeave() { isDragging.value = false; }
function onDrop(event) {
  isDragging.value = false;
  const files = Array.from(event.dataTransfer.files || []);
  processFiles(files);
}

function handleFileChange(evt) {
  const files = Array.from(evt.target.files || []);
  processFiles(files);
  if (fileInput.value) fileInput.value.value = null;
}

function processFiles(files) {
  if (!files || files.length === 0) return;

  for (const file of files) {
    if (allPhotos.value.length >= props.maxFiles) {
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

    const fileObject = {
      id: uid(),
      file,
      preview: URL.createObjectURL(file),
      isNew: true,
      isExisting: false
    };

    newFiles.value.push(fileObject);
    emitNewFiles();
  }
}

/**
 * ИСПРАВЛЕНИЕ 2: Логика удаления
 */
function removeImage(id, isNew) {
  if (isNew) {
    // Логика для НОВЫХ файлов (которые еще не загружены на сервер)
    const target = newFiles.value.find(f => f.id === id);
    if (target && target.preview) URL.revokeObjectURL(target.preview);

    newFiles.value = newFiles.value.filter(f => f.id !== id);
    
    // Обновляем список файлов для загрузки
    emitNewFiles();
  } else {
    // Логика для СУЩЕСТВУЮЩИХ файлов (с сервера)
    existingPhotos.value = existingPhotos.value.filter(f => f.id !== id);

    emit('remove-existing', id);
  }
}

function emitNewFiles() {
  const filesToUpload = newFiles.value.map(f => f.file);
  emit('files-updated', filesToUpload);
}
</script>

<style scoped>
.upload-label { display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; min-height:150px; border-radius:6px; background-color:rgba(255,255,255,0.1); border:2px dashed #555; color:#fff; cursor:pointer; transition:all 0.3s ease; }
.upload-label.is-dragging { border-color:#ffd700; background-color:rgba(255,215,0,0.1); }
.upload-label:hover { border-color:#ffd700; background-color:rgba(255,255,255,0.15); }
.upload-label svg { width:40px; height:40px; margin-bottom:10px; stroke:#ffd700; pointer-events:none; }
.upload-label span { font-weight:500; text-align:center; pointer-events:none; max-width:100%; box-sizing:border-box; }
#file-input { display:none; }
.previews-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(100px, 1fr)); gap:15px; margin-top:20px; }
.preview-item { position:relative; border-radius:6px; overflow:hidden; border:1px solid #555; }
.preview-item img { width:100%; height:100px; object-fit:cover; display:block; cursor:zoom-in; }
.delete-btn { position:absolute; top:5px; right:5px; width:24px; height:24px; border-radius:50%; background:rgba(0,0,0,0.7); color:white; border:none; font-size:16px; font-weight:bold; cursor:pointer; display:flex; align-items:center; justify-content:center; padding:0; line-height:1; }
.delete-btn:hover { background:#cc0000; }
.image-modal-overlay { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); backdrop-filter:blur(5px); display:flex; align-items:center; justify-content:center; z-index:10000; overflow-y:auto; padding:40px 0; box-sizing:border-box; }
.image-modal-content { position:relative; max-width:90%; max-height:90vh; display:flex; justify-content:center; align-items:center; background-color:rgba(30,30,30,0.7); border-radius:12px; border:2px solid rgba(255,255,255,0.1); box-shadow:0 0 40px rgba(8,7,16,0.6); padding:20px; box-sizing:border-box; margin:auto 0; }
.modal-image { max-width:100%; max-height:100%; object-fit:contain; display:block; }
.modal-close-btn { position:absolute; top:5px; right:5px; background:#070101; color:white; border:none; border-radius:50%; width:40px; height:40px; font-size:28px; line-height:1; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background-color 0.3s; z-index:10001; }
.modal-close-btn:hover { background:#5f0707; }
</style>
