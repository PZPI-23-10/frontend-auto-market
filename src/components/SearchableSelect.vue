<template>
  <div class="custom-select" :class="{ 'is-disabled': disabled, 'is-open': isOpen }" ref="container">
    <div class="select-trigger" @click.stop="toggleOpen">
      <span v-if="selectedName" class="selected-text">
        {{ formatLabel(selectedName) }}
      </span>
      <span v-else class="placeholder-text">{{ placeholder }}</span>
      <span class="arrow">▼</span>
    </div>

    <div v-show="isOpen" class="dropdown-menu">
      <div class="search-box">
        <input 
          ref="searchInput"
          type="text" 
          v-model="searchQuery" 
          placeholder="Пошук..."
          @click.stop
          @keydown.esc="isOpen = false"
        >
      </div>

      <ul class="options-list">
        <li 
          class="option-item reset-option"
          @click.stop="selectOption(null)" 
          v-if="modelValue"
        >
          {{ t('listings.filter.reset') || '✕ Скинути' }}
        </li>

        <li 
          v-for="option in filteredOptions" 
          :key="option.id" 
          @click.stop="selectOption(option)"
          class="option-item"
          :class="{ selected: option.id === modelValue }"
        >
          {{ formatLabel(option.name) }}
        </li>

        <li v-if="filteredOptions.length === 0" class="no-options">
          Нічого не знайдено
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';

const { t, te } = useI18n();

const props = defineProps({
  modelValue: [String, Number, null],
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: 'Оберіть...' },
  disabled: { type: Boolean, default: false },
  translationScope: { type: String, default: '' }
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const searchQuery = ref('');
const container = ref(null);
const searchInput = ref(null);

const selectedName = computed(() => {
  if (!props.modelValue && props.modelValue !== 0) return '';
  const found = props.options.find(o => o.id === props.modelValue);
  return found ? found.name : '';
});

const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options;
  const query = searchQuery.value.toLowerCase();
  return props.options.filter(opt => {
    const translatedName = formatLabel(opt.name).toLowerCase();
    return translatedName.includes(query);
  });
});

function formatLabel(originalName) {
  if (!originalName) return '';
  if (!props.translationScope) return originalName; 
  const key = originalName.toLowerCase().replace(/\s+/g, '_');
  const fullPath = `${props.translationScope}.${key}`;
  return te(fullPath) ? t(fullPath) : originalName;
}

function toggleOpen() {
  if (props.disabled) return;
  if (isOpen.value) {
    isOpen.value = false;
  } else {
    isOpen.value = true;
    searchQuery.value = '';
    nextTick(() => searchInput.value?.focus());
  }
}

function selectOption(option) {
  emit('update:modelValue', option ? option.id : null);
  isOpen.value = false;
}

function handleClickOutside(e) {
  if (isOpen.value && container.value && !container.value.contains(e.target)) {
    isOpen.value = false;
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside));
onUnmounted(() => document.removeEventListener('click', handleClickOutside));
</script>

<style scoped>
.custom-select {
  position: relative;
  width: 100%;
  font-family: 'Open Sans', sans-serif;
  text-align: left;
  text-transform: none !important; 
}

.select-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 45px;
  padding: 0 12px;
  border-radius: 3px;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid #555;
  cursor: pointer;
  box-sizing: border-box;
  transition: border-color 0.3s;
  user-select: none;
}

.custom-select.is-open .select-trigger {
  border-color: #ffd700;
  box-shadow: 0 0 5px rgba(255, 215, 0, 0.3);
}

.selected-text { 
  color: #fff; 
  font-weight: 400; 
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  text-transform: capitalize !important; /* Робить красиво: Petrol */
}
.placeholder-text { color: #aaa; font-size: 14px; }
.arrow { color: #aaa; font-size: 10px; margin-left: 8px; flex-shrink: 0; transition: transform 0.3s; }
.custom-select.is-open .arrow { transform: rotate(180deg); }

.dropdown-menu {
  position: absolute;
  top: 100%; left: 0; right: 0;
  z-index: 1000;
  background: #222;
  border: 1px solid #555;
  border-top: none;
  border-radius: 0 0 6px 6px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.8);
  margin-top: 2px;
  overflow: hidden;
}

.search-box { padding: 8px; border-bottom: 1px solid #444; background: #2a2a2a; }
.search-box input {
  width: 100%; height: 36px; padding: 0 8px;
  background: #333; border: 1px solid #555;
  color: #fff; border-radius: 4px; outline: none;
  font-size: 14px; box-sizing: border-box;
}
.search-box input:focus { border-color: #ffd700; }

.options-list { list-style: none; padding: 0; margin: 0; max-height: 250px; overflow-y: auto; }

.option-item { 
  padding: 10px 12px; 
  color: #ddd; 
  cursor: pointer; 
  font-size: 14px; 
  transition: background 0.2s; 
  text-align: left; 
  text-transform: capitalize !important; /* Робить красиво в списку */
}
.option-item:hover { background-color: #444; color: #fff; }
.option-item.selected { background-color: #cc0000; color: #fff; }

/* --- НОВИЙ СТИЛЬ ДЛЯ КНОПКИ СКИНУТИ --- */
.reset-option { 
  color: #ff6b6b; /* М'який червоний колір */
  font-size: 13px;
  font-weight: 600;
  background-color: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid #444;
  text-align: center; /* Центруємо текст */
  display: block;
  text-transform: none !important; /* Щоб не робило capitalize для кнопки */
}
.reset-option:hover {
  background-color: #3a1c1c; /* Темно-червоний фон при наведенні */
  color: #ff8888;
}

.no-options { padding: 15px; text-align: center; color: #777; font-size: 13px; }
.is-disabled { opacity: 0.5; pointer-events: none; }

/* Scrollbar */
.options-list::-webkit-scrollbar { width: 6px; }
.options-list::-webkit-scrollbar-track { background: #222; }
.options-list::-webkit-scrollbar-thumb { background: #555; border-radius: 3px; }
</style>