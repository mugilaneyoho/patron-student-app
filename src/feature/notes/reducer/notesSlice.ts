import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface NoteType {
    topicName: string
    classType: string
    classDate: string
    status: string
    materialType: string[]
}

type NotesState = {
    data: NoteType[]
}

const initialState: NotesState = {
    data: []
}

const notesSlice = createSlice({
    name: "notes",
    initialState,
    reducers: {
        getByIdNotes: (state, action: PayloadAction<NoteType[]>) => {
            state.data = action.payload
            console.log("From slice :", action.payload)
        }
    }
})

export const { getByIdNotes } = notesSlice.actions
export default notesSlice.reducer