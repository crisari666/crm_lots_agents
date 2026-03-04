import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { TypePercentageEnum, UserPercentageDialog, UsersPercentageState } from "./users-percentage.state";
import { addUserPercentageReq, filterPercentagesReq, getUserPercentagesReq } from "../../../app/services/users-percentage.service";
const initialState: UsersPercentageState = {
  loading: false,
  usersPercentageRows: [],
  usersPercentageFiltered: [],
  userPercentageDialog: undefined
}

export const fetchUserPercentagesThunk = createAsyncThunk( "UsersPercentageSlice/fetchUserPercentagesThunk", async () => await getUserPercentagesReq())

export const addUserPercentageThunk = createAsyncThunk( "UsersPercentageSlice/addUserPercentageThunk", async (params: UserPercentageDialog) => await addUserPercentageReq(params))

export const filterUserPercentageThunk = createAsyncThunk( "UsersPercentageSlice/filterUserPercentageThunk", async ({type} : {type: TypePercentageEnum}) => await filterPercentagesReq({type}))

export const usersPercentageSlice = createSlice({
  name: "UsersPercentageSlice",
  initialState,
  reducers: {
    closeUserPercentageDialogAct: (state, ) => {
      state.userPercentageDialog = undefined
    },
    showPercentageDialogAct: (state, action: PayloadAction<{user: string}>) => {
      state.userPercentageDialog = {
        office: '',
        user: action.payload.user,
        percentage: 0,
        type: TypePercentageEnum.empty
      }
    },
    updateInputUserPercentegeDialogAct: (state, action: PayloadAction<{key: string, value: any}>) => {
      if (state.userPercentageDialog) {
        state.userPercentageDialog[action.payload.key] = action.payload.value
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserPercentagesThunk.fulfilled, (state, action) => {
      state.usersPercentageRows = action.payload
    }).addCase(addUserPercentageThunk.fulfilled, (state, action) => {
      if(action.payload) {
        state.userPercentageDialog = undefined
        state.usersPercentageRows.push(action.payload)
      }
    }).addCase(filterUserPercentageThunk.fulfilled, (state, action) => {
      state.usersPercentageFiltered = action.payload
    })

    builder.addMatcher((action) => action.type.endsWith("/pending") && action.type.includes("UsersPercentageSlice"), (state) => {
      state.loading = true
    }).addMatcher((action) => action.type.endsWith("/fulfilled") && action.type.includes("UsersPercentageSlice"), (state) => {
      state.loading = false
    })
  },
})
export const { closeUserPercentageDialogAct, updateInputUserPercentegeDialogAct, showPercentageDialogAct } = usersPercentageSlice.actions

export default usersPercentageSlice.reducer