<template>
    <div>
      <h2>Notes</h2>
      <ul v-if="notes.length">
        <li v-for="note in notes" :key="note.id" style="margin-bottom: 1rem;">
          <strong>{{ note.title }}</strong><br />
          {{ note.content }}<br />
          <button @click="deleteNote(note.id)">Delete</button>
        </li>
      </ul>
      <p v-else>No notes found.</p>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    notes: {
      type: Array,
      required: true
    }
  })
  
  const emit = defineEmits(['note-deleted'])
  
  async function deleteNote(id) {
    try {
      const res = await fetch(`http://localhost:8000/notes/${id}`, {
        method: 'DELETE'
      })
  
      if (!res.ok) throw new Error('Failed to delete note')
  
      emit('note-deleted') // Tell parent to refresh
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }
  </script>
  