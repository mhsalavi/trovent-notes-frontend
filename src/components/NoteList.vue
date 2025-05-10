<template>
  <div>
      <!-- Display list of notes if any exist -->
    <ul v-if="notes.length">
      <li
        v-for="note in notes"
        :key="note.id"
        class="flex justify-between items-start gap-4 border-b border-gray-700 pb-4 mb-4"
      >
        <!-- Left section: note icon and text -->
        <div class="flex gap-3 note-list-icon">
          <!-- Display icon if it's valid and available in the icon map -->
          <component
            v-if="note.icon && iconMap[note.icon]"
            :is="iconMap[note.icon]"
            size="20"
            class="mt-1"
          />
          <div>
            <strong class="block text-white font-bold">{{ note.title }}</strong>
            <span class="text-sm text-gray-300">{{ note.content }}</span>
          </div>
        </div>

        <!-- Right section: action buttons (view, edit, delete) -->
        <div class="flex gap-2">
          <button
          @click="$emit('view-note', note)">
          <Eye size="20" />
          </button>
          <button
            @click="$emit('edit-note', note)">
          <Edit size="20" />
          </button>
          <button
            @click="deleteNote(note.id)">
          <Trash2 size="20" />
          </button>
        </div>
      </li>
    </ul>

    <!-- Fallback message if no notes are available -->
    <p v-else>No notes found.</p>
  </div>
</template>

  
  <script setup>
  import { Pencil, Book, ShoppingCart, Pin, Rocket, Eye, Edit, Trash2 } from 'lucide-vue-next'
  
  // Map available icon names to their components
  const iconMap = { Pencil, Book, ShoppingCart, Pin, Rocket }
  
  // Props received from the parent component
  const props = defineProps({
    notes: Array
  })
  
  // Define events this component can emit to the parent
  const emit = defineEmits(['note-deleted', 'edit-note', 'view-note'])
  
  /**
 * Deletes a note using its ID via the backend API.
 * On success, emits 'note-deleted' so parent can refresh.
 */
  async function deleteNote(id) {
    if (!confirm('Are you sure you want to delete this note?')) return
    try {
      const res = await fetch(`http://127.0.0.1:8000/notes/${id}`, {
        method: 'DELETE'
      })
      if (!res.ok) throw new Error('Failed to delete')
      emit('note-deleted')
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }
  </script>
  