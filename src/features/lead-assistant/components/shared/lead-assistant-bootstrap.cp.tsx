import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { fetchProjectsThunk } from "../../../project/slice/projects.slice"
import { fetchFaqsThunk, fetchUnansweredThunk } from "../../slice/lead-assistant-faq.slice"
import { fetchRecoveryThunk } from "../../slice/lead-assistant-recovery.slice"
import {
  fetchActivationFormsThunk,
  fetchSettingsThunk,
} from "../../slice/lead-assistant-settings.slice"
import { fetchReadinessThunk, fetchTemplatesThunk } from "../../slice/lead-assistant-setup.slice"

/** Loads every lead-assistant resource once on mount (leaf subscription). */
export default function LeadAssistantBootstrapCP() {
  const dispatch = useAppDispatch()
  const hasProjects = useAppSelector((state) => state.projects.projects.length > 0)
  useEffect(() => {
    void dispatch(fetchSettingsThunk())
    void dispatch(fetchReadinessThunk())
    void dispatch(fetchTemplatesThunk(false))
    void dispatch(fetchFaqsThunk())
    void dispatch(fetchUnansweredThunk(0))
    void dispatch(fetchRecoveryThunk())
    void dispatch(fetchActivationFormsThunk())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])
  useEffect(() => {
    if (!hasProjects) {
      void dispatch(fetchProjectsThunk())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])
  return null
}
