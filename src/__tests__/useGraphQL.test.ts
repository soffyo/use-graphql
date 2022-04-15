import { useGraphQL } from ".."

test('useGraphQL', () => {
    expect(useGraphQL({ 
        operation: `query {
            argTest
        }`,
        endpoint: "http://localhost:3000/graphql"
    })).toMatchObject({
        data: {
            argTest: "TEST OK. NO ARGS PASSED"
        },
        errors: null,
        loaded: true
    })
})