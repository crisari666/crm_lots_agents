import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import UserInterface from "../../../app/models/user-interface"
import { closeUserMobileSesionReq, fetchUsers, fetchSubadmins, getLeadForOfficeReq, getLeadUsersReq, setUserLinkReq, updateUserOfficeReq } from "../../../app/services/users.service"
import { ModalChangeUserI, UserRankedForm, UsersListState } from "./users-state"
import filterUsersByOffice from "./user.business_logic"
import { updateUserLevelReq } from "../../../app/services/user-rank.service"

const userRankedFormInit: UserRankedForm = {
  officeLevelId: '',
  userId: '',
  userName: '',
}

const userListInitState: UsersListState = {
  users: [],
  audits: [],
  search_string: "",
  leadsForOfficeChose: [],
  loading: true,
  gotUsers: false,
  officeIdFilter: "",
  usersOriginal: [],
  userRankedForm: userRankedFormInit,
  displayFormRankedUser: false,
  onlyEnableUsers: true
}

export const fetchUsersThunk = createAsyncThunk( "UserList/fetchUsers", async ({enable = false} : {enable?: boolean | undefined}) => await fetchUsers({enable}))

export const fetchSubadminsThunk = createAsyncThunk( "UserList/fetchSubadmins", async () => await fetchSubadmins())

export const updateUserOfficeThunk = createAsyncThunk("UserList/updateUserOfficeThunk", async ({ userId, officeId, lead } : { userId : string, officeId: string, lead: string}) =>
  await updateUserOfficeReq({userId, officeId, lead}))

export const getLeadUsersThunk = createAsyncThunk("UsersList/getLeadUsersThunk", async () => await getLeadUsersReq())

export const getLeadsForOfficeThunk = createAsyncThunk("UsersList/getLeadsForOfficeThunk", async ({officeId} : {officeId: string }) =>  await getLeadForOfficeReq({officeId}))

export const setUserLinkThunk = createAsyncThunk( "UsersList/setUserLinkThunk", async (params: {userId: string, link: string}) => await setUserLinkReq(params))

export const logoutUserMobileThunk = createAsyncThunk( "UsersList/logoutUserMobileThunk", async (userId: string) => await closeUserMobileSesionReq({userId}))

export const updateUserRankThunk = createAsyncThunk( "UsersList/updateUserRankThunk", async ({userId, officeLevelId} : {userId: string, officeLevelId: string} ) =>
  await updateUserLevelReq({userId, officeLevel: officeLevelId})
)

