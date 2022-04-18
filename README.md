# use-graphql-ts

> One simple Typescript/React hook used to fetch data from a GraphQL endpoint. 

**use-graphql-ts** aims to cover the generic GraphQL usage inside a React/Typescript environment providing a helpful API to bring you the query/mutation result in a simple and clean way with types included (if you want). 

It supports [TypedDocumentNode](https://github.com/dotansimha/graphql-typed-document-node) as an input source as well as a normal GraphQL `DocumentNode`. 

In the future, more features may be implemented.

### Installation:

```
    npm i --save use-graphql-ts
````

### Basic usage example:

```tsx
import { useGraphQL } from "use-graphql-ts"
import { GetUserDocument } from "./operations"

function Username({ email }) {
    const { data, errors, loaded } = useGraphQL({
        operation: GetUserDocument, // can be a TypedDocumentNode 
        variables: { email }
    })

    if (loaded) {
        if (errors) {
            return (
                <span>
                    An error occurred: {errors[0].message}
                </span>
            )
        }

        return (
            <span>
                Username: {data.user.username /* will automatically benefit from autocomplete and type checking based on your schema and query.*/}
            </span>
        )
    }

    return (
        <span>
            Loading...
        </span>
    )
}
```

### More examples coming...

### API

useGraphQL returns an `Object` with the following properties:

```typescript
    data: Record<string, any> | null  
    errors: Error[] | null
    loaded: boolean 
    execute: () => Promise<void>
    reset: () => void
```

+ **data**: the response you get from a successful GraphQL request. `null` if errors occurred or the request didn't load yet.
+ **errors**: the errors array you get from GraphQL when one or more errors occurred. `null` if the server responded with `data`
+ **loaded**: `true` when the server responds and the promise is fullfilled. Otherwise `false` 
+ **execute**: an `async function` which executes the request. Useful if you need to refresh the result or using `passive: true`.
+ **reset**: a `function` that sets alla the return values to initial. 

The useGraphQL function accepts an object as its only argument with the following properties:

```typescript
    operation: DocumentNode | TypedDocumentNode | string
    variables?: Record<string, any> // defaults to null
    token?: string //defaults to null
    passive?: boolean // defaults to false
    endpoint?: string // defaults to "/graphql"
```

+ **operation** - *Non-Optional*: This is the mutation or query request you send to the GraphQL endpoint. Can be a `TypedDocumentNode`, a `DocumentNode` or a `String`. 
+ **variables** - *Optional*: The variables object used by the GraphQL operation.
+ **token** - *Optional*: An authorization token which will be sent with the *Authorization* header as `bearer ${token}`.
+ **passive** - *Optional*: Determines if the GraphQL request will be executed immediatly or not. If passed `true` the request will only run when you call `execute()`, otherwise if passed `false` it will run as soon as the component renders.
+ **endpoint**: the GraphQL endpoint.

