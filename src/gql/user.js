import { gql } from '@apollo/client'

export const CREATE_USER_QUERY = gql`
    mutation createUser($input: CreateUserInput!) {
        createUser(input: $input) {
            id
            firstName
            lastName
        }
    }
`