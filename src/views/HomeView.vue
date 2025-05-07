<template>
  <main>
    <h1>Welcome to Trovent Notes</h1>
    
    <!-- Form to create new notes -->
    <NoteForm @note-added="loadNotes" />
    
    <!-- List of existing notes -->
    <NoteList :notes="notes" @note-deleted="loadNotes" />
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import NoteForm from '../components/NoteForm.vue'
import NoteList from '../components/NoteList.vue'

// Reactive list of notes fetched from the API
const notes = ref([])

// Fetch notes from the backend API
async function loadNotes() {
  try {
    const res = await fetch('http://localhost:8000/notes')
    notes.value = await res.json()
  } catch (err) {
    console.error('Failed to load notes:', err)
  }
}

// Load notes on component mount
onMounted(() => {
  loadNotes()
})
</script>
