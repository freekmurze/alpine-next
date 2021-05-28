import Alpine from './alpine'

let magics = {}

export function magic(name, callback) {
    magics[name] = callback
}

export function injectMagics(obj, el) {
    Object.entries(magics).forEach(([name, callback]) => {
        Object.defineProperty(obj, `$${name}`, {
            get() { return callback(el, { Alpine }) },

            enumerable: true,
        })
    })

    return obj
}
