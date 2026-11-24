import { combineReducers } from "@reduxjs/toolkit"
import faq from "./lead-assistant-faq.slice"
import recovery from "./lead-assistant-recovery.slice"
import settings from "./lead-assistant-settings.slice"
import setup from "./lead-assistant-setup.slice"
import simulator from "./lead-assistant-simulator.slice"

const leadAssistantReducer = combineReducers({
  setup,
  settings,
  faq,
  recovery,
  simulator,
})

export default leadAssistantReducer
