import { magic } from '../src/index.js'

document.addEventListener('alpine:initializing', () => {
    window.Alpine.magic('history', magic)
})
