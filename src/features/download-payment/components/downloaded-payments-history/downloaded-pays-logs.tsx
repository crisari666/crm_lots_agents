import { Accordion, AccordionDetails, AccordionSummary, Card, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, ThemeProvider, Tooltip, Typography } from "@mui/material"
import { useAppSelector } from "../../../../app/hooks"
import { themeCondense } from "../../../../app/themes/theme-condense"
import { numberToCurrency } from "../../../../utils/numbers.utils"
import { useCallback, useMemo } from "react"
import { ArrowDropDown } from "@mui/icons-material"

export default function DownloadedPaysLogs() {
  const { paymentsLogs, userSearch, officeSearch } = useAppSelector((state) => state.downloadPaysHistory) 

  const filteredPaymentsLogs = useMemo(() => {
    return paymentsLogs.filter((p) => officeSearch === '' || p.worker.user?.office === officeSearch)
  }, [paymentsLogs, officeSearch])

  const footerCopyValues = useMemo(() => {
    const value = numberToCurrency(filteredPaymentsLogs.reduce((acc, p) => acc + p.payment.value, 0))
    const copValue = numberToCurrency(filteredPaymentsLogs.reduce((acc, p) => acc + p.copValue, 0))
    const workerValue = numberToCurrency(filteredPaymentsLogs.reduce((acc, p) => acc + p.worker.value, 0))
    return { value, copValue, workerValue }
  }, [filteredPaymentsLogs])

  const handleFooterCopy = useCallback(async () => {
    const text = `${footerCopyValues.value}\t${footerCopyValues.copValue}\t${footerCopyValues.workerValue}`
    await navigator.clipboard.writeText(text)
  }, [footerCopyValues])

  return (
    <ThemeProvider theme={themeCondense}>
      <Card sx={{marginBottom: 2}} elevation={3}>
        <Accordion>
          <AccordionSummary expandIcon={<ArrowDropDown />}>
            <Typography variant="h6">Detalle de Pagos</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Paper sx={{padding: 2, marginBottom: 1}}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="right"> N </TableCell>
                      {officeSearch !== '' && <TableCell align="right"> User </TableCell>}
                      <TableCell align="right"> Value </TableCell>
                      <TableCell align="right"> Collector </TableCell>
                      <TableCell align="right"> Usd </TableCell>
                      <TableCell align="right"> COP </TableCell>
                      <TableCell align="right"> Worker </TableCell>
                      <TableCell align="right"> Lead Worker </TableCell>
                      <TableCell align="right"> Sub Lead </TableCell>
                      <TableCell align="right"> Lead Office </TableCell>
                      <TableCell align="right"> Partners </TableCell>
                      <TableCell align="center"> Main 1 </TableCell>
                      <TableCell align="center"> Main 2 </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredPaymentsLogs.map((p, i) => 
                      <TableRow key={p._id}>
                        <TableCell align="right">{i}  </TableCell>
                        {officeSearch !== '' && <TableCell align="right">{p.worker.user?.email}  </TableCell>}
                        <TableCell align="right">{numberToCurrency(p.payment.value)}  </TableCell>
                        <TableCell align="right">{numberToCurrency(p.collector.value)}  </TableCell>
                        <TableCell align="right">{numberToCurrency(p.usdPrice)}  </TableCell>
                        <TableCell align="right">{numberToCurrency(p.copValue) }  </TableCell>
                        <TableCell align="right">
                          <Tooltip  placement="top" title={`${p.worker.user?.email}`}>
                            <Chip size="small" color={userSearch === p.worker.user?._id ? "success" : "default"} label={`${p.worker.percentage}% ${numberToCurrency(p.worker.value)}`}/>
                            </Tooltip>
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip placement="top" title={`${p.leadWorker.user?.email}`}>
                            <Chip size="small" color={userSearch === p.leadWorker.user?._id ? "success" : "default"} label={ numberToCurrency(p.leadWorker.value)} />
                          </Tooltip>
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip placement="top" title={`${p.subleads.users?.map((u, i) => `${u.email}`).join(',')}`}>
                            <Chip size="small" color={p.subleads.users?.filter((u) => u._id === userSearch).length > 0  ? 'success' : "default"} label={numberToCurrency(p.subleads.value)}/>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip placement="top" title={`${p.officeLead.users.map((u) => `${u.email}|${numberToCurrency(p.officeLead.usersPercentage.filter((u2) =>u2.user === u._id)[0]?.value)}`).join('\n')}`}>
                            <Chip color={ p.officeLead.users?.filter((u) => u._id === userSearch).length > 0 ? "success" : "default"} label={numberToCurrency(p.officeLead.value)} /></Tooltip>
                        </TableCell>
                        <TableCell align="right">{numberToCurrency(p.partners.value)}  </TableCell>
                        <TableCell align="center"> 
                            <Chip size="small" color="success" label={numberToCurrency(p.main1)} />
                        </TableCell>
                        <TableCell align="center"> 
                            <Chip size="small" color="success" label={numberToCurrency(p.main2)} />
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                  <TableFooter>
                    <Tooltip title="Click to copy Value, COP, Worker (tab-separated) for spreadsheet">
                      <TableRow
                        onClick={handleFooterCopy}
                        sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
                      >
                      {officeSearch !== '' && <TableCell></TableCell>}
                      <TableCell></TableCell>
                      <TableCell align="right"> {numberToCurrency(filteredPaymentsLogs.reduce((acc, p) => acc + p.payment.value , 0))} </TableCell>
                      <TableCell align="right"> {numberToCurrency(filteredPaymentsLogs.reduce((acc, p) => acc + p.collector.value , 0))} </TableCell>
                      <TableCell align="right"> {numberToCurrency(filteredPaymentsLogs.reduce((acc, p) => acc + p.usdPrice , 0)/filteredPaymentsLogs.length)} </TableCell>
                      <TableCell align="right"> {numberToCurrency(filteredPaymentsLogs.reduce((acc, p) => acc + p.copValue , 0))} </TableCell>
                      <TableCell align="right"> {numberToCurrency(filteredPaymentsLogs.reduce((acc, p) => acc + p.worker.value , 0))} </TableCell>
                      <TableCell align="right"> {numberToCurrency(filteredPaymentsLogs.reduce((acc, p) => acc + p.leadWorker.value , 0))} </TableCell>
                      <TableCell align="right"> {numberToCurrency(filteredPaymentsLogs.reduce((acc, p) => acc + p.subleads.value , 0))} </TableCell>
                      <TableCell align="right"> {numberToCurrency(filteredPaymentsLogs.reduce((acc, p) => acc + p.officeLead.value , 0))} </TableCell>
                      <TableCell align="right"> {numberToCurrency(filteredPaymentsLogs.reduce((acc, p) => acc + p.partners.value , 0))} </TableCell>
                      <TableCell align="center"><Chip size="small" color="success" label={numberToCurrency(filteredPaymentsLogs.reduce((acc, p) => acc + p.main1 , 0))}/></TableCell>
                      <TableCell align="center"><Chip size="small" color="success" label={numberToCurrency(filteredPaymentsLogs.reduce((acc, p) => acc + p.main2 , 0))} /></TableCell>
                      </TableRow>
                    </Tooltip>
                  </TableFooter>
                </Table>
              </TableContainer>
            </Paper>
          </AccordionDetails>
        </Accordion>
      </Card>
    </ThemeProvider>
  )
}