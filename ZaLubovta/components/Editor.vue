<template>
  <QuillEditor v-model:content="editorContent" :options="editorOptions" :toolbar="toolbar" @blur="onEditorBlur"
    @ready="onEditorReady" contentType="html" />
</template>

<script>
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { ref, watch } from 'vue'

export default {
  name: 'Editor',
  components: {
    QuillEditor
  },
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: 'Start writing...'
    },
    toolbar: {
      type: String,
      default: 'full'
    }
  },
  emits: ['update:modelValue', 'ready', 'blur'],

  setup(props, { emit }) {
    const editorContent = ref(props.modelValue)

    const editorOptions = {
      theme: 'snow',
      placeholder: props.placeholder,
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'], // Basic text formatting
          ['clean'], // Clear formatting
        ],
      }
    }

    watch(() => props.modelValue, (newValue) => {
      if (newValue !== editorContent.value) {
        editorContent.value = newValue
      }
    })

    watch(editorContent, (newValue) => {
      emit('update:modelValue', newValue)
    })

    const onEditorBlur = () => {
      emit('blur', editorContent.value)
    }

    const onEditorReady = (quill) => {
      emit('ready', quill)
    }

    return {
      editorContent,
      editorOptions,
      onEditorBlur,
      onEditorReady
    }
  }
}
</script>

<style scoped>
:deep(.ql-editor) {
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;
}

:deep(.ql-toolbar) {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

:deep(.ql-container) {
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  font-size: 16px;
}
</style>