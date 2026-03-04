import { Accordion, AccordionDetails, AccordionSummary, Checkbox, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, ThemeProvider, Typography } from "@mui/material";
import { ArrowDropDown, Person, PersonOff } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { useEffect, useMemo, useState } from "react";
import { getOfficesThunk } from "../../../offices/offices-list/offices-list.slice";
import { themeCondense } from "../../../../app/themes/theme-condense";
import EditableTd from "./editable-td";
import FinanceOptionsInput from "./finance-options-input";
import { numberToCurrency } from "../../../../utils/numbers.utils";
import CheckboxIcon from '@mui/icons-material/CheckBox';
import { UserChecked } from './user-multi-selector';
import { emptyOfficeInit, OfficeUtilityResumeTye } from './office-utility-resume.type';
import { calculateExpensesPercentageAct, setOfficesUtilityAct } from "../../business-logic/download-payment-history.slice";



const valNumbers = ['userAtCampaign', 'dealedNumbers', 'avarageCostNumber', 'totalCostNumbers', 'copRegistered', 'copWorkers', 'copUtility', 'rentCop', 'rentCopMonth', 'salaries', 'partnerUtility', 'partnerPercentage', 'leadUtility', 'leadPercentage']


export default function DownloadPaysOfficesUtility() {
  const { paymentsLogs, officesGoalsResume, currentCampaign } = useAppSelector((state) => state.downloadPaysHistory) 
  const [built, setBuilt] = useState(false)
  const [editable, setEditable] = useState(true)
  const [negativeValue, setNegativeValue] = useState(0)
  const [salaryValue, setSalaryValue] = useState(0)
  const [selectedUsers, setSelectedUsers] = useState<UserChecked[]>([])
  const { offices, gotOffices } = useAppSelector((state) => state.offices)
  const dispatch = useAppDispatch()
  const [officesData, setOfficesData] = useState<OfficeUtilityResumeTye>({})


  useEffect(() => {
    if(!gotOffices) {
      dispatch(getOfficesThunk())
    }
  }, [])

  useEffect(() => {
    
  }, [currentCampaign])

  useEffect(() => {
    if(currentCampaign && currentCampaign.officesUtility) {
      setOfficesData(currentCampaign.officesUtility.officesUtility)
      setEditable(false)
    } else {

      if(paymentsLogs.length === 0) {
        setOfficesData({})
        setBuilt(false) 
        return
      }
      const data: OfficeUtilityResumeTye = {...officesData};
      const selectedUsersId = selectedUsers.map((u) => u._id);
      for(const p of paymentsLogs) {
        const officeId = p.worker.user?.office;
        if(!data[officeId]) {data[officeId] = {...emptyOfficeInit}}
        data[officeId].total += p.payment.value;
        data[officeId].copRegistered += p.copValue;
        data[officeId].copWorkers += p.worker.value;
        if(!selectedUsersId.includes(p.worker.user?._id)) {
          data[officeId].copWorkersExclude += p.worker.value;
        } else{
          data[officeId].copWorkersUtility += p.worker.value;
        }
      }
      setOfficesData(data)
      setBuilt(true)
      setEditable(true)
    }
  }, [paymentsLogs, offices, currentCampaign])

  useMemo(() => {
    const officesAmount: Record<string, number> = {}

    for(const user of selectedUsers) {
      if(!officesAmount[user.office!]) {
        officesAmount[user.office!] = 0
      }
      officesAmount[user.office!] += user.amount!
    }
    setOfficesData((prevData) => {
      let newData = {...JSON.parse(JSON.stringify(prevData))};
      Object.keys(newData).forEach((officeId) => {
        if(officesAmount[officeId]) {
          newData[officeId].utilityAfterExcludes = newData[officeId].copUtility - officesAmount[officeId]
          newData[officeId].excludeWorkers = officesAmount[officeId]
        } else {
          newData[officeId].excludeWorkers = 0
          newData[officeId].utilityAfterExcludes = newData[officeId].copUtility
        }
      })      
      return newData;
    });
    setOfficesData(officesData)
  }, [selectedUsers])

  useEffect(() => {
    if(built) {
      setOfficesData((prevData) => {
        const newData = {...prevData};
        for(const office of officesGoalsResume) {
          if(!newData[office._id]) {newData[office._id] = {...emptyOfficeInit}}
          newData[office._id] = {
            ...newData[office._id],
            goal: office.totalGoal,
            achieved: office.totalGoal < newData[office._id].total,
            leadPercentage: office.totalGoal < newData[office._id].total ? 20 : 10,
            //dealedNumbers: office.customersCreated,
            rentCopMonth: office.rent || 0,
            rentCop: office.rent ? office.rent / 4 : 0,
          }
        }
        return newData;
      });
    }
  }, [officesGoalsResume, built, paymentsLogs])

  useEffect(() => {
    if (built) {
      setOfficesData((prev) => {
        const newData = { ...prev };
        Object.keys(newData).forEach((officeId) => {
          newData[officeId] = {
            ...newData[officeId],
            salaries: salaryValue,
          };
          newData[officeId] = calculateUtility(officeId, newData);
        });
        return newData;
      });
    }
  }, [salaryValue, built]);

  
  const positiveValue = Object.values(officesData).reduce((acc, office) => acc + (office.utilityNet >= 0 ? office.utilityNet : 0), 0);
  const leadsValue = Object.values(officesData).reduce((acc, office) => acc + office.leadUtility, 0);

  useEffect(() => {
    const negativeValue = Object.values(officesData).reduce((acc, office) => acc + ( office.utilitBeforePartner < 0 && office.chargeExpenses ? office.utilitBeforePartner : 0), 0);
    setNegativeValue(negativeValue)
    dispatch(setOfficesUtilityAct({negativeValue, utilityLeads: leadsValue, officesUtility: officesData}))
    dispatch(calculateExpensesPercentageAct())
  }, [officesData, dispatch, leadsValue])

  const resolverOfficeName = (officeId: string) => {
    const office = offices.find((o) => o._id === officeId);
    return office?.name || officeId;
  }
  
  const handleChange = async (value: any, officeId: string, attr: string) => {
    console.log({value, officeId, attr});
    const parseValue = valNumbers.includes(attr) ? Number(value) : attr === 'checked' ? Boolean(value) : value
    setOfficesData((prev) => {
      const newData = {
        ...prev,
        [officeId]: {
          ...prev[officeId],
          [attr]: parseValue,
        }
      };
      newData[officeId] = calculateUtility(officeId, newData);
      return newData;
    });
  }

  const calculateUtility = (officeId: string, data: OfficeUtilityResumeTye) => {
    const currentOffice = {...data[officeId]};
    
    // console.log(JSON.stringify({currentOffice}, null, 2));
    const hasDealedNumbers = currentOffice.dealedNumbers > 0
    // console.log({hasDealedNumbers});
    
    if(hasDealedNumbers) {
      currentOffice.totalCostNumbers = currentOffice.avarageCostNumber * currentOffice.dealedNumbers * currentOffice.userAtCampaign;
      currentOffice.copUtility = currentOffice.copRegistered - currentOffice.copWorkers;
    }
    currentOffice.utilityAfterExcludes = currentOffice.excludeWorkers > 0 ? currentOffice.copUtility - currentOffice.excludeWorkers : currentOffice.copUtility;

    currentOffice.utilitBeforePartner =  currentOffice.utilityAfterExcludes - salaryValue - currentOffice.rentCop - currentOffice.totalCostNumbers;

    if(currentOffice.dealedNumbers > 0 && currentOffice.avarageCostNumber && currentOffice.userAtCampaign > 0) {
      currentOffice.totalCostNumbers = currentOffice.avarageCostNumber * currentOffice.dealedNumbers * currentOffice.userAtCampaign;
    }

    if(currentOffice.utilitBeforePartner >= 0) {
      currentOffice.partnerUtility = currentOffice.utilitBeforePartner * currentOffice.partnerPercentage / 100;
      currentOffice.utilityNet = currentOffice.utilitBeforePartner - currentOffice.partnerUtility;
    } else {
      currentOffice.utilityNet = currentOffice.utilitBeforePartner;
    }

    if(currentOffice.leadPercentage > 0 && currentOffice.utilitBeforePartner >= 0) {
      currentOffice.leadUtility = currentOffice.utilityNet * currentOffice.leadPercentage / 100;
    } else{
      currentOffice.leadUtility = 0;
    }
    
    return currentOffice
  }
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ArrowDropDown />}>
        <Typography variant="h6">Utilidaded Oficinas</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <ThemeProvider theme={themeCondense}>
        <FinanceOptionsInput 
          salaryValue={salaryValue} 
          setSalaryValue={setSalaryValue} 
          selectedUsers={selectedUsers}
          onSelectedUsersChange={setSelectedUsers}
        />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cobrar</TableCell>
                <TableCell>Oficina</TableCell>
                <TableCell align="center">Meta</TableCell>
                <TableCell align="center">Logrado</TableCell>
                <TableCell>N° users</TableCell>
                <TableCell># repartidos</TableCell>
                <TableCell>Costo $ #</TableCell>
                <TableCell align="center">Total $ #</TableCell>
                <TableCell align="center">USD</TableCell>
                <TableCell align="center">COP</TableCell>
                <TableCell align="center" title="Workers"> <Person /></TableCell>
                <TableCell align="center" title="Utilidad 1">Util 1</TableCell>
                <TableCell align="center" title="Workers"> <PersonOff /> </TableCell>
                <TableCell align="center" title="Utilidad 1"> Util 2</TableCell>
                <TableCell align="center" title="Renta Mensual">Rent</TableCell>
                <TableCell align="right" title="Renta Semanal">Rent Week</TableCell>
                <TableCell align="right" abbr="S" title="Salarios">Salarios</TableCell>
                <TableCell align="right" title="Utilidad 1">Util 3</TableCell>
                <TableCell align="right" title="Porncetaje Socio Soc.">%. Soc.</TableCell>
                <TableCell align="right" title="Utilidad Soc.">Utili. Soc.</TableCell>
                <TableCell align="right" title="Utilidad 1">Util 4</TableCell>
                <TableCell align="right" title="% Lider">% Lider</TableCell>
                <TableCell align="right" title="% Lider">Util. Lider</TableCell>
                <TableCell align="center" title="Checked"> <CheckboxIcon /></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                {Object.keys(officesData).map((officeId) => (
                  <TableRow key={officeId}>
                    <TableCell align="center">
                      <Checkbox checked={officesData[officeId].chargeExpenses} onChange={(e, checked) => handleChange(checked, officeId, 'chargeExpenses')}/>
                    </TableCell>
                    <TableCell>{resolverOfficeName(officeId)}</TableCell>
                    <TableCell align="right">{officesData[officeId].goal}</TableCell>
                    <TableCell align="center" color={officesData[officeId].achieved ? 'green' : 'red'}>{officesData[officeId].achieved ? 'Si' : 'No'}</TableCell>

                    <EditableTd value={officesData[officeId].userAtCampaign} onChange={handleChange} officeId={officeId} attr="userAtCampaign" align="center" />

                    <EditableTd value={officesData[officeId].dealedNumbers} onChange={handleChange} officeId={officeId} attr="dealedNumbers" align="center" />
                    <EditableTd align="center" value={officesData[officeId].avarageCostNumber} onChange={handleChange} officeId={officeId} attr="avarageCostNumber" />
                    <TableCell align="right">{numberToCurrency(officesData[officeId].totalCostNumbers, 0)}</TableCell>
                    <TableCell align="right">{numberToCurrency(officesData[officeId].total, 0)}</TableCell>
                    <TableCell align="right">{numberToCurrency(officesData[officeId].copRegistered, 0)}</TableCell>
                    <TableCell align="right" color="purple">{numberToCurrency(officesData[officeId].copWorkers, 0)}</TableCell>
                    <TableCell align="right">{numberToCurrency(officesData[officeId].copUtility, 0)}</TableCell>
                    <TableCell align="right" color="blue">{numberToCurrency(officesData[officeId].excludeWorkers, 0)}</TableCell>
                    <TableCell align="right">{numberToCurrency(officesData[officeId].utilityAfterExcludes, 0)}</TableCell>
                    <TableCell align="right">{numberToCurrency(officesData[officeId].rentCopMonth, 0)}</TableCell>
                    <TableCell align="right">{numberToCurrency(officesData[officeId].rentCop, 0)}</TableCell>
                    <TableCell align="right">{numberToCurrency(salaryValue, 0)}</TableCell>

                    <TableCell align="right" color={officesData[officeId].utilitBeforePartner >= 0 ? 'green' : 'red'}>{numberToCurrency(officesData[officeId].utilitBeforePartner, 0)}</TableCell>

                    <EditableTd value={officesData[officeId].partnerPercentage} onChange={handleChange} officeId={officeId} attr="partnerPercentage" align="right" />
                    <TableCell align="right">{numberToCurrency(officesData[officeId].partnerUtility, 0)}</TableCell>
                    <TableCell align="right" color={officesData[officeId].utilityNet >= 0 ? 'green' : 'red'}>{numberToCurrency(officesData[officeId].utilityNet, 0)}</TableCell>
                    <TableCell align="right">{numberToCurrency(officesData[officeId].leadPercentage, 0)}</TableCell>
                    <TableCell align="right">{numberToCurrency(officesData[officeId].leadUtility, 0)}</TableCell>
                    <TableCell align="center">
                      <Checkbox checked={officesData[officeId].checked} onChange={(e, checked) => handleChange(checked, officeId, 'checked')}/>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={8} align="left" color="red">Negativo: {numberToCurrency(negativeValue, 0)}</TableCell>
                <TableCell colSpan={8} align="center">Utilidades: {numberToCurrency(positiveValue, 0)}</TableCell>
                <TableCell colSpan={8} align="left">Lideres: {numberToCurrency(leadsValue, 0)}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
        </ThemeProvider>
      </AccordionDetails>
    </Accordion>
  );
}