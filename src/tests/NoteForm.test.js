import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

// Mock lucide icons
vi.mock('lucide-vue-next', () => ({
    Pencil: {},
    Book: {},
    ShoppingCart: {},
    Pin: {},
    Rocket: {}
}))

// Global mocks
global.alert = vi.fn()
console.error = vi.fn()

import NoteForm from '../components/NoteForm.vue'

describe('NoteForm.vue', () => {
    let wrapper

    beforeEach(() => {
        wrapper = mount(NoteForm)
    })

    it('renders required input fields', () => {
        const inputs = wrapper.findAll('input')
        expect(inputs[0].exists()).toBe(true) // title
        expect(wrapper.find('textarea').exists()).toBe(true) // content
        expect(wrapper.find('input[type="date"]').exists()).toBe(true)
    })

    it('does not emit note-added if title is too short', async() => {
        await wrapper.findAll('input')[0].setValue('a')
        await wrapper.find('textarea').setValue('valid content')
        await wrapper.find('input[type="date"]').setValue('2025-05-10')
        await wrapper.find('form').trigger('submit.prevent')

        expect(wrapper.emitted('note-added')).toBeFalsy()
    })

    it('emits note-added on valid input', async() => {
        await wrapper.findAll('input')[0].setValue('My Title')
        await wrapper.find('textarea').setValue('This is content')
        await wrapper.find('input[type="date"]').setValue('2025-05-10')

        global.fetch = vi.fn(() =>
            Promise.resolve({ ok: true, json: () => Promise.resolve({ id: 1 }) })
        )

        await wrapper.find('form').trigger('submit.prevent')
        expect(wrapper.emitted('note-added')).toBeTruthy()
    })

    it('resets form after submission', async() => {
        await wrapper.findAll('input')[0].setValue('Reset Me')
        await wrapper.find('textarea').setValue('To be cleared')
        await wrapper.find('input[type="date"]').setValue('2025-05-10')

        global.fetch = vi.fn(() =>
            Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
        )

        await wrapper.find('form').trigger('submit.prevent')
        expect(wrapper.findAll('input')[0].element.value).toBe('')
        expect(wrapper.find('textarea').element.value).toBe('')
    })

    it('pre-fills the form when editing a note', async() => {
        const editNote = {
            id: 99,
            title: 'Edit Me',
            content: 'Edited content',
            category: 'work',
            icon: 'Pencil',
            duedate: '2025-06-01'
        }

        // Simulate user editing by updating prop after mount
        await wrapper.setProps({ modelValue: editNote })
        await nextTick()

        expect(wrapper.findAll('input')[0].element.value).toBe(editNote.title)
        expect(wrapper.find('textarea').element.value).toBe(editNote.content)
        expect(wrapper.find('input[type="date"]').element.value).toBe(editNote.duedate)
        expect(wrapper.find('select').element.value).toBe(editNote.icon)
    })

    it('logs error if fetch fails', async() => {
        await wrapper.findAll('input')[0].setValue('Error Case')
        await wrapper.find('textarea').setValue('Should fail')
        await wrapper.find('input[type="date"]').setValue('2025-05-10')

        global.fetch = vi.fn(() => Promise.resolve({ ok: false }))
        await wrapper.find('form').trigger('submit.prevent')

        expect(console.error).toHaveBeenCalled()
    })
})