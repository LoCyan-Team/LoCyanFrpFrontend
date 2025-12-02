<template>
  <n-el class="image-marker">
    <img :src="'data:image/jpeg;base64,' + smallImageSrc" alt="Small Preview" />

    <div ref="container" class="image-container">
      <img
        ref="image"
        :src="'data:image/jpeg;base64,' + bigImageSrc"
        alt="点击图片标记位置"
        @click="handleImageClick"
      />
      <div
        v-for="(marker, index) in markers"
        :key="index"
        class="marker"
        :style="{
          left: `${marker.x}px`,
          top: `${marker.y}px`,
          backgroundColor: markerColors[index % markerColors.length],
        }"
      >
        {{ index + 1 }}
      </div>
    </div>
  </n-el>
</template>

<script setup lang="ts">
// 定义标记点的接口
interface Marker {
  x: number;
  y: number;
}

// 定义 Props 接口
interface Props {
  smallImageSrc: string;
  bigImageSrc: string;
  maxMarkers?: number;
}

const props = withDefaults(defineProps<Props>(), {
  maxMarkers: 4,
});

const emit = defineEmits<{
  (e: "update:markers", markers: Marker[]): void;
}>();

// Refs 类型定义
const container = ref<HTMLDivElement | null>(null);
const image = ref<HTMLImageElement | null>(null);
const markers = ref<Marker[]>([]);

const markerColors: string[] = ["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"];

// 监听大图变化，重置标记
watch(
  () => props.bigImageSrc,
  () => {
    markers.value = [];
  },
);

const handleImageClick = (event: MouseEvent) => {
  // 确保图片元素存在
  if (!image.value) return;

  const rect = image.value.getBoundingClientRect();

  const scaleX = image.value.naturalWidth / rect.width;
  const scaleY = image.value.naturalHeight / rect.height;

  const x = Math.round((event.clientX - rect.left) * scaleX);
  const y = Math.round((event.clientY - rect.top) * scaleY);

  if (markers.value.length < props.maxMarkers) {
    markers.value.push({ x, y });
  }

  // 当达到指定数量时触发更新
  if (markers.value.length === props.maxMarkers) {
    emit("update:markers", markers.value);
  }
};
</script>

<style scoped>
.image-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.image-container {
  position: relative;
  display: inline-block;
}

.image-container img {
  cursor: crosshair;
  max-width: 100%;
  height: auto;
}

.marker {
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 12px;
  border: 2px solid white;
  user-select: none;
}
</style>
