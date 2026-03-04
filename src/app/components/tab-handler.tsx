import { Box, Tab, Tabs } from "@mui/material"
import { ReactNode, useState } from "react"

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  padding: number; 
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div 

      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      {...other}
    >
      {value === index && ( <Box sx={{ p:  props.padding}}> {children} </Box> )}
    </div>
  );
}

export default function TabHandler({tabComponents, tabNames, padding = 2} : 
  {tabNames: string[], tabComponents: ReactNode[], padding?: number}) {
  const [index, setIndex] = useState(0)
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setIndex(newValue);
  };
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={index} onChange={handleChange} aria-label="basic tabs example">
          {tabNames.map((name, i) => <Tab key={"tab"+name+i} label={name} />)}
        </Tabs>
      </Box>
      {tabComponents.map((component, i) => <CustomTabPanel key={'TabContent' + i} value={index} index={i} padding={padding}>{component}</CustomTabPanel>)}
    </Box>
  )
}