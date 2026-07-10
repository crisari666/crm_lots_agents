import React, { useCallback, useState } from "react"
import { Box } from "@mui/material"
import { useAppSelector } from "../../../app/hooks"
import CustomerControlsCP from "../components/customer-controls.cp"
import CustomerListCP from "../components/customer-list.cp"
import CustomerListFiltersSectionCP from "../components/customer-list-filters-section.cp"
import { emptyFilters, type FilterFormState } from "../types/filter-form.types"

export default function CustomersPage() {
  const listLoading = useAppSelector((s) => s.customerV2.listLoading)
  const [listVersion, setListVersion] = useState(0)
  const [draft, setDraft] = useState<FilterFormState>(emptyFilters)
  const [applied, setApplied] = useState<FilterFormState>(emptyFilters)

  const applyFilters = useCallback(() => {
    setApplied({
      excludeFecha: draft.excludeFecha,
      unassignedOnly: draft.unassignedOnly,
      enabledOnly: draft.enabledOnly,
      referralOnly: draft.referralOnly,
      createdFrom: draft.createdFrom ? draft.createdFrom.clone() : null,
      createdTo: draft.createdTo ? draft.createdTo.clone() : null,
      officeId: draft.officeId,
      assignedTo: draft.assignedTo,
      createdBy: draft.createdBy,
      search: draft.search,
      customerStepId: draft.customerStepId,
    })
  }, [draft])

  const patchFilterDraft = useCallback(
    (
      patch: Partial<
        Pick<
          FilterFormState,
          "excludeFecha" | "unassignedOnly" | "enabledOnly" | "referralOnly"
        >
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
          referralOnly: draft.referralOnly,
        }}
        onFilterDraftChange={patchFilterDraft}
      />
      <CustomerListFiltersSectionCP
        draft={draft}
        setDraft={setDraft}
        loading={listLoading}
        onSearch={applyFilters}
      />
      <CustomerListCP applied={applied} refreshVersion={listVersion} />
    </Box>
  )
}
