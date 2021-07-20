import { gql } from '@apollo/client'

export const EDIT_TODO_QUERY = gql`
    mutation editTodo($input: EditTodoInput!) {
        editTodo(input: $input) {
            id
            name
            description
            isCompleted
            user {
                id
                firstName
                lastName
            }
        }
    }
`

export const DELETE_TODO_QUERY = gql`
    mutation deleteTodo($id: Float!) {
        deleteTodo(id: $id) {
            id
            name
            description
            isCompleted
            user {
                id
                firstName
                lastName
            }
        }
    }
`

export const CREATE_TODO_QUERY = gql`
    mutation createTodo($input: CreateTodoInput!) {
        createTodo(input: $input) {
            id
            name
            description
            isCompleted
            user {
                id
                firstName
                lastName
            }
        }
    }
`

export const TODO_ADDED_SUBSCRIPTION = gql`
    subscription todoAdded($userId: Float!) {
        todoAdded(userId: $userId) {
            id
            name
            description
            isCompleted
            user {
                id
                firstName
                lastName
            }
        }
    }
`

export const TODO_EDITED_SUBSCRIPTION = gql`
    subscription todoEdited($userId: Float!) {
        todoEdited(userId: $userId) {
            id
            name
            description
            isCompleted
            user {
                id
                firstName
                lastName
            }
        }
    }
`

export const TODO_DELETED_SUBSCRIPTION = gql`
    subscription todoDeleted {
        todoDeleted {
            id
            name
            description
            isCompleted
            user {
                id
                firstName
                lastName
            }
        }
    }
`
