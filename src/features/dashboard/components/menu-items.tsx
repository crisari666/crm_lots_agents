import * as React from "react"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import PeopleIcon from "@mui/icons-material/People"
import { Link } from "react-router-dom"
import {  AddAlertTwoTone, AdminPanelSettings, AnalyticsOutlined,  AppsOutage,  ArrowDropDown,  ArrowRight,  BusinessOutlined, Calculate, Campaign, CampaignOutlined, CampaignRounded, Category, ChecklistRtl, Collections, CollectionsOutlined, ContactPhone, CreditScore, Dashboard, Done, Dvr, ElectricalServices, FaceRetouchingNatural, Gavel, HistoryEdu, HistorySharp, ListAlt, Money, PaymentRounded, PeopleAltTwoTone, PercentOutlined, Person2Outlined, PersonPin, PersonPinCircle, PhoneAndroid, PriceChange, Route, Settings, SupportAgent, UploadFileSharp, WebStories, WifiTetheringErrorRoundedSharp } from "@mui/icons-material"
import CreditScoreIcon from '@mui/icons-material/CreditScore';
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
    { to: "/dashboard/projects", Icon: <BusinessOutlined />, title: "Projects" },
    { Icon: <Person2Outlined />, title: "Clientes", children: [
      { to: "/dashboard/numbers", Icon: <Dvr />, title: "Clientes" },
      { to: "/dashboard/customers-center", Icon: <SupportAgent />, title: "Customer Center" },
      { to: "/dashboard/customers-database", Icon: <FaceRetouchingNatural />, title: "Customer Database" },
      { to: "/dashboard/verify-payments", Icon: <CreditScore />, title: "verificar pagos" },
      { to: "/dashboard/projects", Icon: <CreditScore />, title: "Proyectos" },
    ]},

    { Icon: <PeopleAltTwoTone />, title: "ClientesV2", children: [
      { to: "/dashboard/customers-v2", Icon: <PeopleAltTwoTone />, title: "Clientes V2" },
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
      { to: "/dashboard/users-onboarding-status", Icon: <ChecklistRtl />, title: "Onboarding status" },
      { to: "/dashboard/import-users", Icon: <UploadFileSharp />, title: "Importar usuarios" },
      { to: "/dashboard/offices-list", Icon: <BusinessOutlined />, title: "Oficinas" },
      { to: "/dashboard/traninng-traking", Icon: <ChecklistRtl />, title: "Capacitaciones" },
      //{ to: "/dashboard/collectors", Icon: <Collections />, title: "Cobradores" },
      { to: "/dashboard/user-log-arrive", Icon: <HistoryEdu />, title: "Historial llegadas" },
      { to: "/dashboard/audits", Icon: <AdminPanelSettings />, title: "Auditoria" },

    ] },

    { Icon: <PriceChange />, title: "Finanzas", superAdmin: true, children: [
      { to: "/dashboard/expenses", Icon: <PriceChange />, title: "Gastos" },
      // { to: "/dashboard/download-payment", Icon: <PaymentRounded />, title: "Descargar pago" },
      // { to: "/dashboard/users-percentage", Icon: <PercentOutlined />, title: "Porcentajes" },
      // { to: "/dashboard/download-pays-history", Icon: <HistorySharp />, title: "Historial descargas" },
      // { to: "/dashboard/payment-route-template", Icon: <Route />, title: "Rutas de Pago" },
    ] },

    { Icon: <ChecklistRtl />, title: "Auditoria", children: [
      { to: "/dashboard/leads-auditory", Icon: <ChecklistRtl />, title: "Leads Auditory" },
      { to: "/dashboard/audit-resume", Icon: <HistoryEdu />, title: "Resumen Auditoria" },
      { to: "/dashboard/reports", Icon: <AnalyticsOutlined />, title: "Reportes" },
      { to: "/dashboard/steps", Icon: <Category />, title: "Pasos" },
      { to: "/dashboard/step-logs", Icon: <WebStories />, title: "Historial Pasos" },
      { to: "/dashboard/users-with-not-customer", Icon: <WifiTetheringErrorRoundedSharp />, title: "Usuarios sin clientes" },
      { to: "/dashboard/user-actives-snap-shot", Icon: <AppsOutage />, title: "Activos historial" },
      { to: "/dashboard/handle-payment", Icon: <Money />, title: "Admin pago" },
      { to: "/dashboard/steps-week-stats", Icon: <Money />, title: "Grafica clientes nuevos por semana" },
      { to: "/dashboard/users-goal-view", Icon: <Done />, title: "Metas usuarios" },
      { to: "/dashboard/alerted-payments", Icon: <AddAlertTwoTone />, title: "Payments alert" },
      { to: "/dashboard/check-customers", Icon: <PersonPin />, title: "Validacion clientes" },
      { to: "/dashboard/penances", Icon: <Gavel />, title: "Multas" },
    ] },
    
    { to: "/dashboard/situations", Icon: <ListAlt />, title: "Situaciones" },
    { to: "/dashboard/settings", Icon: <Settings />, title: "Settings" },
    
    
    { to: "/dashboard/unstrusted-payments", Icon: <CreditScoreIcon />, title: "Validar pagos" },
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
    { to: "/dashboard/numbers", Icon: <Dvr />, title: "Clientes" },
    // { to: "/dashboard/lead-campaign", Icon: <Campaign />, title: "Campaña" },
    //{ to: "/dashboard/collectors", Icon: <CollectionsOutlined />, title: "Cobradores" },
    { to: "/dashboard/reports", Icon: <AnalyticsOutlined />, title: "Reportes" },
    { to: "/dashboard/worker-payments", Icon: <ContactPhone />, title: "Pagos" },
    { to: "/dashboard/lead-alerts", Icon: <AddAlertTwoTone />, title: "Alertas equipo" },
  ]

  const mapRoutesFinance: RouteItemI[] = [
    // { to: "/dashboard/download-payment", Icon: <PaymentRounded />, title: "Descargar pago" },
    // { to: "/dashboard/download-pays-history", Icon: <HistorySharp />, title: "Historial descargas" },
    { to: "/dashboard/expenses", Icon: <PriceChange />, title: "Gastos" },
    // { to: "/dashboard/calculator", Icon: <Calculate />, title: "Calculadora" },
  ]
  
  const mapRoutesLeader: RouteItemI[] = [
    { to: "/dashboard/users", Icon: <PeopleIcon />, title: "Usuarios" },
    { to: "/dashboard/worker-payments", Icon: <ContactPhone />, title: "Pagos" },
    { to: "/dashboard/numbers", Icon: <ArrowDropDown />, title: "Clientes" },
    { to: "/dashboard/lead-alerts", Icon: <AddAlertTwoTone />, title: "Alertas equipo" },
    { to: "/dashboard/reports", Icon: <AnalyticsOutlined />, title: "Reportes" },
    
  ]

  const mapRoutesUser: RouteItemI[] = [
    { to: "/dashboard/numbers", Icon: <ContactPhone />, title: "Clientes" },
    { to: "/dashboard/worker-payments", Icon: <Money />, title: "Pagos" },
    //{ to: "/dashboard/lead-campaign", Icon: <Campaign />, title: "Campaña" },
  ]
  
  const mapRoutesOffice: RouteItemI[] = [
    { to: "/dashboard/log-arrive", Icon: <PersonPinCircle />, title: "Registro llegada" },
    //{ to: "/dashboard/lea`10\
    // \[';fre4dw32qas3defg.;'/
    // .;,<gfdswaq>` </gfdswaq>d-campaign", Icon: <Campaign />, title: "Campaña" },
  ]
  
  const mapRoutesSecretary: RouteItemI[] = [
    { to: "/dashboard/verify-payments", Icon: <PersonPinCircle />, title: "Verificar pagos" },
    //{ to: "/dashboard/lead-campaign", Icon: <Campaign />, title: "Campaña" },
  ]
  
  const mapRoutesAssignerCampaign: RouteItemI[] = [
    { to: "/dashboard/campaign-customers", Icon: <CampaignRounded />, title: "Asignar clientes", }
    //{ to: "/dashboard/lead-campaign", Icon: <Campaign />, title: "Campaña" },
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
