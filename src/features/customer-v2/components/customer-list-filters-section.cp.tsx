import React, { useEffect, useMemo, useState } from "react"
import { Paper } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { listCustomerStepsV2, type CustomerStepV2 } from "../../steps-v2/services/customer-steps-v2.service"
import { getOfficesThunk } from "../../offices/offices-list/offices-list.slice"
import { fetchUsersThunk } from "../../users-list/slice/user-list.slice"
import {
  filterUsersForCustomerListPickers,
  shouldShowCustomerListOfficeFilter,
} from "../business-logic/resolve-customer-list-scope-user-ids"
import type { FilterFormState } from "../types/filter-form.types"
import CustomerListFiltersCP from "./customer-list-filters.cp"

export type CustomerListFiltersSectionCPProps = {
  draft: FilterFormState
  setDraft: React.Dispatch<React.SetStateAction<FilterFormState>>
  loading: boolean
  onSearch: () => void
}

export default function CustomerListFiltersSectionCP({
  draft,
  setDraft,
  loading,
  onSearch,
}: CustomerListFiltersSectionCPProps) {
  const dispatch = useAppDispatch()
  const currentUser = useAppSelector((s) => s.login.currentUser)
  const usersFromSlice = useAppSelector((s) =>
    s.users.usersOriginal.length > 0 ? s.users.usersOriginal : s.users.users,
  )
  const gotUsers = useAppSelector((s) => s.users.gotUsers)
  const offices = useAppSelector((s) => s.offices.offices)
  const gotOffices = useAppSelector((s) => s.offices.gotOffices)
  const [steps, setSteps] = useState<CustomerStepV2[]>([])

  const showOfficeFilter = shouldShowCustomerListOfficeFilter(currentUser)
  const pickerScopeInput = useMemo(
    () => ({
      currentUser,
      officeId: draft.officeId,
      users: usersFromSlice,
    }),
    [currentUser, draft.officeId, usersFromSlice],
  )
  const pickerUsers = useMemo(
    () => filterUsersForCustomerListPickers(usersFromSlice, pickerScopeInput),
    [pickerScopeInput, usersFromSlice],
  )
  const creatorUsers = useMemo(() => {
    const selectedId = draft.createdBy.trim()
    return pickerUsers.filter(
      (user) =>
        user._id &&
        ((user.level ?? 99) <= 4 || (selectedId !== "" && user._id === selectedId)),
    )
  }, [draft.createdBy, pickerUsers])

  useEffect(() => {
    if (!gotUsers) {
      void dispatch(fetchUsersThunk({ enable: true }))
    }
  }, [dispatch, gotUsers])

  useEffect(() => {
    if (showOfficeFilter && !gotOffices) {
      void dispatch(getOfficesThunk())
    }
  }, [dispatch, gotOffices, showOfficeFilter])

  useEffect(() => {
    void listCustomerStepsV2()
      .then((list) => {
        if (Array.isArray(list)) {
          setSteps(list)
        }
      })
      .catch(() => {
        setSteps([])
      })
  }, [])

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: "background.paper",
        mb: 2,
      }}
    >
      <CustomerListFiltersCP
        draft={draft}
        setDraft={setDraft}
        loading={loading}
        onSearch={onSearch}
        users={pickerUsers}
        creatorUsers={creatorUsers}
        steps={steps}
        showOfficeFilter={showOfficeFilter}
        offices={offices}
      />
    </Paper>
  )
}
