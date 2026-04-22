import React, { useCallback, useState } from "react"
import { Box } from "@mui/material"
import CustomerControlsCP from "../components/customer-controls.cp"
import CustomerListCP from "../components/customer-list.cp"
import { emptyFilters, type FilterFormState } from "../types/filter-form.types"

export default function CustomersPage() {
  const [listVersion, setListVersion] = useState(0)
  const [draft, setDraft] = useState<FilterFormState>(emptyFilters)
  const [applied, setApplied] = useState<FilterFormState>(emptyFilters)

  const applyFilters = useCallback(() => {
    setApplied({
      excludeFecha: draft.excludeFecha,
      unassignedOnly: draft.unassignedOnly,
      enabledOnly: draft.enabledOnly,
      createdFrom: draft.createdFrom ? draft.createdFrom.clone() : null,
      createdTo: draft.createdTo ? draft.createdTo.clone() : null,
      assignedTo: draft.assignedTo,
      search: draft.search,
      customerStepId: draft.customerStepId,
    })
  }, [draft])

  const patchFilterDraft = useCallback(
    (
      patch: Partial<
        Pick<FilterFormState, "excludeFecha" | "unassignedOnly" | "enabledOnly">
      >
    ) => {
      setDraft((prev) => ({
        ...prev,
        ...patch,
        ...(patch.unassignedOnly === true ? { assignedTo: "" } : {}),
      }))
    },
    []
  )

  return (
    <Box sx={{ p: 3 }}>
      <CustomerControlsCP
        onCustomerCreated={() => setListVersion((v) => v + 1)}
        filterDraft={{
          excludeFecha: draft.excludeFecha,
          unassignedOnly: draft.unassignedOnly,
          enabledOnly: draft.enabledOnly,
        }}
        onFilterDraftChange={patchFilterDraft}
      />
      <CustomerListCP
        draft={draft}
        setDraft={setDraft}
        applied={applied}
        onApplyFilters={applyFilters}
        refreshVersion={listVersion}
      />
    </Box>
  )
}
