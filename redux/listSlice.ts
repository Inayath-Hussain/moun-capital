import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

export interface Itodos {
    id: string,
    title: string,
    description: string,
    isDone: boolean
}

export interface Itasks {
    listName: string;
    todos: Itodos[];
}

const listSlice = createSlice({
    name: 'list',
    initialState: [] as Itasks[],
    reducers: {
        refreshList: (state, action: PayloadAction<Itasks[]>) => {
            state.length = 0
            state.push(...action.payload)
        },
        addTodo: (state, action: PayloadAction<Itasks>) => {
            const l = state.find(v => v.listName === action.payload.listName)
            if (l) {
                l?.todos.push(...action.payload.todos)
                state = state.filter(v => v.listName === l?.listName)
                state.push(l)
            }
        }
    }
})


export const { addTodo, refreshList } = listSlice.actions;
export default listSlice.reducer

export const selectList = (state: RootState) => state.list