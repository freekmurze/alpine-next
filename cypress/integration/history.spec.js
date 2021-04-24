import { haveText, test } from '../utils'

test('can go back and forth',
    [`
        <div x-data="{ count: 1 }" x-history="count">
            <button @click="count++">Inc</button>
            <span x-text="count"></span>
        </div>
    `],
    ({ get, url, go }) => {
        get('span').should(haveText('1'))
        url().should('include', '?count=1')
        get('button').click()
        get('span').should(haveText('2'))
        url().should('include', '?count=2')
        go('back')
        get('span').should(haveText('1'))
        url().should('include', '?count=1')
        go('forward')
        get('span').should(haveText('2'))
        url().should('include', '?count=2')
    },
)

test('property is set from the query string on load',
    [`
        <div x-data="{ count: 1 }" x-history="count">
            <button @click="count++">Inc</button>
            <span x-text="count"></span>
        </div>
    `],
    ({ get, url }, reload) => {
        get('span').should(haveText('1'))
        url().should('include', '?count=1')
        get('button').click()
        get('span').should(haveText('2'))
        url().should('include', '?count=2')
        reload()
        get('span').should(haveText('2'))
    },
)

test('can go back and forth with multiple components',
    [`
        <div x-data="{ foo: 1 }" x-history="foo" id="foo">
            <button @click="foo++">Inc</button>
            <span x-text="foo"></span>
        </div>

        <div x-data="{ bar: 1 }" x-history="bar" id="bar">
            <button @click="bar++">Inc</button>
            <span x-text="bar"></span>
        </div>
    `],
    ({ get, url, go }) => {
        get('#foo span').should(haveText('1'))
        url().should('include', 'foo=1')
        get('#foo button').click()
        get('#foo span').should(haveText('2'))
        url().should('include', 'foo=2')

        get('#bar span').should(haveText('1'))
        url().should('include', 'bar=1')
        get('#bar button').click()
        get('#bar span').should(haveText('2'))
        url().should('include', 'bar=2')

        go('back')

        get('#bar span').should(haveText('1'))
        url().should('include', 'bar=1')
        get('#foo span').should(haveText('2'))
        url().should('include', 'foo=2')

        go('back')

        get('#bar span').should(haveText('1'))
        url().should('include', 'bar=1')
        get('#foo span').should(haveText('1'))
        url().should('include', 'foo=1')
    },
)
