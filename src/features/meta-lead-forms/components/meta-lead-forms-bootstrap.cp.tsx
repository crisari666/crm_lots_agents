import { useEffect } from "react"
import { useAppDispatch } from "../../../app/hooks"
import { fetchMetaLeadFormsThunk } from "../slice/meta-lead-forms.slice"

/** Loads registry + settings once on mount (leaf subscription). */
export default function MetaLeadFormsBootstrapCP() {
  const dispatch = useAppDispatch()
  useEffect(() => {
    void dispatch(fetchMetaLeadFormsThunk())
  }, [dispatch])
  return null
}
