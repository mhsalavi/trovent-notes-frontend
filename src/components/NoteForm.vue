<template>
    <form @submit.prevent="handleSubmit">
      <h2>{{ isEditing ? 'Edit Note' : 'Add a New Note' }}</h2>
  
      <!-- Required fields -->
      <label>Title *</label>
      <input v-model="title" required minlength="3" maxlength="100"/>
  
      <label>Content *</label>
      <textarea v-model="content" required minlength="5" maxlength="100"></textarea>
  
      <!-- Optional fields -->
      <label>Category</label>
      <input v-model="category" placeholder="e.g., personal" />
  
      <label>Icon</label>
      <select v-model="icon">
        <option value="">None</option>
        <option v-for="iconName in availableIcons" :key="iconName" :value="iconName">
          {{ iconName }}
        </option>
      </select>
  
      <label>Due Date</label>
      <input v-model="duedate" type="date" required/>
  
      <!-- Submit button changes based on mode -->
      <button type="submit">{{ isEditing ? 'Update Note' : 'Add Note' }}</button>
      <!-- Cancel editing -->
      <button v-if="isEditing" type="button" @click="cancelEdit" style="margin-top: 0.5rem; background-color: #aaa;">
        Cancel
      </button>
    </form>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  import { Pencil, Book, ShoppingCart, Pin, Rocket } from 'lucide-vue-next'
  
  // Props: optional note to edit
  const props = defineProps({
    modelValue: Object
  })
  
  const emit = defineEmits(['note-added' , 'cancel-edit'])
  const availableIcons = ['Pencil', 'Book', 'ShoppingCart', 'Pin', 'Rocket']
  
  // Form state
  const title = ref('')
  const content = ref('')
  const category = ref('')
  const icon = ref('')
  const duedate = ref('')
  const isEditing = ref(false)
  const noteId = ref(null)
  
  // Watch for changes to modelValue and populate form
  watch(() => props.modelValue, (newVal) => {
    if (newVal) {
      title.value = newVal.title
      content.value = newVal.content
      category.value = newVal.category || ''
      icon.value = newVal.icon || ''
      duedate.value = newVal.duedate || ''
      isEditing.value = true
      noteId.value = newVal.id
    }
  })
  
  // Reset form fields to default
  function resetForm() {
    title.value = ''
    content.value = ''
    category.value = ''
    icon.value = ''
    duedate.value = ''
    isEditing.value = false
    noteId.value = null
  }
  
// Submit: either create or update a note
async function handleSubmit() {
  // Basic security keyword filter
  const suspiciousPattern = /(drop|delete|insert|script|<|>)/i

  if (
    suspiciousPattern.test(title.value) ||
    suspiciousPattern.test(content.value) ||
    suspiciousPattern.test(category.value)
  ) {
    alert('Title, content, or category contains suspicious characters.')
    return
  }

  // Text validation
  if (!/^[\w\s.,!?'"()-]{3,100}$/.test(title.value)) {
    alert('Title must be 3–100 characters and contain only normal characters.')
    return
  }

  if (!/^[\w\s.,!?'"()-]{5,1000}$/.test(content.value)) {
    alert('Content must be 5–1000 characters and clean.')
    return
  }

  // Optional category validation
  if (category.value) {
    if (!/^[\w\s-]{2,30}$/i.test(category.value)) {
      alert('Category should only contain letters, numbers, spaces or dashes.')
      return
    }
  }

  // Due date is required and must be valid
  if (!duedate.value) {
    alert('Please enter a due date.')
    return
  }

  const parsed = new Date(duedate.value)
  if (isNaN(parsed.getTime())) {
    alert('Please enter a valid due date.')
    return
  }

  if (parsed.getFullYear() > 2100) {
    alert('Due date must be before the year 2100.')
    return
  }

  // Construct note payload
  const noteData = {
    title: title.value,
    content: content.value,
    category: category.value || null,
    icon: icon.value || null,
    duedate: duedate.value || null
  }

  try {
    let res
    if (isEditing.value && noteId.value !== null) {
      // PUT request to update
      res = await fetch(`http://localhost:8000/notes/${noteId.value}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData)
      })
    } else {
      // POST request to create
      res = await fetch('http://localhost:8000/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData)
      })
    }

    if (!res.ok) throw new Error('Save failed')

    emit('note-added')
    resetForm()
  } catch (err) {
    console.error('Save error:', err)
  }
}


  function cancelEdit() {
    resetForm()
    emit('cancel-edit') // Tell parent to exit edit mode
  }
  </script>
  
  <style scoped>
  form {
    margin-bottom: 2rem;
    display: flex;
    flex-direction: column;
    max-width: 400px;
  }
  label {
    margin-top: 1rem;
    font-weight: bold;
  }
  input, textarea, select {
    padding: 0.5rem;
    font-size: 1rem;
    margin-top: 0.25rem;
  }
  button {
    margin-top: 1.5rem;
    padding: 0.5rem;
    font-size: 1rem;
    background-color: #4caf50;
    color: white;
    border: none;
    cursor: pointer;
  }
  </style>
  