/* eslint-disable react-hooks/exhaustive-deps */
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { useParams } from "react-router-dom"
import {
  changeInputUserFormActionAct,
  createUserThunk,
  fetchUserByIdThunk,
  removeCurrentUserAction,
  toggleShowPassAct,
  updateUserTnunk,
} from "../handle-user.slice"
import { useEffect, type FormEvent } from "react"
import { RootState } from "../../../app/store"
import AppTextField from "../../../app/components/app-textfield"
import { ExpandMore, Visibility, VisibilityOff } from "@mui/icons-material"
import UserOfficeSelector from "./office-selector"
import OfficeLeadSelector from "./office-lead-selector"
import { getOfficesThunk } from "../../offices/offices-list/offices-list.slice"
import { handleUserStrings as s } from "../../../i18n/locales/handle-user.strings"
import { pushAlertAction } from "../../dashboard/dashboard.slice"
import { officeFieldToId } from "../user-field-ids"

const levelsForOffice = [2, 3, 4, 5, 6]

export default function UserForm() {
  let { userId } = useParams()
  const { currentUser: userLogged } = useAppSelector((state: RootState) => state.login)
  const { currentUser, showPass } = useAppSelector((state: RootState) => state.handleUser)
  const { offices, gotOffices } = useAppSelector((state: RootState) => state.offices)

  const dispatch = useAppDispatch()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const u = currentUser!
    if (!u.name?.trim() || !u.lastName?.trim() || !u.email?.trim() || !u.phone?.trim() || u.level === undefined || u.level === null) {
      dispatch(pushAlertAction({ message: s.validationRequiredFields, title: s.validationTitle }))
      return
    }
    if (levelsForOffice.includes(u.level) && officeFieldToId(u.office) === "") {
      dispatch(pushAlertAction({ message: s.validationOfficeRequired, title: s.validationTitle }))
      return
    }
    if (userId !== undefined) {
      dispatch(updateUserTnunk({ dataUser: u, userId: userId! }))
    } else {
      dispatch(createUserThunk(u))
    }
  }

  useEffect(() => {
    if (!gotOffices) {
      dispatch(getOfficesThunk())
    }
  }, [])

  const handleChangeInput = ({ name, val }: { name?: string | undefined, val: any }) => {
    dispatch(changeInputUserFormActionAct({ name: name!.toString(), val }))
  }

  useEffect(() => {
    if (userId !== undefined) {
      dispatch(fetchUserByIdThunk(userId as string))
    } else {
      dispatch(removeCurrentUserAction())
    }
  }, [userId, dispatch])

  const officeSelectValue = officeFieldToId(currentUser?.office)

  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography variant="subtitle1">{s.formSectionTitle}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <AppTextField
                required
                label={s.fieldFirstName}
                name="name"
                value={currentUser!.name}
                onChange={handleChangeInput}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <AppTextField
                required
                label={s.fieldLastName}
                name="lastName"
                value={currentUser!.lastName}
                onChange={handleChangeInput}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <AppTextField
                required
                label={s.fieldEmail}
                name="email"
                value={currentUser!.email}
                onChange={handleChangeInput}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <AppTextField
                required
                label={s.fieldPhone}
                name="phone"
                value={currentUser!.phone}
                onChange={handleChangeInput}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <AppTextField
                label={s.fieldPhoneJob}
                name="phoneJob"
                value={currentUser!.phoneJob}
                onChange={handleChangeInput}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <AppTextField
                label={s.fieldDocument}
                name="document"
                value={currentUser!.document ?? ""}
                onChange={handleChangeInput}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <AppTextField
                label={s.fieldPassword}
                type={showPass ? "text" : "password"}
                name="password"
                value={currentUser!.password}
                onChange={handleChangeInput}
                endComponent={
                  <IconButton type="button" onClick={() => dispatch(toggleShowPassAct())} aria-label="toggle password">
                    {showPass ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                }
              />
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                {s.fieldPasswordHelper}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <AppTextField
                label={s.fieldPercentage}
                type="number"
                name="percentage"
                value={currentUser!.percentage}
                onChange={handleChangeInput}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth size="small" required>
                <InputLabel id="handle-user-level-label">{s.fieldLevel}</InputLabel>
                <Select
                  labelId="handle-user-level-label"
                  label={s.fieldLevel}
                  name="level"
                  value={currentUser!.level}
                  onChange={(e) =>
                    handleChangeInput({ name: "level", val: Number(e.target.value) })
                  }
                >
                  {userLogged?.level === 0 && <MenuItem value={0}>{s.levelAdmin}</MenuItem>}
                  {userLogged?.level === 0 && <MenuItem value={1}>{s.levelSubAdmin}</MenuItem>}
                  <MenuItem value={2}>{s.levelMainLead}</MenuItem>
                  <MenuItem value={3}>{s.levelLead}</MenuItem>
                  <MenuItem value={4}>{s.levelVentor}</MenuItem>
                  {userLogged?.level === 0 && <MenuItem value={6}>{s.levelOffice}</MenuItem>}
                  {userLogged?.level === 0 && <MenuItem value={7}>{s.levelFinance}</MenuItem>}
                  {userLogged?.level === 0 && <MenuItem value={8}>{s.levelSecretary}</MenuItem>}
                  {userLogged?.level === 0 && <MenuItem value={9}>{s.levelAssigner}</MenuItem>}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />
          {levelsForOffice.includes(currentUser?.level!) && (
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} md={6}>
                <UserOfficeSelector offices={offices} office={officeSelectValue} />
              </Grid>
              {currentUser?.level === 4 && (
                <Grid item xs={12} md={6}>
                  <OfficeLeadSelector />
                </Grid>
              )}
            </Grid>
          )}
          <Button color="primary" variant="contained" fullWidth type="submit">
            {s.formSubmit}
          </Button>
        </form>
      </AccordionDetails>
    </Accordion>
  )
}
