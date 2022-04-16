import { useState, useEffect } from "react"

export function useVariables<VariablesType = Record<string, any>>(variables: VariablesType): string
export function useVariables<V>(variables: V): string {
    const current = JSON.stringify(variables)

    const [result, set] = useState<string>(current)

    useEffect(() => {
        set(prev => {
            if (prev !== current) {
                return current
            }

            return prev
        })

        return () => {
            set(current)
        }
    }, [current])

    return result
}