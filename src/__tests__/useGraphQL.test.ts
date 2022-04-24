import { useGraphQL } from ".."
import { renderHook, act } from "@testing-library/react"
import fetch, { enableFetchMocks } from "jest-fetch-mock"

enableFetchMocks()

beforeEach(() => {
    fetch.resetMocks()
})

it('useGraphQL', async () => {
    fetch.mockResponseOnce(() => {
        return Promise.resolve(JSON.stringify({
            data: {
                test: "test OK."
            },
            errors: null
        }))
    })

    const { result } = renderHook(() => useGraphQL({
        operation: "query { test }",
        passive: true
    }))
    
    expect(result.current.loaded).toBe(false)
    expect(result.current.ok).toBe(false)
    expect(result.current.data).toBeUndefined
    expect(result.current.errors).toBeUndefined

    await act(() => result.current.execute())

    expect(result.current.loaded).toBe(true)
    expect(result.current.ok).toBe(true)
    expect(result.current.data).toBeDefined()
    expect(result.current.errors).toBe(null)
})