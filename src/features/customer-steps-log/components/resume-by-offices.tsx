import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getOfficesThunk } from "../../offices/offices-list/offices-list.slice";
import { BarChart } from "@mui/x-charts";
export default function ResumeByOffices() {
  const dispatch = useAppDispatch()
  const {customers} = useAppSelector((state) => state.customerStepsLog)
  const {offices, gotOffices} = useAppSelector((state) => state.offices)
  const {} = useAppSelector((state) => state.users) 

  useEffect(() => {
    if(!gotOffices){
      dispatch(getOfficesThunk())
    }
  }, [])

  const buildResume = () => {
    const ofs: {[key: string]: number} = {}
    for (const customer of customers) {
      if(!ofs[customer.office._id]) ofs[customer.office._id] = 0
      ofs[customer.office._id]++
    }
    return [ofs]
  }

  const buildSeries = (): any[] => {
    const series = []
    for (const office of offices) {
      if(office.enable === true && office.name?.toLowerCase() !== 'oficina 1') series.push({dataKey: office._id, label: office.name})
    }    
    return series
  }
  return (
    <>
       <BarChart
          xAxis={[{ scaleType: 'band', data: ['Totales'] }]}
          margin={{ top: 50}}
          dataset={buildResume()}
          series={buildSeries()}
          width={1000}
          height={400}
        />   
    </>
  )
}