import * as React from "react"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import PeopleIcon from "@mui/icons-material/People"
import { Link } from "react-router-dom"
import { AdminPanelSettings, AnalyticsOutlined, ArrowDropDown, ArrowRight, BusinessOutlined, Campaign, CampaignOutlined, CampaignRounded, Category, ChecklistRtl, ContactPhone, Dashboard, Description, Done, Dvr, ElectricalServices, HistorySharp, ListAlt, PeopleAltTwoTone, PersonPinCircle, PhoneAndroid, PriceChange, Settings, UploadFileSharp } from "@mui/icons-material"
import { useAppSelector } from "../../../app/hooks"
import { RootState } from "../../../app/store"
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { Menu } from "@mui/material"
import { blue } from "@mui/material/colors"
import { OmegaSoftConstants } from "../../../app/khas-web-constants"
interface RouteItemI {
  to?: string
  Icon: any
  title: string
  children?: RouteItemI[]
  superAdmin?: boolean
}

export function MenuItems({onClick = ()=> {}} : {onClick: () => void}) {
  
  const {currentUser} = useAppSelector((state: RootState) => state.login)
  const mapRoutes: RouteItemI[] = [
    // { to: "/dashboard/create-raffle", Icon: <PeopleIcon />, title: "Agregar Sorteo" },
    // { to: "/dashboard/raffles", Icon: <PeopleIcon />, title: "Sorteos" },
    // { to: "/dashboard/create-card", Icon: <Margin />, title: "Crear Tarjeta" },

    { to: "", Icon: <Dashboard />, title: "Resume" },
    { Icon: <BusinessOutlined />, title: "Projects", children: [
      { to: "/dashboard/projects", Icon: <BusinessOutlined />, title: "Proyectos" },
      { to: "/dashboard/project-releases", Icon: <Done />, title: "Proyectos finalizado" },
    ]},
    // { Icon: <Person2Outlined />, title: "Clientes", children: [
    //   { to: "/dashboard/numbers", Icon: <Dvr />, title: "Clientes" },
    //   { to: "/dashboard/customers-center", Icon: <SupportAgent />, title: "Customer Center" },
    //   { to: "/dashboard/customers-database", Icon: <FaceRetouchingNatural />, title: "Customer Database" },
    //   { to: "/dashboard/verify-payments", Icon: <CreditScore />, title: "verificar pagos" },
    // ]},

    { Icon: <PeopleAltTwoTone />, title: "ClientesV2", children: [
      { to: "/dashboard/customers-v2", Icon: <PeopleAltTwoTone />, title: "Clientes V2" },
      { to: "/dashboard/customers-v2/call-logs", Icon: <HistorySharp />, title: "Registro de llamadas" },
      { to: "/dashboard/customers-v2/events", Icon: <HistorySharp />, title: "Eventos" },
      { to: "/dashboard/steps-v2", Icon: <Category />, title: "Steps V2" },
      { to: "/dashboard/staff-performance", Icon: <AnalyticsOutlined />, title: "Rendimiento personal" },
    ]},

    // { Icon: <CampaignOutlined />, title: "Campaña", 
    //   children: [
    //     { to: "/dashboard/campaign", Icon: <Campaign />, title: "Campaña" },
    //     { to: "/dashboard/imports-numbers", Icon: <UploadFileSharp />, title: "Importar data", },
    //     { to: "/dashboard/campaign-customers", Icon: <CampaignRounded />, title: "Asignar clientes", }
    //   ] 
    // },

    { to: "/dashboard/users", Icon: <PeopleIcon />, title: "Usuarios", children: [
      { to: "/dashboard/users", Icon: <PeopleIcon />, title: "Usuarios"},
      { to: "/dashboard/users/referral-follow-up", Icon: <ListAlt />, title: "Seguimiento Referidos" },
      { to: "/dashboard/users-onboarding-status", Icon: <ChecklistRtl />, title: "Onboarding status" },
      { to: "/dashboard/import-users", Icon: <UploadFileSharp />, title: "Importar usuarios" },
      { to: "/dashboard/offices-list", Icon: <BusinessOutlined />, title: "Oficinas" },
      { to: "/dashboard/traninng-traking", Icon: <ChecklistRtl />, title: "Capacitaciones" },
      { to: "/dashboard/signed-contracts", Icon: <Description />, title: "Contratos enviados a firma" },
      { to: "/dashboard/signup-campaigns", Icon: <Campaign />, title: "Campañas de registro" },
      //{ to: "/dashboard/collectors", Icon: <Collections />, title: "Cobradores" },
      // { to: "/dashboard/user-log-arrive", Icon: <HistoryEdu />, title: "Historial llegadas" },
      { to: "/dashboard/audits", Icon: <AdminPanelSettings />, title: "Auditoria" },

    ] },

    { Icon: <PriceChange />, title: "Finanzas", superAdmin: true, children: [
      { to: "/dashboard/reports", Icon: <AnalyticsOutlined />, title: "Reportes" },
    ] },

    { Icon: <ChecklistRtl />, title: "Auditoria", children: [
      // { to: "/dashboard/leads-auditory", Icon: <ChecklistRtl />, title: "Leads Auditory" },
      { to: "/dashboard/ceo-leads-resume", Icon: <CampaignOutlined />, title: "Leads Resume" },
      { to: "/dashboard/customer-payments-auditory", Icon: <PriceChange />, title: "Pagos Clientes" },
      // { to: "/dashboard/reports", Icon: <AnalyticsOutlined />, title: "Reportes" },
      // { to: "/dashboard/steps", Icon: <Category />, title: "Pasos" },
      // { to: "/dashboard/step-logs", Icon: <WebStories />, title: "Historial Pasos" },
      // { to: "/dashboard/users-with-not-customer", Icon: <WifiTetheringErrorRoundedSharp />, title: "Usuarios sin clientes" },
      // { to: "/dashboard/user-actives-snap-shot", Icon: <AppsOutage />, title: "Activos historial" },
      // { to: "/dashboard/handle-payment", Icon: <Money />, title: "Admin pago" },
      // { to: "/dashboard/steps-week-stats", Icon: <Money />, title: "Grafica clientes nuevos por semana" },
      // { to: "/dashboard/users-goal-view", Icon: <Done />, title: "Metas usuarios" },
      // { to: "/dashboard/alerted-payments", Icon: <AddAlertTwoTone />, title: "Payments alert" },
      // { to: "/dashboard/check-customers", Icon: <PersonPin />, title: "Validacion clientes" },
    ] },
    
    { to: "/dashboard/settings", Icon: <Settings />, title: "Settings" },
    { to: "/dashboard/events-gateway", Icon: <ElectricalServices />, title: "Socket" },
    { to: "/dashboard/twilio-numbers", Icon: <PhoneAndroid />, title: "Twilio numbers" },
    
    // { to: "/dashboard/face-auth-cam-face", Icon: <Category />, title: "Cam Face recognition" },
    // { to: "/dashboard/face-auth", Icon: <Category />, title: "Face Test" },
    // { to: "/dashboard/capital-contribute", Icon: <AddBusiness />, title: "Aporte Capital" },
    // { to: "/dashboard/closure", Icon: <Analytics />, title: "Cuadre" },
    // { to: "/dashboard/cards-lists", Icon: <List />, title: "Lista" },
    // { to: "/dashboard/externals", Icon: <ThreePIcon />, title: "Externos" },
    
  ]
  
  const mapRoutesAssigner: RouteItemI[] = [
    { to: "/dashboard/users", Icon: <PeopleIcon />, title: "Usuarios" },
    { to: "/dashboard/customers-v2", Icon: <Dvr />, title: "Clientes" },
    { to: "/dashboard/reports", Icon: <AnalyticsOutlined />, title: "Reportes" },
  ]

  const mapRoutesFinance: RouteItemI[] = [
    { to: "/dashboard/reports", Icon: <AnalyticsOutlined />, title: "Reportes" },
  ]
  
  const mapRoutesLeader: RouteItemI[] = [
    { to: "/dashboard/users", Icon: <PeopleIcon />, title: "Usuarios" },
    { to: "/dashboard/customers-v2", Icon: <ArrowDropDown />, title: "Clientes" },
    { to: "/dashboard/reports", Icon: <AnalyticsOutlined />, title: "Reportes" },
  ]

  const mapRoutesUser: RouteItemI[] = [
    { to: "/dashboard/customers-v2", Icon: <ContactPhone />, title: "Clientes" },
  ]
  
  const mapRoutesOffice: RouteItemI[] = [
    { to: "/dashboard/log-arrive", Icon: <PersonPinCircle />, title: "Registro llegada" },
    //{ to: "/dashboard/lea`10\
    // \[';fre4dw32qas3defg.;'/
    // .;,<gfdswaq>` </gfdswaq>d-campaign", Icon: <Campaign />, title: "Campaña" },
  ]
  
  const mapRoutesSecretary: RouteItemI[] = [
    { to: "/dashboard/customers-v2", Icon: <PersonPinCircle />, title: "Clientes" },
  ]
  
  const mapRoutesAssignerCampaign: RouteItemI[] = [
    { to: "/dashboard/customers-v2", Icon: <CampaignRounded />, title: "Clientes" },
  ]

  return (
    <React.Fragment>
        {(currentUser?.level === 0 || currentUser?.level === 1 ? mapRoutes : 
          currentUser?.level === 2 ? mapRoutesAssigner :  
          currentUser?.level === 3 ? mapRoutesLeader : 
          currentUser?.level === 6 ? mapRoutesOffice : 
          currentUser?.level === 7 ? mapRoutesFinance : 
          currentUser?.level === 8 ? mapRoutesSecretary : 
          currentUser?.level === 9 ? mapRoutesAssignerCampaign : 
          mapRoutesUser).map((el, i) => {

          if(el.children!?.length > 0) {
              if(el.superAdmin && !OmegaSoftConstants.superUsersId.includes(currentUser!.email!)) return <React.Fragment key={`menu_item_${i}`}/>
              return (
              <PopupState variant="popover" popupId={`menu_item_${i}`} key={`menu_item_${i}`}>
                {(popupState) => (
                  <React.Fragment>
                    <ListItemButton {...bindTrigger(popupState)} style={{display: 'flex', justifyContent: 'space-between'}}>
                      <ListItemIcon color={blue['600']}>{el.Icon}</ListItemIcon>
                      <ListItemText primary={el.title} />
                      <ArrowRight/>
                    </ListItemButton>
                    <Menu {...bindMenu(popupState)} anchorOrigin={{vertical: 'top', horizontal: 'right'}}>
                      {el.children!.map((el, i) => (
                        <Link key={"mainMenu" + i} to={el.to!} onClick={onClick}>
                          <ListItemButton>
                            <ListItemIcon>{el.Icon}</ListItemIcon>
                            <ListItemText primary={el.title} />
                          </ListItemButton>
                        </Link>
                      ))}
                    </Menu>
                  </React.Fragment>
                )}
              </PopupState>
            )
          } else {
            return (
              <Link key={"mainMenu" + i} to={el.to!} onClick={onClick}>
                <ListItemButton>
                  <ListItemIcon>{el.Icon}</ListItemIcon>
                  <ListItemText primary={el.title} />
                </ListItemButton>
              </Link>
            )

          }
      })}
    </React.Fragment>
  )
}
