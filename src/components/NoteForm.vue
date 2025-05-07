<template>
    <form @submit.prevent="handleSubmit">
      <h2>Add a New Note</h2>
  
      <label>Title *</label>
      <input v-model="title" required />
  
      <label>Content *</label>
      <textarea v-model="content" required></textarea>
  
      <label>Category</label>
      <input v-model="category" placeholder="e.g., personal" />
  
      <label>Icon</label>
      <input v-model="icon" placeholder="e.g., 📌" />
  
      <label>Due Date</label>
      <input v-model="duedate" type="date" />
  
      <button type="submit">Add Note</button>
    </form>
  </template>



  <script setup>
  import { ref } from 'vue'

  const emit = defineEmits(['note-added'])
  
  const title = ref('')
  const content = ref('')
  const category = ref('')
  const icon = ref('')
  const duedate = ref('')
  
  async function handleSubmit() {
    const newNote = {
      title: title.value,
      content: content.value,
      category: category.value || null,
      icon: icon.value || null,
      duedate: duedate.value || null,
    }
  
    try {
      const res = await fetch('http://localhost:8000/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNote),
      })
  
      if (!res.ok) throw new Error('Failed to create note')
  
      const createdNote = await res.json()
      console.log('Note added:', createdNote)
      emit('note-added')

  
      // Clear the form
      title.value = ''
      content.value = ''
      category.value = ''
      icon.value = ''
      duedate.value = ''
  
      // You can also emit an event here to refresh the notes list
    } catch (error) {
      console.error('Error adding note:', error)
    }
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
  input, textarea {
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
  