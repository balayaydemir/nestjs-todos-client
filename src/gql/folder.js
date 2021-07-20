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

export const DELETE_FOLDER_QUERY = gql`
    mutation deleteFolder($id: Float!) {
        deleteFolder(id: $id) {
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

export const FOLDER_ADDED_SUBSCRIPTION = gql`
    subscription folderAdded($userId: Float!) {
        folderAdded(userId: $userId) {
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

export const FOLDER_DELETED_SUBSCRIPTION = gql`
    subscription folderDeleted {
        folderDeleted {
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