import { Close } from "@mui/icons-material";
import { Dialog, IconButton, DialogTitle, DialogContent, Button, Grid, Stack, Typography, Table, TableBody, TableRow, TableCell, TableHead } from "@mui/material";
import React, { useEffect, useState } from "react";
import { CustomerInterface } from "../../../../app/models/customer.interface";
import { useAppSelector } from "../../../../app/hooks";
import AppSelector from "../../../../app/components/app-select";
import { StepType } from "../../../../app/models/step.type";

export type ResumeStep = {
  office: string
  step: string
  count: number
}

export default function CustomersResumeSteps({customers} : {customers: CustomerInterface[]}) {
  const [open, setOpen] = useState(false)
  const [resume, setResume] = useState<ResumeStep[]>([])

  const buildResume = React.useCallback(() => {
    const resume: ResumeStep[] = []
    customers.forEach(customer => {
      if(customer.office && customer.step && (customer.step as StepType[]).length > 0) {
        const step = (customer.step as StepType[])[0]
        const office = customer.office.name
        const stepIndex = resume.findIndex(r => r.office === office && r.step === step.title)
        if(stepIndex !== -1) {
          resume[stepIndex].count++
        } else {
          resume.push({office, step: step.title, count: 1})
        }
      }
    })
    return resume
  }, [customers])

  useEffect(() => {
    setResume(buildResume())
  }, [buildResume])


  return (
    <>
      <Button 
        variant="outlined" 
        size="small" 
        onClick={() => setOpen(true)}
        sx={{ 
          height: '24px', 
          fontSize: '0.7rem', 
          padding: '2px 8px',
          minWidth: 'auto',
          whiteSpace: 'nowrap'
        }}
      >
        Resumen
      </Button>
      <Dialog open={open}>
        <IconButton onClick={() => setOpen(false)} className="closeDialog"> <Close /></IconButton>
        <DialogTitle>Resumen de pasos</DialogTitle>
        <DialogContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Oficina</TableCell>
                <TableCell>Paso</TableCell>
                <TableCell>Cantidad</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {resume.sort((a, b) => a.office.localeCompare(b.office)).map(office => (
                <TableRow key={office.office}>
                  <TableCell>{office.office}</TableCell>
                  <TableCell>{office.step}</TableCell>
                  <TableCell>{office.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>

    </>
  )
}
