import { gql } from '@apollo/client'

export const FOLDER_BASE_FRAGMENT = gql`
    fragment FolderBaseFields on Folder {
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
`

export const FOLDERS_QUERY = gql`
    ${FOLDER_BASE_FRAGMENT}
    query getAllFolders {
        getAllFolders {
            ...FolderBaseFields
        }
    }
`

export const DELETE_FOLDER_QUERY = gql`
    ${FOLDER_BASE_FRAGMENT}
    mutation deleteFolder($id: Float!) {
        deleteFolder(id: $id) {
            ...FolderBaseFields
        }
    }
`

export const CREATE_FOLDER_QUERY = gql`
    ${FOLDER_BASE_FRAGMENT}
    mutation createFolder($input: CreateFolderInput!) {
        createFolder(input: $input) {
            ...FolderBaseFields
        }
    }
`

export const FOLDER_ADDED_SUBSCRIPTION = gql`
    ${FOLDER_BASE_FRAGMENT}
    subscription folderAdded($userId: Float!) {
        folderAdded(userId: $userId) {
            ...FolderBaseFields
        }
    }
`

export const FOLDER_DELETED_SUBSCRIPTION = gql`
    ${FOLDER_BASE_FRAGMENT}
    subscription folderDeleted {
        folderDeleted {
            ...FolderBaseFields
        }
    }
`
