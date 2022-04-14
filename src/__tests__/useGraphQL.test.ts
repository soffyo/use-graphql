import { useGraphQL } from ".."

test('useGraphQL', () => {
    expect(useGraphQL({ 
        operation: null 
    })).toBe({
        data: null,
        errors: !null,
        loaded: false,
        execute: !null
    })
})