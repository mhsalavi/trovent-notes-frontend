<template>
    <form @submit.prevent="handleSubmit">
      <!-- Heading dynamically changes between add/edit mode -->
      <h2>{{ isEditing ? 'Edit Note' : 'Add a New Note' }}</h2>
  
      <!-- Title Field (required) -->
      <label>Title *</label>
      <input v-model="title" required minlength="3" maxlength="100"/>
      <p v-if="errors.title" class="text-red-400 text-sm mt-1">{{ errors.title }}</p>
  
      <!-- Content Field (required) -->
      <label>Content *</label>
      <textarea v-model="content" required minlength="5" maxlength="100"></textarea>
      <p v-if="errors.content" class="text-red-400 text-sm mt-1">{{ errors.content }}</p>
  
       <!-- Category Field (optional) -->
      <label>Category</label>
      <input v-model="category" placeholder="e.g., personal" />
      <p v-if="errors.category" class="text-red-400 text-sm mt-1">{{ errors.category }}</p>
  
      <!-- Icon Field (optional dropdown) -->
      <label>Icon</label>
      <select v-model="icon">
        <option value="">None</option>
        <option v-for="iconName in availableIcons" :key="iconName" :value="iconName">
          {{ iconName }}
        </option>
      </select>
  
       <!-- Due Date Field (required) -->
      <label>Due Date *</label>
      <input v-model="duedate" type="date" required/>
      <p v-if="errors.duedate" class="text-red-400 text-sm mt-1">{{ errors.duedate }}</p>
  
      <!-- Submit and Cancel Buttons -->
      <button type="submit">{{ isEditing ? 'Update Note' : 'Add Note' }}</button>
      <button v-if="isEditing" type="button" @click="cancelEdit" style="margin-top: 0.5rem; background-color: #aaa;">
        Cancel
      </button>
    </form>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  import { Pencil, Book, ShoppingCart, Pin, Rocket } from 'lucide-vue-next'
  
  // Props: editable note (passed from parent when editing)
  const props = defineProps({modelValue: Object })
  const emit = defineEmits(['note-added' , 'cancel-edit'])

  // Available icon options for user selection
  const availableIcons = ['Pencil', 'Book', 'ShoppingCart', 'Pin', 'Rocket']
  
 // Reactive fields for the form state
  const title = ref('')
  const content = ref('')
  const category = ref('')
  const icon = ref('')
  const duedate = ref('')
  const isEditing = ref(false)
  const noteId = ref(null)

 // Field-level validation error messages
  const errors = ref({
  title: '',
  content: '',
  category: '',
  duedate: ''
})

  
  // When modelValue changes (i.e. user clicks "Edit"), populate form fields
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
  
  // Reset form state to default/blank values
  function resetForm() {
    title.value = ''
    content.value = ''
    category.value = ''
    icon.value = ''
    duedate.value = ''
    isEditing.value = false
    noteId.value = null
  }
  
 // Submit form (add or update a note)
  async function handleSubmit() {
    // Clear previous errors
    errors.value = { title: '', content: '', category: '', duedate: '' }
    const suspiciousPattern = /(drop|delete|insert|script|<|>)/i
    let hasError = false

     // Validate title
    if (suspiciousPattern.test(title.value)) {
      errors.value.title = 'Title contains suspicious characters.'
      hasError = true
    } else if (!/^[\w\s.,!?'"()-]{3,100}$/.test(title.value)) {
      errors.value.title = 'Title must be 3–100 clean characters.'
      hasError = true
    }

      // Validate content
    if (suspiciousPattern.test(content.value)) {
      errors.value.content = 'Content contains suspicious characters.'
      hasError = true
    } else if (!/^[\w\s.,!?'"()-]{5,1000}$/.test(content.value)) {
      errors.value.content = 'Content must be 5–1000 clean characters.'
      hasError = true
    }
    // Validate category (if filled)
    if (category.value) {
      if (suspiciousPattern.test(category.value)) {
        errors.value.category = 'Category contains suspicious characters.'
        hasError = true
      } else if (!/^[\w\s.,!?'"()-]{5,1000}$/.test(category.value)) {
        errors.value.category = 'Category must be 5–1000 clean characters.'
        hasError = true
      }
    }

    // Validate due date
    if (!duedate.value) {
      errors.value.duedate = 'Due date is required.'
      hasError = true
    } else {
      const parsed = new Date(duedate.value)
      if (isNaN(parsed.getTime())) {
        errors.value.duedate = 'Invalid due date.'
        hasError = true
      } else if (parsed.getFullYear() > 2100) {
        errors.value.duedate = 'Due date must be before 2100.'
        hasError = true
      }
    }

    // Stop if validation failed
    if (hasError) return

    // Build payload
    const noteData = {
      title: title.value,
      content: content.value,
      category: category.value || null,
      icon: icon.value || null,
      duedate: duedate.value || null
    }

    // Send POST or PUT based on editing state
    try {
      const res = await fetch(
        isEditing.value && noteId.value
          ? `http://localhost:8000/notes/${noteId.value}`
          : 'http://localhost:8000/notes',
        {
          method: isEditing.value ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(noteData)
        }
      )
      if (!res.ok) throw new Error('Save failed')

      emit('note-added')
      resetForm()
    } catch (err) {
      console.error('Save error:', err)
      }
  }

  // Cancel editing and reset
  function cancelEdit() {
    resetForm()
    emit('cancel-edit') // Tell parent to exit edit mode
  }
  </script>
  
  