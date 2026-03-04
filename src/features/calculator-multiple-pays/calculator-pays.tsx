import { Grid, Paper } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import React, { useEffect, useState } from "react"
import AppTextField from "../../app/components/app-textfield"
import { numberToCurrency } from "../../utils/numbers.utils"

export type CopUsdPayType = {cop: number, usd: number}

export default function CalculatorPays() {
  const dispatch = useAppDispatch()
  const {  } = useAppSelector((state) => state.users)
  
  const [usdTotal, setUsdTotal] =  useState<number>(0)
  const [cop, setCop] =  useState<number>(0)
  const [nPays, setNPays] =  useState<number>(0)

  const [pays, setPays] =  useState<CopUsdPayType[]>([])

  useEffect(() => {
    
  }, [cop, usdTotal, pays])
  
  useEffect(() => {
    let pays: CopUsdPayType[] = []
    for(let i = 0; i < nPays; i++) {
      pays.push({cop: 0, usd: 0})
    }
    setPays(pays)
  }, [nPays])

  const changeUsdInput= (d : {index: number, val: number}) => {
    let _pays = [...pays]
    _pays[d.index].usd = d.val

    _pays = _pays.map((el) => {
      const _cop = (cop / usdTotal) * el.usd
      return {cop: _cop, usd: el.usd}
    })

    setPays(_pays)
  }
  return (
    <>
      <Paper sx={{padding: 1, marginBottom: 1}}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <AppTextField label="Dolares" value={usdTotal} type="number" onChange={(d) => setUsdTotal(d.val) }/>
          </Grid>
          <Grid item xs={4}>
            <AppTextField label="Total Pesos" value={cop} type="number" onChange={(d) => setCop(d.val) }/>
          </Grid>
          <Grid item xs={4}>
            <AppTextField label="N Pagos" value={nPays} type="number" onChange={(d) => setNPays(d.val) }/>
          </Grid>
        </Grid>
      </Paper>
      <Paper sx={{padding: 1}}>
        <Grid container spacing={1}>
          {pays.map((el, i) => 
            <React.Fragment key={`nPay${i}`}>
              <Grid item xs={6}>
                <AppTextField 
                  label="Pesos" 
                  disabled={true} readonly={true}
                  value={numberToCurrency(el.cop)} 
                />
              </Grid>
              <Grid item xs={6}>
                <AppTextField 
                  label="Dolares" 
                  value={el.usd} type="number" 
                  onChange={(d) => changeUsdInput({index: i, val: d.val})}
                />
              </Grid>
            </React.Fragment>
          )}
        </Grid>
      </Paper>
    </>
  )
}