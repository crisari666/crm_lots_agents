import type { ComponentType } from "react"
import type { SvgIconProps } from "@mui/material/SvgIcon"
import Category from "@mui/icons-material/Category"
import Pool from "@mui/icons-material/Pool"
import Bolt from "@mui/icons-material/Bolt"
import WaterDrop from "@mui/icons-material/WaterDrop"
import Plumbing from "@mui/icons-material/Plumbing"
import Security from "@mui/icons-material/Security"
import BeachAccess from "@mui/icons-material/BeachAccess"
import Spa from "@mui/icons-material/Spa"
import Deck from "@mui/icons-material/Deck"
import HotTub from "@mui/icons-material/HotTub"
import SportsTennis from "@mui/icons-material/SportsTennis"
import SportsGolf from "@mui/icons-material/SportsGolf"
import SportsSoccer from "@mui/icons-material/SportsSoccer"
import SportsVolleyball from "@mui/icons-material/SportsVolleyball"
import Sports from "@mui/icons-material/Sports"
import Hiking from "@mui/icons-material/Hiking"
import Groups from "@mui/icons-material/Groups"
import Waves from "@mui/icons-material/Waves"
import ChildCare from "@mui/icons-material/ChildCare"
import Pets from "@mui/icons-material/Pets"
import OutdoorGrill from "@mui/icons-material/OutdoorGrill"
import Villa from "@mui/icons-material/Villa"
import DoorFront from "@mui/icons-material/DoorFront"
import AdminPanelSettings from "@mui/icons-material/AdminPanelSettings"
import Recycling from "@mui/icons-material/Recycling"
import SportsBasketball from "@mui/icons-material/SportsBasketball"
import FitnessCenter from "@mui/icons-material/FitnessCenter"
import SelfImprovement from "@mui/icons-material/SelfImprovement"
import DirectionsBike from "@mui/icons-material/DirectionsBike"
import Terrain from "@mui/icons-material/Terrain"
import Flag from "@mui/icons-material/Flag"
import Park from "@mui/icons-material/Park"
import Air from "@mui/icons-material/Air"
import Cabin from "@mui/icons-material/Cabin"
import Kayaking from "@mui/icons-material/Kayaking"
import Restaurant from "@mui/icons-material/Restaurant"
import LocalFireDepartment from "@mui/icons-material/LocalFireDepartment"
import { projectStrings as s } from "../../../i18n/locales/project.strings"

type IconComponent = ComponentType<SvgIconProps>

export type AmenityGroupIconOption = {
  id: string
  Icon: IconComponent
  labelKey: keyof typeof s
}

export const AMENITY_GROUP_ICON_OPTIONS: AmenityGroupIconOption[] = [
  { id: "category", Icon: Category, labelKey: "amenityGroupIcon_category" },
  { id: "pool", Icon: Pool, labelKey: "amenityGroupIcon_pool" },
  { id: "bolt", Icon: Bolt, labelKey: "amenityGroupIcon_bolt" },
  { id: "water_drop", Icon: WaterDrop, labelKey: "amenityGroupIcon_water_drop" },
  { id: "plumbing", Icon: Plumbing, labelKey: "amenityGroupIcon_plumbing" },
  { id: "security", Icon: Security, labelKey: "amenityGroupIcon_security" },
  { id: "beach_access", Icon: BeachAccess, labelKey: "amenityGroupIcon_beach_access" },
  { id: "spa", Icon: Spa, labelKey: "amenityGroupIcon_spa" },
  { id: "deck", Icon: Deck, labelKey: "amenityGroupIcon_deck" },
  { id: "hot_tub", Icon: HotTub, labelKey: "amenityGroupIcon_hot_tub" },
  { id: "sports_tennis", Icon: SportsTennis, labelKey: "amenityGroupIcon_sports_tennis" },
  { id: "sports_golf", Icon: SportsGolf, labelKey: "amenityGroupIcon_sports_golf" },
  { id: "sports_soccer", Icon: SportsSoccer, labelKey: "amenityGroupIcon_sports_soccer" },
  { id: "sports_volleyball", Icon: SportsVolleyball, labelKey: "amenityGroupIcon_sports_volleyball" },
  { id: "sports", Icon: Sports, labelKey: "amenityGroupIcon_sports" },
  { id: "hiking", Icon: Hiking, labelKey: "amenityGroupIcon_hiking" },
  { id: "groups", Icon: Groups, labelKey: "amenityGroupIcon_groups" },
  { id: "waves", Icon: Waves, labelKey: "amenityGroupIcon_waves" },
  { id: "child_care", Icon: ChildCare, labelKey: "amenityGroupIcon_child_care" },
  { id: "pets", Icon: Pets, labelKey: "amenityGroupIcon_pets" },
  { id: "outdoor_grill", Icon: OutdoorGrill, labelKey: "amenityGroupIcon_outdoor_grill" },
  { id: "villa", Icon: Villa, labelKey: "amenityGroupIcon_villa" },
  { id: "door_front", Icon: DoorFront, labelKey: "amenityGroupIcon_door_front" },
  { id: "admin_panel_settings", Icon: AdminPanelSettings, labelKey: "amenityGroupIcon_admin_panel" },
  { id: "recycling", Icon: Recycling, labelKey: "amenityGroupIcon_recycling" },
  { id: "sports_basketball", Icon: SportsBasketball, labelKey: "amenityGroupIcon_sports_basketball" },
  { id: "fitness_center", Icon: FitnessCenter, labelKey: "amenityGroupIcon_fitness_center" },
  { id: "self_improvement", Icon: SelfImprovement, labelKey: "amenityGroupIcon_self_improvement" },
  { id: "directions_bike", Icon: DirectionsBike, labelKey: "amenityGroupIcon_directions_bike" },
  { id: "terrain", Icon: Terrain, labelKey: "amenityGroupIcon_terrain" },
  { id: "flag", Icon: Flag, labelKey: "amenityGroupIcon_flag" },
  { id: "park", Icon: Park, labelKey: "amenityGroupIcon_park" },
  { id: "air", Icon: Air, labelKey: "amenityGroupIcon_air" },
  { id: "cabin", Icon: Cabin, labelKey: "amenityGroupIcon_cabin" },
  { id: "kayaking", Icon: Kayaking, labelKey: "amenityGroupIcon_kayaking" },
  { id: "restaurant", Icon: Restaurant, labelKey: "amenityGroupIcon_restaurant" },
  { id: "local_fire_department", Icon: LocalFireDepartment, labelKey: "amenityGroupIcon_local_fire_department" }
]

const ICON_BY_ID = new Map(AMENITY_GROUP_ICON_OPTIONS.map((o) => [o.id, o.Icon]))

export function AmenityGroupIconDisplay({
  iconId,
  fontSize = "medium"
}: {
  iconId: string
  fontSize?: SvgIconProps["fontSize"]
}) {
  const Icon = ICON_BY_ID.get(iconId) ?? Category
  return <Icon fontSize={fontSize} color="action" />
}

export function labelForAmenityGroupIcon(labelKey: keyof typeof s): string {
  return s[labelKey]
}
