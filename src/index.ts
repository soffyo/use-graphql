import { print, DocumentNode } from "graphql"
import { useState, useEffect, useCallback, useMemo } from "react"
import { TypedDocumentNode } from "@graphql-typed-document-node/core"
import { useVariables } from "./use-variables"

interface useGraphQLArgs {
    operation: DocumentNode | string
    variables?: Record<string, any>
    token?: string
    passive?: boolean
    endpoint?: string
}

interface TypedGraphQLArgs<DataType, VariablesType> extends useGraphQLArgs {
    operation: TypedDocumentNode<DataType, VariablesType> | string
    variables?: VariablesType
}

interface GraphQLResponse<DataType> {
    data?: DataType
    errors?: Error[]
}

interface useGraphQLResult<DataType> extends GraphQLResponse<DataType> {
    loaded: boolean
    execute: () => Promise<void>
    reset: () => void
} 

export function useGraphQL<DataType = any, VariablesType = Record<string, any>>(args: TypedGraphQLArgs<DataType, VariablesType>): useGraphQLResult<DataType>
export function useGraphQL<D = any, V = Record<string, any>>({ operation, variables, token, passive = false, endpoint = "/graphql"}: TypedGraphQLArgs<D,V>): useGraphQLResult<D> {
    const [graphQL, setGraphQL] = useState<GraphQLResponse<D>>(null)

    const vars = useVariables<V>(variables)

    const query = useCallback(() => {
        if (typeof operation == "string") {
            return operation
        }

        return print(operation)
    }, [operation])

    const Authorization = useMemo(() => {
        if (token) {
            return { Authorization: `bearer ${token}` }
        }
    }, [token])

    const fetchGraphQL = useCallback(async() => {
        const init: RequestInit = {
            method: "POST",
            headers: {
                ...Authorization,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                query: query(), variables: vars
            })
        }

        try {
            const response: Response = await fetch(endpoint, init)

            const { data, errors }: GraphQLResponse<D> = await response.json()

            setGraphQL(prev => {
                if (!prev) {
                    return { data, errors }
                } else {
                    if (JSON.stringify(prev) !== JSON.stringify({ data, errors })) {
                        return { data, errors }
                    } else {
                        return prev
                    }
                }
            })
        } catch (error) {
            console.log(error)

            setGraphQL(null)
        }
    }, [Authorization, query, vars, endpoint])

    useEffect(() => {
        let mounted = true

        if (mounted) {
            if (!passive) {
                fetchGraphQL()
            }
        }

        return () => {
            mounted = false

            setGraphQL(null)
        }
    }, [fetchGraphQL, passive])

    return {
        ...graphQL,
        loaded: graphQL ? true : false,
        execute: fetchGraphQL,
        reset: () => setGraphQL(null)
    }
}