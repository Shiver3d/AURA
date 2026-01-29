<template>
  <div class="password-input-wrapper">
    <div class="password-field">
      <input
        :type="showPassword ? 'text' : 'password'"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder"
        :class="['password-input', { 
          'password-valid': showValidation && isValid,
          'password-invalid': showValidation && !isValid && modelValue.length > 0
        }]"
        @keyup="validatePassword"
        v-bind="$attrs"
      />
      <button 
        type="button"
        class="toggle-visibility"
        @click="showPassword = !showPassword"
        :title="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
      >
        <Icon 
          :icon="showPassword ? 'lucide:eye-off' : 'lucide:eye'" 
          width="20" 
          height="20"
        />
      </button>
    </div>

    <!-- Feedback de requisitos de senha -->
    <div v-if="showValidation && modelValue.length > 0" class="password-feedback">
      <div class="requirement" :class="{ met: validation.hasMinLength }">
        <Icon icon="lucide:check" v-if="validation.hasMinLength" width="14" />
        <Icon icon="lucide:x" v-else width="14" />
        <span>Mínimo 8 caracteres</span>
      </div>
      <div class="requirement" :class="{ met: validation.hasNumber }">
        <Icon icon="lucide:check" v-if="validation.hasNumber" width="14" />
        <Icon icon="lucide:x" v-else width="14" />
        <span>Contém um número</span>
      </div>
      <div class="requirement" :class="{ met: validation.hasSpecial }">
        <Icon icon="lucide:check" v-if="validation.hasSpecial" width="14" />
        <Icon icon="lucide:x" v-else width="14" />
        <span>Contém caractere especial (!@#$%^&*)</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { Icon } from "@iconify/vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "Senha",
  },
  showValidation: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "validation-change"]);

const showPassword = ref(false);

const validation = ref({
  hasMinLength: false,
  hasNumber: false,
  hasSpecial: false,
});

const isValid = computed(() => {
  return validation.value.hasMinLength && 
         validation.value.hasNumber && 
         validation.value.hasSpecial;
});

/**
 * Valida a senha em tempo real
 */
function validatePassword() {
  const pw = props.modelValue;
  
  const minLength = pw.length >= 8;
  const hasNumber = /\d/.test(pw);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pw);
  
  validation.value = {
    hasMinLength: minLength,
    hasNumber: hasNumber,
    hasSpecial: hasSpecial,
  };
  
  // Emitir status de validação para o pai
  emit("validation-change", isValid.value);
}
</script>

<style scoped lang="scss">
.password-input-wrapper {
  width: 100%;
}

.password-field {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.password-input {
  width: 100%;
  padding: 12px 40px 12px 12px;
  border-radius: 8px;
  border: 2px solid var(--glass-border);
  background: var(--panel-bg);
  color: var(--text);
  font-family: inherit;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: var(--muted);
  }

  &:focus {
    outline: none;
    border-color: var(--color-sky);
    box-shadow: 0 0 12px rgba(46, 163, 255, 0.2);
    background: rgba(255, 255, 255, 0.5);
  }

  &.password-valid {
    border-color: #27ae60 !important;
    background: rgba(39, 174, 96, 0.05) !important;
  }

  &.password-invalid {
    border-color: #e74c3c !important;
    background: rgba(231, 76, 60, 0.05) !important;
  }
}

.toggle-visibility {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: var(--muted);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;
  border-radius: 4px;

  &:hover {
    color: var(--color-sky);
  }

  &:focus {
    outline: 2px solid var(--color-sky);
    outline-offset: 2px;
  }
}

.password-feedback {
  margin-top: 8px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.85rem;
}

.requirement {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--muted);
  transition: color 0.2s ease;

  svg {
    flex-shrink: 0;
  }

  &.met {
    color: #27ae60;
    font-weight: 500;
  }
}
</style>
