import { ReactNode, SyntheticEvent, useState } from "react"
import { Box, Tab, Tabs } from "@mui/material"
import { useAppSelector } from "../../../app/hooks"
import { metaLeadFormsStrings as s } from "../../../i18n/locales/meta-lead-forms.strings"
import MetaLeadAdsHeaderCP from "./meta-lead-ads-header.cp"
import MetaLeadAdsListCP from "./meta-lead-ads-list.cp"
import MetaLeadAdsUnregisteredCP from "./meta-lead-ads-unregistered.cp"
import MetaLeadFormsListCP from "./meta-lead-forms-list.cp"
import MetaLeadFormsSettingsCP from "./meta-lead-forms-settings.cp"
import MetaLeadFormsToolbarCP from "./meta-lead-forms-toolbar.cp"
import MetaLeadFormsUnregisteredCP from "./meta-lead-forms-unregistered.cp"

type MetaLeadFormsTabId = "forms" | "ads"

type TabPanelProps = {
  children: ReactNode
  tabId: MetaLeadFormsTabId
  value: MetaLeadFormsTabId
}

function MetaLeadFormsTabPanel({ children, tabId, value }: TabPanelProps) {
  const isActive = value === tabId
  return (
    <div
      role="tabpanel"
      hidden={!isActive}
      id={`meta-lead-forms-tabpanel-${tabId}`}
      aria-labelledby={`meta-lead-forms-tab-${tabId}`}
    >
      {isActive ? <Box sx={{ pt: 2 }}>{children}</Box> : null}
    </div>
  )
}

export default function MetaLeadFormsTabsCP() {
  const [activeTab, setActiveTab] = useState<MetaLeadFormsTabId>("forms")
  const formsCount = useAppSelector((state) => state.metaLeadForms.items.length)
  const adsCount = useAppSelector((state) => state.metaLeadForms.adItems.length)
  const handleTabChange = (_event: SyntheticEvent, nextTab: MetaLeadFormsTabId): void => {
    setActiveTab(nextTab)
  }
  return (
    <Box>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label={s.tabsAriaLabel}
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          minHeight: 40,
          "& .MuiTab-root": {
            minHeight: 40,
            py: 1,
            px: 1.5,
            textTransform: "none",
            fontWeight: 600,
            cursor: "pointer",
            transition: "color 200ms ease",
          },
        }}
      >
        <Tab
          id="meta-lead-forms-tab-forms"
          aria-controls="meta-lead-forms-tabpanel-forms"
          value="forms"
          label={`${s.tabForms} (${formsCount})`}
        />
        <Tab
          id="meta-lead-forms-tab-ads"
          aria-controls="meta-lead-forms-tabpanel-ads"
          value="ads"
          label={`${s.tabAds} (${adsCount})`}
        />
      </Tabs>
      <MetaLeadFormsTabPanel tabId="forms" value={activeTab}>
        <MetaLeadFormsToolbarCP />
        <MetaLeadFormsSettingsCP />
        <MetaLeadFormsListCP />
        <MetaLeadFormsUnregisteredCP />
      </MetaLeadFormsTabPanel>
      <MetaLeadFormsTabPanel tabId="ads" value={activeTab}>
        <MetaLeadAdsHeaderCP />
        <MetaLeadAdsListCP />
        <MetaLeadAdsUnregisteredCP />
      </MetaLeadFormsTabPanel>
    </Box>
  )
}
