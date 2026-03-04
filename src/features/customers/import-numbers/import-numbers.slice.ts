import {  PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { ImportNumbersState } from "./import-numbers.state"
import { LeadNumbersPreviewInterface } from "../../../app/models/lead-numbers-preview.interface"
import { getAssignersReq, getOnlyLeadsReq } from "../../../app/services/users.service"
import { LeadsWithUsers, UsersWithCustomer } from "../../../app/models/leads-users-customer.interface"
import { getCurrentCampaignThunk } from "../../campaigns/current-campaign/current-campaign.slice"
import UserInterface from "../../../app/models/user-interface"
import { CustomerRowCSVI } from "../../../app/models/customer-row-csv"
import { updateCustomersWithUsersReq, uploadMultipleCustomerReq } from "../../../app/services/customer.service"
import { CustomerInterface } from "../../../app/models/customer.interface"
import { CampaignInterface } from "../../../app/models/campaign.interface"

const initialState: ImportNumbersState = {
  successDataImported: false,
  leadUsersMap: {},
  showDialogWithNumbersPreview: false,
  currentCampaign: {} as any,
  officesCampaigns: [],
  currentCampaignGot: false,
  loading: false,
  uploadedData: [],
  dataRow: [],
  recalculateData: false,
  leads: [],
  leadsId: {},
  mapLeadUserId: {}
}

export const getOnlyLeadsThunk = createAsyncThunk("ImportNumbers/getOnlyLeadsThunk", async () => await getOnlyLeadsReq())

export const getAssignersThunk = createAsyncThunk("ImportNumbers/getAssignersThunk", async () =>  await getAssignersReq())

export const importMultipleCustomersThunk = createAsyncThunk("ImportNumbers/importMultipleCustomersThunk", async ({ customers } : { customers : CustomerRowCSVI[]}): Promise<CustomerInterface[]> => await uploadMultipleCustomerReq({customers}))

export const addCustomerToUsersThunk = createAsyncThunk("ImportNumbers/addCustomerToUsersThunk", async ({ campaign, leadUserMap, projectId } : { campaign : CampaignInterface, leadUserMap: {[leadId: string]: LeadsWithUsers}, projectId: string}) => await updateCustomersWithUsersReq({campaignId: campaign._id, leadUsersMap: leadUserMap, projectId}))

export const ImportNumbersSlice = createSlice({
  name: "ImportNumbers",
  initialState,
  reducers: {
    setDataFromExcelAct (state, action: PayloadAction<LeadNumbersPreviewInterface[]>) {
      state.uploadedData = action.payload
    },
    setLeadUserMapAct (state, action: PayloadAction<{[leadId: string]: LeadsWithUsers}>) {
      state.leadUsersMap = action.payload
    },
    setDataRowsAct (state, action: PayloadAction<CustomerRowCSVI[]>) {
      state.dataRow = action.payload
    },
    distribuiteCustomersAct (state) {
      clearNumbers(state);
      for(const leadIndex in state.uploadedData) {

        const leadId = state.uploadedData[leadIndex]._id        
        const userIds = Object.keys(state.leadUsersMap[leadId].users)
        const nUsers = userIds.length
        //console.log({leadIndex,  userIds: JSON.parse(JSON.stringify(userIds)), usersLength: userIds.length});
        if(nUsers > 0 ) {
          let c  = 0;
          let indexNumber = 0;
          const numbersLength = state.uploadedData[leadIndex].numbers.length
          const expectedNumbers = getExpectedNumbers(state.leadUsersMap[leadId].users)

          // console.log({expectedNumbers, numbersLength, indexNumber});
          
          while(indexNumber < numbersLength) {
            // console.log({indexNumber, expectedNumbers, numbersLength, nUsers});
            let sumCounter = true
            const userId = userIds[c]
            const userData = state.leadUsersMap[leadId].users[userId]   
            
            if(userData !== undefined) {

              // console.log({userData});
              
              const maxToAssign = (userData._id as any).rank?.nCustomers ?? 0; 

              const customer = state.uploadedData[leadIndex].numbers[indexNumber]

              const currentCustomers = state.leadUsersMap[leadId].users[userId].customers.length 

              const addCustomer = customer.add === true
              // console.log({addCustomer});
              
              //console.log({c, addCustomer, indexNumber});
              if(addCustomer) {
                if(maxToAssign > 0 && currentCustomers < maxToAssign) {
                  state.leadUsersMap[leadId].users[userId].customers.push(customer)
                }  else {
                  sumCounter = false
                }
                

                c++;
                if(c === nUsers) c = 0
                // if(maxToAssign > 0) state.leadUsersMap[leadId].users[userId].customers.push(customer)
                // if(state.leadUsersMap[leadId].users[userId].customers.length === maxToAssign) {
                // c++;
                // }
              }
            
              // console.log({userData});
              // const maxToAssign = (userData._id as any).rank?.nCustomers ?? 0;  
              // state.uploadedData[leadIndex].numbers[indexNumber].user = userData.userDb;
              // const customer = state.uploadedData[leadIndex].numbers[indexNumber]
              // if(customer.add === true) {
              //   if(maxToAssign > 0) state.leadUsersMap[leadId].users[userId].customers.push(customer)
              //   if(state.leadUsersMap[leadId].users[userId].customers.length === maxToAssign) {
              //     c++;
              //   }
              // }
            }
            
            if(sumCounter) {
              indexNumber++
            } 
            if(indexNumber === numbersLength || expectedNumbers === indexNumber || (nUsers >= expectedNumbers &&  c === expectedNumbers -1)) {              
              break;
            }
          }
        }
        //if(leadIndex == '1') break;

      }
    },
    toggleAddCustomerToCampaignAct (state, action: PayloadAction<{leadIndex: number, customerIndex: number,  checked: boolean}>) {
      state.uploadedData[action.payload.leadIndex].numbers[action.payload.customerIndex].add = !state.uploadedData[action.payload.leadIndex].numbers[action.payload.customerIndex].add
      state.recalculateData = !state.recalculateData
    },
    closeDialogSuccessDataImportedAct (state) {
      state.successDataImported = false
    }
  },
  extraReducers(builder) {

    builder.addCase(getCurrentCampaignThunk.fulfilled, (state, action) => {
      state.currentCampaign = action.payload.campaign
      state.officesCampaigns = action.payload.officesCampaigns
      state.currentCampaignGot = true
    }).addCase(getAssignersThunk.fulfilled, (state, action) => {
      state.leads = action.payload
      const mapLeads: {[key: string] : UserInterface} = {}
      const mapLeadsUserId: {[key: string] : string} = {}
      for (let index in action.payload) {
        const lead = action.payload[index];
        if(mapLeads[lead._id!] == null) mapLeads[lead._id!] = lead
        if(mapLeadsUserId[lead.email] == null) mapLeadsUserId[lead.email] = lead._id!

      }
      state.leadsId = mapLeads
      state.mapLeadUserId = mapLeadsUserId
    }).addCase(importMultipleCustomersThunk.fulfilled, (state, action) => {
      const clients = action.payload
      const currentDataByLead = state.uploadedData;
      const currentDataByRows = state.dataRow;

      for (let index in clients) {
        const client = clients[index];
        const rowCSV = currentDataByRows.find(el => el.phone === client.phone)  
        if(rowCSV !== undefined) {
          rowCSV.customer = client
          rowCSV.add = true
          const userLead =  rowCSV.lead
          const indexLeadFromMap = currentDataByLead.findIndex(el => el.user === userLead)
          if(indexLeadFromMap !== -1) {
            const customerIndex = currentDataByLead[indexLeadFromMap].numbers.findIndex(el => el.phone === client.phone)
            if(customerIndex !== -1) {
              currentDataByLead[indexLeadFromMap].numbers[customerIndex].customer = client
              currentDataByLead[indexLeadFromMap].numbers[customerIndex].add = true
            }
          }
        }
        state.recalculateData = !state.recalculateData
      }
    }).addCase(addCustomerToUsersThunk.fulfilled, (state, action) => {
      clearNumbers(state)
      state.uploadedData = []
      state.successDataImported = true
    })

    builder.addMatcher((action) => action.type.endsWith('pending') && action.type.includes('ImportNumbers'), (state) => {
      state.loading = true
    }).addMatcher((action) => action.type.endsWith('fulfilled') && action.type.includes('ImportNumbers'), (state) => {
      state.loading = false
    })
  },
})

const getExpectedNumbers = (users: {[userId: string] : UsersWithCustomer}): number => {
  let sum = 0
  for(const userId in users) {
    const nCustomers = (users[userId]._id as any).rank?.nCustomers ?? 0
    sum += nCustomers
  }
  return sum;
}


const clearNumbers = (state: ImportNumbersState) => {
  for(const leadIndex in state.uploadedData) {
    const leadId = state.uploadedData[leadIndex]._id
    const userIds = Object.keys(state.leadUsersMap[leadId].users)
    let nUsers = userIds.length
    let counter = 0;
    if(userIds.length > 0) {
      for(const indexNumber in state.uploadedData[leadIndex].numbers) {
        const userId = userIds[counter]
        state.uploadedData[leadIndex].numbers[indexNumber].user = undefined
         state.leadUsersMap[leadId].users[userId].customers = []
        counter++;
        if(nUsers === counter) counter = 0
      }
    }
  }
}

export const { setDataFromExcelAct, setLeadUserMapAct, setDataRowsAct, toggleAddCustomerToCampaignAct, distribuiteCustomersAct, closeDialogSuccessDataImportedAct } = ImportNumbersSlice.actions

export default ImportNumbersSlice.reducer