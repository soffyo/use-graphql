# use-graphql-ts

> One simple Typescript/React hook used to fetch data from a GraphQL endpoint. 

**use-graphql-ts** aims to cover the generic GraphQL usage inside a React/Typescript environment providing a helpful API to bring you the query/mutation result in a simple and clean way with types included (if you want). 

It supports [TypedDocumentNode](https://github.com/dotansimha/graphql-typed-document-node) as an input source as well as a normal GraphQL `DocumentNode`. 

In the future, more features may be implemented.

## Installation

```
    npm i --save use-graphql-ts
````

## Usage

### TypedDocumentNode Example
In this example we use a TypedDocumentNode generated from our query.

> query.graphql
```graphql
query getUser {
    user {
        username
    }
}
```
> username.tsx
```tsx
import { useGraphQL } from "use-graphql-ts"
import { GetUserDocument } from "./generated-types"

function Username({ email }) {
    const { data, errors, loaded } = useGraphQL({
        operation: GetUserDocument, // <- TypedDocumentNode 
        variables: { email } // <- type checking here!
    })

    const displayUsername = () => {
        if (loaded) {
            if (errors) {
                return `An error occurred: ${errors[0].message}`
                )
            }
            return `Username: ${data.user.username}` // <- type checking here!
        }
        return "Loading..."
    }

    return (
        <span>
            {displayUsername()}
        </span>
    )
}
```

### DocumentNode Example
Here we pass a document node directly so to get type checking we'll need to manually pass our data types
> query.graphql
```graphql
query getUser {
    user {
        username
    }
}
```
> types.ts
```typescript
interface User {
    ...
    username: string
    ...
}

export type Data = Record<"user", User>

export type Variables = Record<"email", string>
```
> username.tsx
```tsx
import { useGraphQL } from "use-graphql-ts"
import Query from "./query.graphql"
import { Data, Variables } from "./types"

function Username({ email }) {
    const { data, ok } = useGraphQL<Data, Variables>({
        operation: Query,
        variables: { email } // <- will be checked against Variables generic argument
    })

    return (
        <span>
            Username: {ok && data.user.username /* <- Type checking here */}
        </span>
    )
}
```

### Passive Mode Example
In this example we can see how to execute the operation only when we call it.
```tsx
import { useGraphQL } from "use-graphql-ts"

function DeleteUser({ email }) {
    const { ok, execute } = useGraphQL({
        operation: `mutation($email: String!) {
            deleteUser(email: $email)
        }`, // <- we can pass a string for the operation.
        variables: { email },
        passive: true // <- this stops the operation from being executed until we call it with execute() 
    })

    const executeDelete = async () => {
        await execute()

        if (ok) {
            alert("User deleted successfully.")
        } else {
            alert("Something went wrong!")
        }
    }

    return (
        <button onClick={() => executeDelete()}>
            Delete this user
        </button>
    )
}
```

## API

useGraphQL returns an `Object` with the following properties:

```typescript
{
    data: Record<string, any> | null  
    errors: Error[] | null
    loaded: boolean 
    ok: boolean
    execute: () => Promise<void>
    reset: () => void
}
```

+ **data**: the response you get from a successful GraphQL request. `null` if errors occurred or the request didn't load yet.
+ **errors**: the errors array you get from GraphQL when one or more errors occurred. `null` if the server responded with `data`
+ **loaded**: `true` when the server responds and the promise is fullfilled. Otherwise `false`. Note that this will be `true` even when errors occured.
+ **ok**: `true` when the server responds with `data` and `errors` is `null`. Useful to check if data is retrieved without errors.
+ **execute**: an `async function` which executes the request. Useful if you need to refresh the result or using `passive: true`.
+ **reset**: a `function` that sets alla the return values to initial. 

The useGraphQL function accepts an object as its only argument with the following properties:

```typescript
{
    operation: DocumentNode | TypedDocumentNode | string
    variables?: Record<string, any> // defaults to null
    token?: string //defaults to null
    passive?: boolean // defaults to false
    endpoint?: string // defaults to "/graphql"
}
```

+ **operation** - *Non-Optional*: This is the mutation or query request you send to the GraphQL endpoint. Can be a `TypedDocumentNode`, a `DocumentNode` or a `String`. 
+ **variables** - *Optional*: The variables object used by the GraphQL operation.
+ **token** - *Optional*: An authorization token which will be sent with the *Authorization* header as `Bearer <token>`.
+ **passive** - *Optional*: Determines if the GraphQL request will be executed immediatly or not. If passed `true` the request will only run when you call `execute()`, otherwise if passed `false` it will run as soon as the component renders.
+ **endpoint**: the GraphQL endpoint.

