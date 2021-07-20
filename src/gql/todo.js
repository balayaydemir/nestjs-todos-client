import { gql } from '@apollo/client'

export const TODO_BASE_FRAGMENT = gql`
    fragment TodoBaseFields on Todo {
        id
        name
        description
        isCompleted
        user {
            id
            firstName
            lastName
        }
        folder {
            id
        }
    }
`

export const EDIT_TODO_QUERY = gql`
    ${TODO_BASE_FRAGMENT}
    mutation editTodo($input: EditTodoInput!) {
        editTodo(input: $input) {
            ...TodoBaseFields
        }
    }
`

export const DELETE_TODO_QUERY = gql`
    ${TODO_BASE_FRAGMENT}
    mutation deleteTodo($id: Float!) {
        deleteTodo(id: $id) {
            ...TodoBaseFields
        }
    }
`

export const CREATE_TODO_QUERY = gql`
    ${TODO_BASE_FRAGMENT}
    mutation createTodo($input: CreateTodoInput!) {
        createTodo(input: $input) {
            ...TodoBaseFields
        }
    }
`

export const TODO_ADDED_SUBSCRIPTION = gql`
    ${TODO_BASE_FRAGMENT}
    subscription todoAdded($userId: Float!) {
        todoAdded(userId: $userId) {
            ...TodoBaseFields
        }
    }
`

export const TODO_EDITED_SUBSCRIPTION = gql`
    ${TODO_BASE_FRAGMENT}
    subscription todoEdited($userId: Float!) {
        todoEdited(userId: $userId) {
            ...TodoBaseFields
        }
    }
`

export const TODO_DELETED_SUBSCRIPTION = gql`
    ${TODO_BASE_FRAGMENT}
    subscription todoDeleted {
        todoDeleted {
            ...TodoBaseFields
        }
    }
`
