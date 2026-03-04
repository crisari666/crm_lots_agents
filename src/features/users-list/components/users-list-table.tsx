/* eslint-disable react-hooks/exhaustive-deps */
import { ArrowDownward, BuildCircle, Edit, History, HistoryToggleOff, Link as LinkIcon, Logout, PeopleOutline, RoomPreferences } from "@mui/icons-material"
import { Button, ButtonGroup, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { RootState } from "../../../app/store"
import { useEffect } from "react"
import { displayUserRankedFormAct, fetchUsersThunk, getLeadsForOfficeThunk, logoutUserMobileThunk, setDialogSetUserLinkAct, setModalChangeOfficeStateAct, updateInputUserRankedFormAct } from "../slice/user-list.slice"
import { Link, useNavigate } from "react-router-dom"
import UserInterface, { OfficeDataNameI } from "../../../app/models/user-interface"
import ModalUpdateOffice from "./modal-update-office"
import SettingsInputAntennaIcon from '@mui/icons-material/SettingsInputAntenna';
import LoadingIndicator from "../../../app/components/loading-indicator"
import { getUserLevelDesc } from "../../../utils/user.utils"
import { dateUTCToFriendly } from "../../../utils/date.utils"
import { setUserIdSessionsLogAct } from "../../user-sessions-logs/slice/user-sessions.slice"
import UserSessionsDialog from "../../user-sessions-logs/user-sessions-dialog"
import TableResumeUsers from "./table-resume-users"
import DialogSetUserLink from "./dialog-set-user-link"

export default function UsersListTable(){

  const { users, gotUsers, loading } = useAppSelector((state: RootState) => state.users)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { currentUser } = useAppSelector((state:RootState) => state.login)

  /** Only root can edit another root; non-root cannot edit root. */
  const canEditUser = (user: UserInterface) =>
    !user.root || (user.root && currentUser?.root === true)

  useEffect(() => {
    if(users.length === 0 && gotUsers === false){
      setTimeout(() => {
        dispatch(fetchUsersThunk({enable: true}))
      }, 1000)
    }
  }, [users, gotUsers])

  const goToEditUser = (userId: string) => navigate(`/dashboard/handle-user/${userId}`)

  const goToUserList = (userId: string) => navigate(`/dashboard/offices-list/${userId}`)

  const padd0 = {padding: "2px"}

  const changeUsesOffice = (user: UserInterface) => {
    dispatch(setModalChangeOfficeStateAct({
      office:  (user.office! as OfficeDataNameI)._id, 
      userId: user._id!, 
      userName: user.name, 
      newOffice: (user.office! as OfficeDataNameI)._id, 
      lead: user.lead ?? ''})
    )
    if(user.office) dispatch(getLeadsForOfficeThunk({officeId: (user.office! as OfficeDataNameI)._id}))
  }

  return (
    <>
      <LoadingIndicator open={loading}/>
      <DialogSetUserLink/>
      <ModalUpdateOffice/>
      <UserSessionsDialog/>
      <TableResumeUsers/>
      <TableContainer sx={{height: '600px'}}>

        <Table stickyHeader padding="none">
          <TableHead>
            <TableRow>
              <TableCell> <SettingsInputAntennaIcon /> </TableCell>
              <TableCell>Level</TableCell>
              <TableCell>User</TableCell>
              {currentUser?.level === 0 && <TableCell>Name</TableCell>}
              <TableCell>Job</TableCell>
              <TableCell align="center">Office</TableCell>
              <TableCell align="center">Lead</TableCell>
              {currentUser!.level === 0 && <TableCell align="center"> <BuildCircle/> </TableCell>}
              <TableCell align="center"> <History/> </TableCell>
              {currentUser!.level! < 3 && <TableCell align="center"> <LinkIcon/> </TableCell>}
              {currentUser!.level! < 3 && <TableCell align="center"> <Logout/> </TableCell>}

            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((el, i) => {
              return (
                <TableRow key={"user"+el._id}>
                  <TableCell>
                    <Tooltip title={el.lastConnection ? dateUTCToFriendly(el.lastConnection) : ''}>
                      <SettingsInputAntennaIcon color={el.connected ? "success" : "error"} /> 
                    </Tooltip>
                  </TableCell>
                  <TableCell padding="checkbox"> {getUserLevelDesc( el.level!)} </TableCell>
                  <TableCell padding="checkbox">{el.email}</TableCell>
                  {currentUser?.level === 0 && <TableCell padding="checkbox">{el.name}</TableCell>}
                  <TableCell padding="checkbox" sx={{whiteSpace: "nowrap"}}>{el.lastName}</TableCell>
                  <TableCell padding="none" align="center"> 
                    <ButtonGroup size="small">
                      {el.office && <Button size="small" disabled variant="outlined"> {(el.office! as OfficeDataNameI).name} </Button>}
                      {currentUser!.level === 0 && <Button size="small" color="warning" variant="outlined" onClick={() => changeUsesOffice(el)}> <RoomPreferences fontSize="small"/> </Button>}

                    </ButtonGroup>
                  </TableCell>
                  <TableCell align="center">
                    {el.lead && (el.lead as any).name}
                  </TableCell>
                  
                  {currentUser!.level === 0 && <TableCell padding="checkbox" align="center" sx={{whiteSpace: "nowrap"}}>
                    {el.level === 2 && <IconButton LinkComponent={'a'} size="small" sx={padd0} color="info" onClick={() => goToUserList(el._id!)}> <PeopleOutline fontSize="small" /> </IconButton> }
                    {canEditUser(el) ? (
                      <Link to={`/dashboard/handle-user/${el._id!}`}> <Edit color="primary" fontSize="small"/> </Link>
                    ) : (
                      <Tooltip title="Solo un usuario root puede editar a otro usuario root">
                        <span><Edit color="disabled" fontSize="small"/></span>
                      </Tooltip>
                    )}
                  </TableCell>}
                  
                  <TableCell padding="checkbox" align="center" sx={{whiteSpace: "nowrap"}}>
                    <Button size="small" color="secondary" onClick={() => dispatch(setUserIdSessionsLogAct(el._id!))}> <HistoryToggleOff fontSize="small"/> </Button>
                  </TableCell>
                  
                  {currentUser?.level === 0 &&  <TableCell padding="checkbox" align="center" sx={{whiteSpace: "nowrap"}}>
                    <ButtonGroup size="small">
                      <Button size="small" color="success" > {el.rank?.title ?? "-"} </Button>
                      <Button onClick={() => {
                        dispatch(displayUserRankedFormAct(true))
                        dispatch(updateInputUserRankedFormAct({name: 'userId', val: el._id!}))
                        dispatch(updateInputUserRankedFormAct({name: 'userName', val: el.email}))
                        dispatch(updateInputUserRankedFormAct({name: 'officeLevel', val: el.rank?._id ?? ''}))
                      }}> <ArrowDownward fontSize="small"/> </Button>
                    </ButtonGroup>
                  </TableCell>}
          
                  {currentUser!.level! < 3 && <TableCell padding="checkbox" align="center" sx={{whiteSpace: "nowrap"}}>
                    <Button size="small" color="secondary" onClick={() => dispatch(setDialogSetUserLinkAct({link: el.link, name: el.name, userId: el._id!}))}> <LinkIcon fontSize="small"/> </Button>
                  </TableCell>}
                  {currentUser!.level! < 3 && <TableCell padding="checkbox" align="center" sx={{whiteSpace: "nowrap"}}>
                    <Button size="small" color="error"
                      onClick={() => dispatch(logoutUserMobileThunk(el._id!))}
                    > <Logout fontSize="small"/> </Button>
                  </TableCell>}
                </TableRow>
              )
            })}
          </TableBody>

        </Table>
      </TableContainer>
    </>
  )
} 