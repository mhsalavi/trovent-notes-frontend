<template>
    <div>
      <h2>Notes</h2>
  
      <ul v-if="notes.length">
        <li v-for="note in notes" :key="note.id" style="margin-bottom: 1rem; display: flex; align-items: center;">
          
          <!-- Icon (if available) -->
          <component
            v-if="note.icon && iconMap[note.icon]"
            :is="iconMap[note.icon]"
            size="20"
            style="margin-right: 8px;"
          />
  
          <div>
            <strong>{{ note.title }}</strong><br />
            {{ note.content }}<br />
            <button @click="deleteNote(note.id)">Delete</button>
          </div>
        </li>
      </ul>
  
      <p v-else>No notes found.</p>
    </div>
  </template>
  
  <script setup>
  import {
    Pencil,
    Book,
    ShoppingCart,
    Pin,
    Rocket
  } from 'lucide-vue-next'
  
  // Map icon names to components
  const iconMap = {
    Pencil,
    Book,
    ShoppingCart,
    Pin,
    Rocket
  }
  
  // Props from parent
  const props = defineProps({
    notes: {
      type: Array,
      required: true
    }
  })
  
  // Emit deletion event
  const emit = defineEmits(['note-deleted'])
  
  // Delete request handler
  async function deleteNote(id) {
    try {
      const res = await fetch(`http://localhost:8000/notes/${id}`, {
        method: 'DELETE'
      })
  
      if (!res.ok) throw new Error('Failed to delete note')
  
      emit('note-deleted')
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }
  </script>
  