<template>
  <main class="px-4 py-6 sm:px-6 lg:px-8">
    <!-- Page Title -->
    <h1>Trovent Notes</h1>

    <!-- Two-column layout for form and list (responsive) -->
    <div class="notes grid gap-4 sm:grid-cols-1 lg:grid-cols-2 px-4 sm:px-6">
      
      <!-- Note creation/edit form -->
      <div class="notes_note-form">
        <NoteForm 
          :modelValue="noteBeingEdited" 
          @note-added="handleNoteChange"
          @cancel-edit="noteBeingEdited = null" 
        />
      </div>

      <!-- Search, Sort, and Notes List -->
      <div class="notes_search-sort">
        <h2>Notes</h2>

        <!-- Search input -->
        <input v-model="searchTerm" placeholder="Search notes..." />

        <!-- Sort dropdown -->
        <select v-model="sortBy">
          <option disabled value="">Sort By</option>
          <option value="">None</option>
          <option value="title">Title</option>
          <option value="duedate">Due Date</option>
        </select>

        <!-- Notes List with Scroll -->
        <div class="notes_note-list mt-6 max-h-[350px] overflow-y-auto pr-2 custom-scroll">
          <NoteList 
            :notes="filteredNotes" 
            @note-deleted="loadNotes" 
            @edit-note="noteBeingEdited = $event" 
            @view-note="handleViewNote"
          />
        </div>
      </div>

      <!-- Modal: Note Viewer -->
      <div 
        v-if="showModal" 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-[#2E2E2E] text-white p-6 rounded-md w-11/12 md:w-1/2">
          <h3 class="text-xl font-bold mb-2">Title: {{ selectedNote.title }}</h3>
          <p class="mb-2">Content: {{ selectedNote.content }}</p>
          <p class="mb-2">Category: {{ selectedNote.category }}</p>
          <p class="text-sm text-gray-400">Due: {{ selectedNote.duedate }}</p>

          <!-- Close button -->
          <div class="text-right mt-4">
            <button 
              @click="showModal = false" 
              class="px-4 py-1 bg-red-500 rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>

    </div> 
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import NoteForm from '../components/NoteForm.vue'
import NoteList from '../components/NoteList.vue'

// All fetched notes
const notes = ref([])

// Currently edited note (null means create mode)
const noteBeingEdited = ref(null)

// Search/filter input
const searchTerm = ref('')

// Sort field (title, duedate, or none)
const sortBy = ref('')

// Modal state and selected note for preview
const selectedNote = ref(null)
const showModal = ref(false)

// Show full note info in modal
function handleViewNote(note) {
  selectedNote.value = note
  showModal.value = true
}

// Fetch notes from API on load or after changes
async function loadNotes() {
  try {
    const res = await fetch('http://127.0.0.1:8000/notes')
    notes.value = await res.json()
  } catch (err) {
    console.error('Failed to load notes:', err)
  }
}

// Callback after note add/update: reload notes
function handleNoteChange() {
  noteBeingEdited.value = null
  loadNotes()
}

// Load notes on component mount
onMounted(() => {
  loadNotes()
})

// Computed: filtered and optionally sorted notes
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
