const dummy = require('../utils/list_helper').dummy

describe('Dummy test', () => {
    test('dummy return 1', () => {
        const blog = []
        expect(dummy(blog)).toBe(1)
    })
})