import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  changeOwnPasswordReq,
  confirmEmailChangeReq,
  getOwnProfileReq,
  patchOwnProfileReq,
  requestEmailChangeReq,
} from '../services/profile.service'
import { OwnProfile } from '../types/own-profile.type'

export type UserProfileState = {
  profile: OwnProfile | undefined
  loading: boolean
  savingProfile: boolean
  savingPassword: boolean
  requestingEmailCode: boolean
  confirmingEmail: boolean
  error: string | undefined
}

const initialState: UserProfileState = {
  profile: undefined,
  loading: false,
  savingProfile: false,
  savingPassword: false,
  requestingEmailCode: false,
  confirmingEmail: false,
  error: undefined,
}

export const fetchOwnProfileThunk = createAsyncThunk(
  'userProfile/fetchOwnProfile',
  async () => await getOwnProfileReq(),
)

export const patchOwnProfileThunk = createAsyncThunk(
  'userProfile/patchOwnProfile',
  async (payload: Partial<Pick<OwnProfile, 'name' | 'lastName' | 'phone'>>) => {
    await patchOwnProfileReq(payload)
    return payload
  },
)

export const requestEmailChangeThunk = createAsyncThunk(
  'userProfile/requestEmailChange',
  async (newEmail: string) => {
    await requestEmailChangeReq(newEmail)
    return newEmail
  },
)

export const confirmEmailChangeThunk = createAsyncThunk(
  'userProfile/confirmEmailChange',
  async (params: { newEmail: string; code: string }) => {
    await confirmEmailChangeReq(params)
    return params.newEmail
  },
)

export const changeOwnPasswordThunk = createAsyncThunk(
  'userProfile/changeOwnPassword',
  async (params: { currentPassword: string; newPassword: string }) => {
    await changeOwnPasswordReq(params)
  },
)

export const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    clearUserProfileErrorAct: (state) => {
      state.error = undefined
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOwnProfileThunk.pending, (state) => {
        state.loading = true
        state.error = undefined
      })
      .addCase(fetchOwnProfileThunk.fulfilled, (state, action) => {
        state.loading = false
        state.profile = action.payload
      })
      .addCase(fetchOwnProfileThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(patchOwnProfileThunk.pending, (state) => {
        state.savingProfile = true
        state.error = undefined
      })
      .addCase(patchOwnProfileThunk.fulfilled, (state, action) => {
        state.savingProfile = false
        if (state.profile != null) {
          state.profile = { ...state.profile, ...action.payload }
        }
      })
      .addCase(patchOwnProfileThunk.rejected, (state, action) => {
        state.savingProfile = false
        state.error = action.error.message
      })
      .addCase(requestEmailChangeThunk.pending, (state) => {
        state.requestingEmailCode = true
        state.error = undefined
      })
      .addCase(requestEmailChangeThunk.fulfilled, (state) => {
        state.requestingEmailCode = false
      })
      .addCase(requestEmailChangeThunk.rejected, (state, action) => {
        state.requestingEmailCode = false
        state.error = action.error.message
      })
      .addCase(confirmEmailChangeThunk.pending, (state) => {
        state.confirmingEmail = true
        state.error = undefined
      })
      .addCase(confirmEmailChangeThunk.fulfilled, (state, action) => {
        state.confirmingEmail = false
        if (state.profile != null) {
          state.profile = { ...state.profile, email: action.payload }
        }
      })
      .addCase(confirmEmailChangeThunk.rejected, (state, action) => {
        state.confirmingEmail = false
        state.error = action.error.message
      })
      .addCase(changeOwnPasswordThunk.pending, (state) => {
        state.savingPassword = true
        state.error = undefined
      })
      .addCase(changeOwnPasswordThunk.fulfilled, (state) => {
        state.savingPassword = false
      })
      .addCase(changeOwnPasswordThunk.rejected, (state, action) => {
        state.savingPassword = false
        state.error = action.error.message
      })
  },
})

export const { clearUserProfileErrorAct } = userProfileSlice.actions
export default userProfileSlice.reducer
