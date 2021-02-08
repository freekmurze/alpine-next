import Alpine from '../alpine'
import { effect } from '../reactivity'
import { evaluator } from '../utils/evaluate'
import { once } from '../utils/once'
import { setStyles } from '../utils/styles'

Alpine.directive('if', (el, value, modifiers, expression) => {
    let evaluate = evaluator(el, expression, {}, true, true)

    let show = () => {
        if (el._x_currentIfEl) return el._x_currentIfEl

        let clone = el.content.cloneNode(true).firstElementChild

        el.after(clone)

        el._x_currentIfEl = clone

        el._x_undoIf = () => { clone.remove(); delete el._x_currentIfEl }

        return clone
    }

    let hide = () => {
        el._x_undoIf?.() || delete el._x_undoIf
    }

    let toggle = once(
        value => value ? show() : hide(),
        value => {
            if (typeof el._x_toggleAndCascadeWithTransitions === 'function') {
                if (value) {
                    let currentIfEl = el._x_currentIfEl

                    // We have to execute the actual transition in at the end
                    // of the microtask queue, so that the newly added element
                    // has a chance to get picked up and initialized from the
                    // global Alpine mutation observer system.
                    queueMicrotask(() => {
                        // Now that we've added the element to the page, we'll
                        // immediately make it hidden so that we can transition it in.
                        let undo = setStyles(currentIfEl, { display: 'none' })

                        if (modifiers.includes('transition') && typeof currentIfEl._x_registerTransitionsFromHelper === 'function') {
                            currentIfEl._x_registerTransitionsFromHelper(currentIfEl, modifiers)
                        }

                        el._x_toggleAndCascadeWithTransitions(clone, true, undo, () => {})
                    })
                } else {
                    el._x_toggleAndCascadeWithTransitions(el._x_currentIfEl, false, () => {}, hide)
                }
            } else {
                value ? show() : hide()
            }
        }
    )

    effect(() => evaluate()(value => {
        if (modifiers.includes('immediate')) value ? show() : hide()

        toggle(value)
    }))
})
