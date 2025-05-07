<template>
  <main>
    <h1>Welcome to Trovent Notes</h1>
    <NoteForm @note-added="loadNotes" />
    <NoteList :notes="notes" @note-deleted="loadNotes" />

  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import NoteForm from '../components/NoteForm.vue'
import NoteList from '../components/NoteList.vue'

const notes = ref([])

async function loadNotes() {
  try {
    const res = await fetch('http://localhost:8000/notes')
    notes.value = await res.json()
  } catch (err) {
    console.error('Failed to load notes:', err)
  }
}

onMounted(() => {
  loadNotes()
})
</script>