export const usersListSlice = createSlice({
  name: "UserList",
  initialState: userListInitState,
  reducers: {
    setUserList: (state, action: PayloadAction<UserInterface[]>) => {
      state.users = action.payload
    },
    addUserToListAct: (state, action: PayloadAction<UserInterface>) => {
      state.users.push(action.payload)
    },
    setModalChangeOfficeStateAct: (state, action: PayloadAction<ModalChangeUserI>) => {
      state.modalChangeofficeState = action.payload
    },
    clearModalChangeOfficeStateAct: (state) => {
      state.modalChangeofficeState = undefined
    },
    updateInputNewOfficeAct: (state, action: PayloadAction<string>) => {
      state.modalChangeofficeState!.newOffice = action.payload
    },
    updateUserConnectedAct: (state, action: PayloadAction<{userId: string, connected: boolean}>) => {
      const {userId, connected} = action.payload
      const userIndex = state.users.findIndex((el) => el._id === userId)
      const userIndexOriginal = state.usersOriginal.findIndex((el) => el._id === userId)
      
      if(userIndex !== -1) state.users[userIndex].connected = connected
      if(userIndexOriginal !== -1) state.usersOriginal[userIndexOriginal].connected = connected
    },
    filterByOfficeChosenAct: (state, action: PayloadAction<string>) => {
      state.officeIdFilter = action.payload
      filterUsersByOffice(state);
    },
    clearFilterUsersAct: (state) => {
      state.officeIdFilter = ""
      state.users = state.usersOriginal.slice()
      state.search_string = ""
    },
    changeSearchStringAct: (state, action: PayloadAction<string>) => {
      state.search_string = action.payload
      let users = []
      if(state.officeIdFilter !== "") {
        filterUsersByOffice(state)
        users = state.users
      } else {
        users = state.usersOriginal
      }
      state.users = users.filter((el) => (el.name.toLowerCase().includes(action.payload.toLowerCase()) || el.email.toLowerCase().includes(action.payload.toLowerCase())) || el.lastName.toLowerCase().includes(action.payload.toLowerCase()))
    },
    setLeadForUserAct: (state, action: PayloadAction<string>) => {
      state.modalChangeofficeState!.lead = action.payload
    },
    setDialogSetUserLinkAct: (state, action: PayloadAction<{name: string, userId: string, link: string} | undefined>) => {
      state.dialogSetUserLink = action.payload
    },
    updateInputUserLinkAct: (state, action: PayloadAction<string>) => { 
      if(state.dialogSetUserLink) state.dialogSetUserLink.link = action.payload
    },
    displayUserRankedFormAct: (state, action: PayloadAction<boolean>) => {
      state.displayFormRankedUser = action.payload
      if(!action.payload) {
        state.userRankedForm = userRankedFormInit
      }
    },
    updateInputUserRankedFormAct: (state, action: PayloadAction<{name: string, val: string}>) => {
      state.userRankedForm[action.payload.name] = action.payload.val
    },
    changeOnlyEnableUsersAct: (state, action: PayloadAction<boolean>) => {
      state.onlyEnableUsers = action.payload
    }
  },
  extraReducers(builder) {
    builder.addCase(fetchUsersThunk.fulfilled, (state, action: PayloadAction<UserInterface[]>) => {            
      const users = action.payload.filter(
        (el) => {
          if(state.onlyEnableUsers) {
            if(el.level === 1 || el.level === 0 ) return true;
            return el.office  ? (el.office as any).enable : false
          } else {
            return true
          }
        }
        
      )
      state.usersOriginal = users.slice()
      state.users = users
      state.gotUsers = true
    }).addCase(fetchSubadminsThunk.fulfilled, (state, action: PayloadAction<UserInterface[]>) => {
      state.audits = action.payload
    }).addCase(getLeadUsersThunk.fulfilled, (state, action) => {
      state.gotUsers = true
      state.users = action.payload
    }).addCase(updateUserOfficeThunk.pending, (state) => {
      state.modalChangeofficeState = undefined
    }).addCase(updateUserOfficeThunk.fulfilled, (state, action) => {
      const indexUser = state.users.findIndex((el) => el._id === action.payload._id)      
      if(indexUser !== -1) state.users[indexUser] = action.payload
    }).addCase(getLeadsForOfficeThunk.fulfilled, (state, action) => {
      state.leadsForOfficeChose = action.payload
    }).addCase(setUserLinkThunk.fulfilled, (state, action) => {
      const indexUser = state.users.findIndex((el) => el._id === action.payload._id)
      if(indexUser !== -1) state.users[indexUser] = action.payload
      state.dialogSetUserLink = undefined
    
    }).addCase(updateUserRankThunk.fulfilled, (state, action) => {
      const indexUser = state.users.findIndex((el) => el._id === state.userRankedForm.userId)
      if(indexUser !== -1) state.users[indexUser].rank = action.payload.rank
      state.displayFormRankedUser = false
      state.userRankedForm = userRankedFormInit
    })
    builder.addMatcher((action) => action.type.endsWith("/pending") && action.type.includes("UserList"), (state) => {
      state.loading = true
    }).addMatcher((action) => action.type.endsWith("/fulfilled") && action.type.includes("UserList"), (state)=> {
      state.loading = false
    
    })
  },
})



export const { setUserList, addUserToListAct, clearModalChangeOfficeStateAct, setModalChangeOfficeStateAct, updateInputNewOfficeAct, updateUserConnectedAct, filterByOfficeChosenAct, setLeadForUserAct, setDialogSetUserLinkAct, changeSearchStringAct, updateInputUserLinkAct, clearFilterUsersAct, displayUserRankedFormAct, updateInputUserRankedFormAct, changeOnlyEnableUsersAct}  
  = usersListSlice.actions


export default usersListSlice.reducer
