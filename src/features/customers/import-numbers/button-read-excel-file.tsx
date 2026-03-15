import { CloudUpload } from "@mui/icons-material";
import { Button } from "@mui/material";
import { CustomerRowCSVI } from "../../../app/models/customer-row-csv";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { importMultipleCustomersThunk, setDataFromExcelAct, setDataRowsAct } from "./import-numbers.slice";
import { LeadNumbersPreviewInterface } from "../../../app/models/lead-numbers-preview.interface";
import CSVReader from 'react-csv-reader'

export default function ButtonReadExcelFile() {
  const mapLeadUserId = useAppSelector(state => state.importNumbers.mapLeadUserId)
  const dispatch = useAppDispatch()
  
  const parseRowsToListMap = (rows: any[]) : any => {
    const heads = rows[0]
    const indexHead = heads.map((head: string, index: number) => ({[head]: index})) 
    const data = rows.slice(1) 
    const errors: any = {}
    const parseData: CustomerRowCSVI[] = data.map((row: any, indexRow: number) => {
      const rowParsed: any = {}
      indexHead.forEach((head: any) => {
        const key = Object.keys(head)[0]
        const index = head[key]
        const val: string = row[index]
        //console.log({index, key, val});
        
        rowParsed[key] = row[index]

        if(val === undefined || val === "" || val.toLowerCase().includes('error')) {
          const indexError = `Index_${indexRow + 2}`
          if(errors[indexRow] === undefined) errors[indexError] = {} as any
          errors[indexError][key] = 
            val === undefined ? "Campo vacío" : 
            val === "" ? "Campo vacío" : 
            val.toLowerCase().includes('error') ? "Campo con error" : ""
        }

      })

      return rowParsed
    })
    
    if(Object.keys(errors).length > 0) {
      return alert(`Hay errores en el archivo CSV: ${JSON.stringify(errors, null, 1)}`)
      // /console.log({errors});
    }
    return parseData
  }

  const distribuiteByLeads = (data: CustomerRowCSVI[]): LeadNumbersPreviewInterface[] => {
    
    const leadsMap: LeadNumbersPreviewInterface[] = []
    for(const row of data) {
      const lead = row.lead
      const leadIndex = leadsMap.findIndex((leadMap) => leadMap.user === lead)  
      const assignerId = mapLeadUserId[lead]
      if(assignerId !== undefined) {
        if(leadIndex !== -1) {
          leadsMap[leadIndex].numbers.push(row)
        } else {
          leadsMap.push({
            _id: mapLeadUserId[lead],
            name: "",
            user: lead,
            numbers: [row]
          })
        }
      }
    }
    return leadsMap
  }
  const uploadedCSV = (rows: any, fileInfo: any, originalFile: any) => {
    const data = parseRowsToListMap(rows)

    dispatch(importMultipleCustomersThunk({customers: data}))
    dispatch(setDataRowsAct(data))
    const leadsMap = distribuiteByLeads(data)
    //console.log({leadsMap});
    
    dispatch(setDataFromExcelAct(leadsMap))      
  }
  
  return(<>

    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUpload />}
    >
      <CSVReader onFileLoaded={uploadedCSV} label="Seleccionar archivo" cssInputClass="inputHidde"/>
      {/* Upload file
      <VisuallyHiddenInput type="file" onChange={handleChangeInput} /> */}
    </Button>

    {/* <Button sx={{marginLeft: 2}} color="warning" variant="contained"> VER DATOS < Visibility/> </ Button> */}

  </>)
}