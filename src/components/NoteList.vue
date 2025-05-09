<template>
    <div>
      <h2>Notes</h2>
  
      <ul v-if="notes.length">
        <li v-for="note in notes" :key="note.id" style="margin-bottom: 1rem; display: flex; align-items: center; gap: 1rem;">
  
          <!-- Display icon if available -->
          <component
            v-if="note.icon && iconMap[note.icon]"
            :is="iconMap[note.icon]"
            size="20"
          />
  
          <div>
            <strong>{{ note.title }}</strong><br />
            {{ note.content }}<br />
  
            <!-- Edit and delete buttons -->
            <button @click="$emit('edit-note', note)">Edit</button>
            <button @click="deleteNote(note.id)">Delete</button>
          </div>
        </li>
      </ul>
  
      <!-- No notes fallback -->
      <p v-else>No notes found.</p>
    </div>
  </template>
  
  <script setup>
  import { Pencil, Book, ShoppingCart, Pin, Rocket } from 'lucide-vue-next'
  
  // Icon component map
  const iconMap = { Pencil, Book, ShoppingCart, Pin, Rocket }
  
  // Props from parent
  const props = defineProps({
    notes: Array
  })
  
  // Emits events for delete and edit
  const emit = defineEmits(['note-deleted', 'edit-note'])
  
  // Delete a note by ID and inform parent
  async function deleteNote(id) {
    if (!confirm('Are you sure you want to delete this note?')) return
    try {
      const res = await fetch(`http://localhost:8000/notes/${id}`, {
        method: 'DELETE'
      })
      if (!res.ok) throw new Error('Failed to delete')
      emit('note-deleted')
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }
  </script>
  