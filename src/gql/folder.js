import { gql } from '@apollo/client'

export const FOLDERS_QUERY = gql`
    query getAllFolders {
        getAllFolders {
            id
            name
            todos {
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
    }
`

export const FOLDER_QUERY = gql`
    query getFolder($id: Float!) {
        getFolder(id: $id) {
            id
            name
            todos {
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
    }
`

export const CREATE_FOLDER_QUERY = gql`
    mutation createFolder($input: CreateFolderInput!) {
        createFolder(input: $input) {
            id
            name
            todos {
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
    }
`