import { getByIdNotes } from "./notesSlice";
import { fetchNote } from "../service";

export const getNoteByIdThunk = (id: number = 1) => async (dispatch: any) => {
    try {
        const response = await fetchNote(id)
        console.log("API data in thunk:", response)

        const data = Array.isArray(response) ? response : [response]
        dispatch(getByIdNotes(data))
        return response
    } catch (error) {
        console.log("getNoteByIdThunk error:", error)
    }
}

