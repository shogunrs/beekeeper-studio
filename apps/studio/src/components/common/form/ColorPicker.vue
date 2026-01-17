<template>
  <div class="modern-color-picker">
    <div 
      v-for="color in colors"
      :key="color"
      :class="['color-option', getColorClass(color), { active: color === (value || 'default') }]"
      @click="$emit('input', color)"
      :title="color"
    >
      <span class="check-icon" v-if="color === (value || 'default')">✓</span>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['value'],
    data: function() {
      return {
        colors: [
          'default',
          'red',
          'orange',
          'yellow',
          'green',
          'cyan',
          'blue',
          'purple',
          'pink',
        ]
      };
    },
    methods: {
      getColorClass: function(color) {
        const suffix = color ? color : 'default';
        return `color-${suffix}`;
      }
    }
  }
</script>

<style lang="scss" scoped>
.modern-color-picker {
  display: flex;
  gap: 6px;
  padding: 4px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.color-option {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;
  position: relative;
  
  &:hover {
    transform: scale(1.15);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
  
  &.active {
    border-color: white;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
  }
  
  .check-icon {
    color: white;
    font-size: 12px;
    font-weight: bold;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  }
}

// Color definitions
.color-default {
  background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
}

.color-red {
  background: linear-gradient(135deg, #fc8181 0%, #e53e3e 100%);
}

.color-orange {
  background: linear-gradient(135deg, #fbd38d 0%, #ed8936 100%);
}

.color-yellow {
  background: linear-gradient(135deg, #faf089 0%, #ecc94b 100%);
}

.color-green {
  background: linear-gradient(135deg, #68d391 0%, #38a169 100%);
}

.color-cyan {
  background: linear-gradient(135deg, #76e4f7 0%, #00bcd4 100%);
}

.color-blue {
  background: linear-gradient(135deg, #63b3ed 0%, #3182ce 100%);
}

.color-purple {
  background: linear-gradient(135deg, #b794f4 0%, #805ad5 100%);
}

.color-pink {
  background: linear-gradient(135deg, #fbb6ce 0%, #d53f8c 100%);
}
</style>
