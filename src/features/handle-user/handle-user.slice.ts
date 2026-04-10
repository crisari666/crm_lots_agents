import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import UserInterface from "../../app/models/user-interface"
import { generateContractReq, type GenerateContractPayload } from "../../app/services/google.service"
import { getLeadForOfficeReq, getUserByIdReq, getUserDocsReq, sendUserService, sendWelcomeAccessEmailReq, setUserGoalReq, setUserLeaveDateReq, setUserPhysicalReq, toggleEnableUserReq, updateUserService, uploadUserDocReq, type UserCreateRequestBody } from "../../app/services/users.service"
import { leadFieldToId, officeFieldToId } from "./user-field-ids"
import { pushAlertAction } from "../dashboard/dashboard.slice"
import { store } from "../../app/store"
import { HandleUserState } from "./handle-user-state.interface"
import { addUserToListAct } from "../users-list/slice/user-list.slice"
import { handleUserStrings as hu } from "../../i18n/locales/handle-user.strings"

const initUser: UserInterface =  {
  name: "", 
  percentage: 0,
  email: '',
  lastName: "",
  phone: "",
  password: "", 
  level: 4,
  office: "",
  enable: true,
  link: "",
  phoneJob: "",
  document: "",
  city: "",
  connected: false,
  root: false
}

function buildCreateUserRequestBody(u: UserInterface): UserCreateRequestBody {
  const body: UserCreateRequestBody = {
    name: u.name.trim(),
    lastName: u.lastName.trim(),
    email: u.email.trim(),
    phone: (u.phone ?? "").trim(),
    level: u.level ?? 4,
  }
  if (u.percentage !== undefined && u.percentage !== null && !Number.isNaN(Number(u.percentage))) {
    body.percentage = Number(u.percentage)
  }
  const pj = (u.phoneJob ?? "").trim()
  if (pj !== "") body.phoneJob = pj
  const doc = (u.document ?? "").trim()
  if (doc !== "") body.document = doc
  const pw = (u.password ?? "").trim()
  if (pw !== "") body.password = pw
  const oid = officeFieldToId(u.office)
  if (oid !== "") body.office = oid
  const lid = leadFieldToId(u.lead)
  if (lid !== "") body.lead = lid
  body.city = (u.city ?? "").trim()
  return body
}

const initialState: HandleUserState = {
  created: false, loading: false,
  currentUser:initUser, 
  showPass: false,
  leadsForOffice: [],
}

export const fetchUserByIdThunk = createAsyncThunk( "handleUser/setUserById", async (userId: string) => {
    const user = await getUserByIdReq(userId)
    if(user.office !== null) store.dispatch(getLeadForOfficeThunk({officeId: user.office as string, settedLead: user.lead as string}))
    return {user}
  },
)

export const getLeadForOfficeThunk = createAsyncThunk("HandleUser/getLeadForOffice", async ({ officeId, settedLead } : { officeId : string, settedLead?: string}): Promise<{leads: UserInterface[], settedLead: string}> => {
  const leads = await getLeadForOfficeReq({officeId})
  return {leads, settedLead: settedLead ?? ""}
})

export const createUserThunk = createAsyncThunk("handleUser/createUser",  async(dataUser: UserInterface) : Promise<UserInterface | undefined> => {
  try {
    const createUser = await sendUserService({ user: buildCreateUserRequestBody(dataUser) })
    store.dispatch(addUserToListAct(createUser))
    return createUser
  } catch (error) {
    store.dispatch(pushAlertAction({message: String(error), title: hu.errorCreateUserTitle}))
  }
})

export const uploadUserDocThunk = createAsyncThunk( "handleUser/uploadUserDocThunk", async (params : {userId: string, documentType: string, file: any}) => await uploadUserDocReq(params))

export const updateUserTnunk = createAsyncThunk("handleUser/updateUser", async({dataUser, userId}:{dataUser: UserInterface, userId: string}) => {
  try {
    const { name, lastName, email, phone, password, level, phoneJob, lead, office, connected, percentage, enable, link, root, document, city } = dataUser
    const updateUser = await updateUserService({
      user: {
        name,
        lastName,
        email,
        phone,
        level: level ?? 4,
        phoneJob: (phoneJob ?? "").trim(),
        lead: leadFieldToId(lead),
        office: officeFieldToId(office),
        connected,
        percentage,
        enable,
        link,
        root,
        password: password !== "" && password !== undefined ? password : undefined,
        document: (document ?? "").trim(),
        city: (city ?? "").trim(),
      },
      userId,
    })
    if(updateUser === true){
      return true
    }
    store.dispatch(pushAlertAction({message: String(updateUser), title: String(updateUser)}))
    return updateUser
  } catch (error) {
    store.dispatch(pushAlertAction({message: String(error), title: hu.errorUpdateUserTitle}))
    return undefined
  }
})

