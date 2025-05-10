import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'

// Mock lucide-vue-next icons
vi.mock('lucide-vue-next', () => ({
    Pencil: {},
    Book: {},
    ShoppingCart: {},
    Pin: {},
    Rocket: {}
}))

// Mock window.confirm
global.confirm = vi.fn(() => true)

import NoteList from '../components/NoteList.vue'

const sampleNotes = [
    { id: 1, title: 'Note One', content: 'First note', icon: 'Pencil' },
    { id: 2, title: 'Note Two', content: 'Second note', icon: 'Book' }
]

describe('NoteList.vue', () => {
    it('renders notes passed via props', () => {
        const wrapper = mount(NoteList, {
            props: { notes: sampleNotes }
        })

        expect(wrapper.text()).toContain('Note One')
        expect(wrapper.text()).toContain('Note Two')
    })

    it('shows fallback if no notes exist', () => {
        const wrapper = mount(NoteList, {
            props: { notes: [] }
        })

        expect(wrapper.text()).toContain('No notes found.')
    })

    it('emits edit-note event when Edit is clicked', async() => {
        const wrapper = mount(NoteList, {
            props: { notes: sampleNotes }
        })

        await wrapper.findAll('button')[0].trigger('click') // First Edit button
        expect(wrapper.emitted('edit-note')).toBeTruthy()
        expect(wrapper.emitted('edit-note')[0][0]).toEqual(sampleNotes[0])
    })

    it('emits note-deleted event when Delete is confirmed', async() => {
        global.confirm = vi.fn(() => true)

        // Mock successful DELETE request
        global.fetch = vi.fn(() =>
            Promise.resolve({ ok: true })
        )

        const wrapper = mount(NoteList, {
            props: { notes: sampleNotes }
        })

        const deleteButtons = wrapper.findAll('button').filter(btn => btn.text() === 'Delete')
        expect(deleteButtons.length).toBeGreaterThan(0)

        await deleteButtons[0].trigger('click') // Trigger delete on first note

        expect(wrapper.emitted('note-deleted')).toBeTruthy()
    })


})