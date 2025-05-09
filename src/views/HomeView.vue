<template>
  <main>
    <h1>Welcome to Trovent Notes</h1>

    <!-- Form to create or edit notes -->
    <NoteForm :modelValue="noteBeingEdited" 
    @note-added="handleNoteChange"
    @cancel-edit="noteBeingEdited = null" />

    <!-- Search and Sort Controls -->
    <div style="margin-bottom: 1rem;">
      <input
        v-model="searchTerm"
        placeholder="Search notes..."
        style="padding: 0.5rem; margin-right: 1rem;"
      />
      <select v-model="sortBy" style="padding: 0.5rem;">
        <option value="">Sort By</option>
        <option value="title">Title</option>
        <option value="duedate">Due Date</option>
      </select>
    </div>

    <!-- List of existing notes -->
    <NoteList 
      :notes="filteredNotes" 
      @note-deleted="loadNotes" 
      @edit-note="noteBeingEdited = $event" 
    />
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import NoteForm from '../components/NoteForm.vue'
import NoteList from '../components/NoteList.vue'

// Reactive list of notes fetched from the API
const notes = ref([])

// Selected note for editing
const noteBeingEdited = ref(null)

const searchTerm = ref('')
const sortBy = ref('')

// Load notes from backend
async function loadNotes() {
  try {
    const res = await fetch('http://localhost:8000/notes')
    notes.value = await res.json()
  } catch (err) {
    console.error('Failed to load notes:', err)
  }
}

// After a note is added or edited, refresh list and clear form
function handleNoteChange() {
  noteBeingEdited.value = null
  loadNotes()
}

// Load notes on mount
onMounted(() => {
  loadNotes()
})

// Filter and sort notes
const filteredNotes = computed(() => {
  let filtered = notes.value.filter(note =>
    note.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.value.toLowerCase())
  )

  if (sortBy.value === 'title') {
    filtered.sort((a, b) => a.title.localeCompare(b.title))
  } else if (sortBy.value === 'duedate') {
    filtered.sort((a, b) => new Date(a.duedate) - new Date(b.duedate))
  }

  return filtered
})
</script>
