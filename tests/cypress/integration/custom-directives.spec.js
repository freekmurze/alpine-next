import { haveText, test } from '../utils'

test('can register custom directive',
    [`
        <div x-data>
            <span x-foo:bar.baz="bob"></span>
        </div>
    `,
    `
        Alpine.directive('foo', (el, { value, modifiers, expression }) => {
            el.textContent = value+modifiers+expression
        })
    `],
    ({ get }) => get('span').should(haveText('barbazbob'))
)

test('directives are auto cleaned up',
    [`
        <div x-data="{ count: 0 }">
            <span x-foo x-ref="foo"></span>
            <h1 x-text="count"></h1>

            <button @click="count++" id="change">change</button>
            <button @click="$refs.foo.remove()" id="remove">remove</button>
        </div>
    `,
    `
        Alpine.directive('foo', (el, {}, { effect, cleanup }) => {
            let evaluate = Alpine.evaluateLater(el, 'foo')
            let incCount = Alpine.evaluateLater(el, 'count++')

            cleanup(() => {
                incCount()
                incCount()
            })

            effect(() => {
                incCount()
                evaluate(value => el.textContent = value)
            })
        })
    `],
    ({ get }) => {
        get('h1').should(haveText('1'))
        get('#change').click()
        get('h1').should(haveText('3'))
        get('#remove').click()
        get('#change').click()
        get('h1').should(haveText('6'))
        get('#change').click()
        get('h1').should(haveText('7'))
    }
)
