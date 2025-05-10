import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'

// Mock icons to prevent errors
vi.mock('lucide-vue-next', () => ({
    Pencil: {},
    Book: {},
    ShoppingCart: {},
    Pin: {},
    Rocket: {}
}))

// Mock alert to prevent jsdom crash
global.alert = vi.fn()

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
        expect(wrapper.find('input[type="date"]').exists()).toBe(true) // due date
    })

    it('does not emit note-added if title is too short', async() => {
        await wrapper.findAll('input')[0].setValue('a') // title
        await wrapper.find('textarea').setValue('valid content')
        await wrapper.find('input[type="date"]').setValue('2025-05-10')
        await wrapper.find('form').trigger('submit.prevent')

        expect(wrapper.emitted('note-added')).toBeFalsy()
    })

    it('emits note-added on valid input', async() => {
        await wrapper.findAll('input')[0].setValue('My Title') // title
        await wrapper.find('textarea').setValue('This is content')
        await wrapper.find('input[type="date"]').setValue('2025-05-10')

        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ id: 1 })
            })
        )

        await wrapper.find('form').trigger('submit.prevent')
        expect(wrapper.emitted('note-added')).toBeTruthy()
    })

    it('resets form after submission', async() => {
        await wrapper.findAll('input')[0].setValue('Test Title')
        await wrapper.find('textarea').setValue('Some content')
        await wrapper.find('input[type="date"]').setValue('2025-05-10')

        global.fetch = vi.fn(() =>
            Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
        )

        await wrapper.find('form').trigger('submit.prevent')

        expect(wrapper.findAll('input')[0].element.value).toBe('')
        expect(wrapper.find('textarea').element.value).toBe('')
    })
})