export const toggleEnableUserThunk = createAsyncThunk( "handleUser/toggleEnableUserThunk", async (params : {userId: string, enable: boolean}) =>  await toggleEnableUserReq(params))

export const setUserPhysicalThunk = createAsyncThunk(
  "handleUser/setUserPhysical",
  async (params: { userId: string, physical: boolean }) => setUserPhysicalReq(params)
)

export const getUserDocsThunk = createAsyncThunk( "handleUser/getUserDocsReq", async (userId: string) => await getUserDocsReq({userId}))

export const setUserLeaveDateThunk = createAsyncThunk( "handleUser/setUserLeaveDateThunk", async (PARAM: {userId: string, date: string}) => await setUserLeaveDateReq({userId: PARAM.userId, leaveDate: PARAM.date}))

export const setUserGoalThunk = createAsyncThunk( "handleUser/setUserGoalThunks", async (PARAM: {userId: string, goal: number}) => await setUserGoalReq(PARAM))

export const sendWelcomeAccessEmailThunk = createAsyncThunk(
  "handleUser/sendWelcomeAccessEmail",
  async (userId: string) => sendWelcomeAccessEmailReq(userId),
)

export const sendUserContractThunk = createAsyncThunk(
  "handleUser/sendUserContract",
  async (payload: GenerateContractPayload) => generateContractReq(payload),
)

export const HandleUserSlice = createSlice({
  name: "handleUser",
  initialState,
  reducers: {
    fetchUser: (state, action: PayloadAction<{ user: UserInterface }>) => {
      state.currentUser = action.payload.user
    },
    userCreated: (state, action: PayloadAction) => {
      state.created = true
    },
    changeInputUserFormActionAct: (state, action: PayloadAction<{name: string, val: any}>) => {
      state.currentUser![action.payload.name] = action.payload.val
    },
    removeCurrentUserAction: (state) => {
      state.currentUser = initUser
    },
    toggleShowPassAct: (state) => {
      state.showPass = !state.showPass
    },
    setUserIdAction: (state, action: PayloadAction<string | undefined>) => {
      state.userId = action.payload
    },
    resetHandleUserStateAction: (state) => {
      state.currentUser = initUser
      state.created = false
    },
    setDialogUploadUserDocAction: (state, action: PayloadAction<{documentType: string} | undefined>) => {
      if(action.payload !== undefined){
        state.dialogUploadUserDoc = action.payload
      }else {
        state.dialogUploadUserDoc = undefined
      }
    }
  },
  extraReducers(builder) {
    builder.addCase(createUserThunk.fulfilled, (state, action) => {
      if(action.payload !== undefined)  state.created = true
    }).addCase(updateUserTnunk.fulfilled, (state, action) => {
      if (action.payload === true) state.created = true
    }).addCase(fetchUserByIdThunk.pending, (state) => {state.loading = true})
    .addCase(fetchUserByIdThunk.fulfilled , (state, action: PayloadAction<{ user: UserInterface }>) => {
      state.currentUser = action.payload.user
      state.currentUser.password = ""
    }).addCase(getLeadForOfficeThunk.fulfilled, (state, action) => {
      state.leadsForOffice = action.payload.leads
      state.currentUser!.lead = action.payload.settedLead
    }).addCase(toggleEnableUserThunk.fulfilled, (state, action) => {
      state.currentUser!.enable = action.payload.enable
    }).addCase(setUserPhysicalThunk.fulfilled, (state, action) => {
      if (state.currentUser && action.payload?.physical !== undefined) {
        state.currentUser.physical = action.payload.physical
      }
    }).addCase(getUserDocsThunk.fulfilled, (state, action) => {      
      state.userDocs = action.payload
     }).addCase(uploadUserDocThunk.fulfilled, (state, action) => {
      state.userDocs = action.payload
      state.dialogUploadUserDoc = undefined
     }).addCase(setUserLeaveDateThunk.fulfilled, (state, action) => {
        state.currentUser!.leaveDate = action.payload.leaveDate
     }).addCase(setUserGoalThunk.fulfilled, (state, action) => {
        state.currentUser!.goal = action.payload.goal
     })
    .addCase(sendWelcomeAccessEmailThunk.fulfilled, (state) => {
      if (state.currentUser) {
        state.currentUser.hasPassword = false
      }
    })
 
    builder.addMatcher((action) => action.type.endsWith("/pending") && action.type.includes("handleUser"), 
      (state) => {
        state.loading = true
    }).addMatcher((action) => action.type.endsWith("/fulfilled") && action.type.includes("handleUser"), 
      (state) => {
      state.loading = false
    })
  },
})


export const { fetchUser, userCreated, removeCurrentUserAction, resetHandleUserStateAction, setUserIdAction, changeInputUserFormActionAct, toggleShowPassAct, setDialogUploadUserDocAction } = HandleUserSlice.actions

export default HandleUserSlice.reducer
