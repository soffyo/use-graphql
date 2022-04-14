# useGraphQL

## One simple Typescript/React hook used to fetch data from a GraphQL endpoint. 

**useGraphQL** aims to cover the generic GraphQL usage inside a React/Typescript environment providing a helpful API to bring you the query/mutation result in a simple and clean way with types included (if you want). 

It supports [TypedDocumentNode](https://github.com/dotansimha/graphql-typed-document-node) as an input source as well as a normal GraphQL `DocumentNode`. 

> In the future, more features may be implemented.

### Basic usage example:

```javascript
import { useGraphQL } from "use-graphql"
import { GetUserDocument } from "./operations"

function Username({ email }) {
    const { data, errors, loaded } = useGraphQL({
        operation: GetUserDocument, // can be a TypedDocumentNode, a DocumentNode or a string 
        variables: { email }
    })

    if (loaded) {
        if (errors) {
            return (
                <div>
                    <span>
                        An error occurred: {errors[0].message}
                    </span>
                </div>
            )
        }

        return (
            <>
                ...
                <div>
                    <span>
                        Username: {data.user.username /* will automatically benefit from autocomplete and type checking based on your schema and query.*/}
                    </span>
                </div>
                ...
            </>
        )
    }

    return (
        <div>
            <span>
                Loading...
            </span>
        </div>
    )
}
```

### More examples coming...

### API

The useGraphQL hook returns an `Object` with the following properties:

**data**: the `data` object you get from a successful GraphQL request or `null` if errors occurred or the request didn't load yet.
**errors**: the `Errors` array you get from GraphQL when one or more errors occurred or `null` if the server responded with `data`
**loaded**: `true` when the server responds. Otherwise `false`
**execute**: an `async function` which executes the request. Useful if you need to refresh the result or using `passive: true`.

The useGraphQL function accepts an object as its only argument with following properties:

**operation**: Mandatory - can be a `TypedDocumentNode`, a `DocumentNode` or a `String`. This contains the operation you send to the GraphQL endpoint.
**variables**: Optional - `Object` with the following structure `{ [key: string]: any}`. The variables used by the GraphQL operation.
**token**: Optional - `String` containing an authorization token which will be sent with the *Authorization* header as `bearer ${token}`.
**passive**: Optional - `Boolean` value which determines if the GraphQL request will be executed immediatly or not. If passed `true` the request will only run if you call `execute()`, otherwise it will run as soon as the component renders. Defaults to `false`
**endpoint**: the GraphQL endpoint. Defaults to `/graphql`.

