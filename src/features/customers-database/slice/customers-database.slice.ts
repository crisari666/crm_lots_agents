import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { OfficeInterface } from "../../../app/models/office.inteface"
import UserInterface from "../../../app/models/user-interface"
import { getCurrentCampaignReq } from "../../../app/services/campaign.service"
import { assignCustomerDatabaseToUsersReq, getCustomersDatabaseReq } from "../../../app/services/customer.service"
import { CustomersDatabaseState, UserWithCustomersDatabaseType, UserAssignedWithCustomers } from "./customer-disabled.state"
import { store } from "../../../app/store"
import { pushAlertAction } from "../../dashboard/dashboard.slice"

const initialState: CustomersDatabaseState = {
  loading: false,
  customers: [],
  rowCustomers: [],
  officesCampaignsWithUsersWithCustomers: [],
  customersAssigned: false,
  userWithCustomers: [],
  expectedNumbers: 0,
  normalCampaign: true,
  officesCampaigns: [],
}
export const getDisabledCustomersThunk = createAsyncThunk( "CustomersDatabase/getDisabledCustomers", async ({endDate, fromDate, limit, term} : {fromDate: string, endDate: string, limit: number, term?: string}) => await getCustomersDatabaseReq({endDate, fromDate, limit, term}))

export const getOfficesCampaignsDisabledThunk = createAsyncThunk( "CustomersDatabase/getOfficesCampaignsDisabledThunk", async ( ) =>
  await getCurrentCampaignReq()
)

export const assignCustomerDatabaseToUsersThunk = createAsyncThunk( "CustomersDatabase/assignCustomerDatabaseToUsersThunk", async (data: UserWithCustomersDatabaseType[]) => 
{
  try {
    const nAssigned = await assignCustomerDatabaseToUsersReq(data)
    store.dispatch(pushAlertAction({message: `Se asignaron ${nAssigned} clientes`, title: "Operacion exitosa", type: "success"}))
    return true
  } catch (error) {
    store.dispatch(pushAlertAction({message: `No se pudieron aasignar los clietnes, intenta de nuevo`, title: "Error en operacion", type: "error"}))
  }
})

export const CustomersDatabaseSlice = createSlice({
  name: "CustomersDatabase",
  initialState,
  reducers: {
    checkCustomerDisabledAct: (state, action: PayloadAction<{index: number, checked: boolean}>) => {
      state.rowCustomers[action.payload.index].checked = action.payload.checked
      distributeCustomers(state)
    },changeCampaignKindToAssignAct: (state) => {
      state.normalCampaign = !state.normalCampaign
      distributeUsers(state)
      distributeCustomers(state)
    },
    assignTotalExpectedNumbersAct: (state, action: PayloadAction<{index: number, expectedNumbers: number}>) => {
      if(state.rowCustomers.length > 0) {
        console.log("Step 1");
        
        for(let i = 0; i < action.payload.expectedNumbers; i++) {
          if(state.rowCustomers[i] === undefined) break;
          
          state.rowCustomers[i].checked = true
        }
        console.log("Step 2");
        distributeCustomers(state)
        console.log("Step 3");
      }
    },
    toggleAddCustomerToOfficeAct: (state, action: PayloadAction<{index: number, checked: boolean}>) => {
      state.officesCampaigns[action.payload.index].checked = action.payload.checked
      distributeUsers(state)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getDisabledCustomersThunk.fulfilled, (state, action) => {
      state.rowCustomers = action.payload
      distributeCustomers(state)
    }).addCase(getOfficesCampaignsDisabledThunk.fulfilled, (state, action) => {
      const officesCampaigns = action.payload.officesCampaigns.map((o) => ({...o, checked: false}))
      state.officesCampaigns = officesCampaigns
      distributeUsers(state)
      distributeCustomers(state)
    }).addCase(assignCustomerDatabaseToUsersThunk.fulfilled, (state) => {
      state.customersAssigned = true;
      state.userWithCustomers = []
    }).addCase(getDisabledCustomersThunk.pending, (state, action) => {
      state.customersAssigned = false;
    })

    builder.addMatcher((action) => action.type.endsWith("/pending") && action.type.includes("CustomersDatabase"), (state) => {
      state.loading = true
    }).addMatcher((action) => action.type.endsWith("/fulfilled") && action.type.includes("CustomersDatabase"), (state) => {
      state.loading = false
    })
  },
})

const distributeUsers = (state: CustomersDatabaseState): void => {
  let userWithCustomers: UserAssignedWithCustomers[] = []
  let expectedNumbers = 0
  const officesCampaignsWithUsersWithCustomers = state.officesCampaigns.map((officeCampaign) => {
    const {office, user, users: _users, _id, usersDatabase, checked} = officeCampaign
    let users: any[] = []
    if(checked) {
      const usersPicked = !state.normalCampaign ? usersDatabase : _users
      users = usersPicked.map((u, i) => {
        const {_id, lastName, name, rank} = u as UserInterface
        expectedNumbers += Number(rank?.nCustomersDatabase ?? 0)
        return ({_id, lastName, name, customers: [], rank, office: (office as unknown as any)._id}) as unknown as UserAssignedWithCustomers
      })        
      userWithCustomers.push(...users)
    } else {
      users = []
    }
    return ({office: office as unknown as OfficeInterface, lead: user as unknown as UserInterface, users, _id})
  })
  state.officesCampaignsWithUsersWithCustomers = (officesCampaignsWithUsersWithCustomers as any[]).sort((a, b) => {
    if(a.users.length < b.users.length) return 1
    if(a.users.length > b.users.length) return -1
    return 0
  })
  state.expectedNumbers = expectedNumbers
  state.userWithCustomers = userWithCustomers
}

const distributeCustomers = async (state: CustomersDatabaseState): Promise<void> => {
  for (const i in state.userWithCustomers) {
    state.userWithCustomers[i].customers = []
  }
  const maxIndexUsers = state.rowCustomers.length;
  const customers = state.rowCustomers.filter((c) => c.checked)

  let currentIndexUser = 0
  for(const customerIndex in customers) {
    const currentUser = state.userWithCustomers[currentIndexUser];
    const c = customers[customerIndex]

    const maxCustomersToAssign = currentUser?.rank?.nCustomersDatabase ?? 0
    if(maxCustomersToAssign === 0) {
      currentIndexUser ++;
    } else {
      currentUser.customers.push(c);
      const currentNCustomers = currentUser.customers.length;
      if(currentNCustomers === maxCustomersToAssign) currentIndexUser ++;
      if(currentIndexUser > maxIndexUsers) break;
    }
  }
}
export const { checkCustomerDisabledAct, changeCampaignKindToAssignAct, toggleAddCustomerToOfficeAct, assignTotalExpectedNumbersAct } =CustomersDatabaseSlice.actions
export default CustomersDatabaseSlice.reducer