import { Button, Paper, Alert, CircularProgress, Grid } from "@mui/material";
import ButtonReadExcelFile from "../button-read-excel-file";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { RootState } from "../../../../app/store";
import { CloudSync } from "@mui/icons-material";
import { addCustomerToUsersThunk } from "../import-numbers.slice";
import DialogSuccessDataImported from "../../customer-view/components/dialog-success-data-imported";
import { useState, useEffect } from "react";
import AppSelector from "../../../../app/components/app-select";
import { fetchProjectsThunk } from "../../../projects/projects.slice";

export default function PreviewDataControls() {
  const dispatch = useAppDispatch()
  const [projectId, setProjectId] = useState<string | undefined>(undefined)
  const [showProjectAlert, setShowProjectAlert] = useState<boolean>(false)
  const { uploadedData, leadUsersMap, currentCampaign, currentCampaignGot} = useAppSelector((state: RootState) => state.importNumbers)
  const { projects, isLoading: projectsLoading } = useAppSelector((state: RootState) => state.projects)
  useEffect(() => {
    dispatch(fetchProjectsThunk())
  }, [dispatch])

  const handleProjectChange = ({ name, val }: { name: string, val: any }) => {
    setProjectId(val)
    setShowProjectAlert(false)
  }

  const handleSyncClick = () => {
    if (!projectId) {
      setShowProjectAlert(true)
      return
    }
    dispatch(addCustomerToUsersThunk({campaign: currentCampaign!, leadUserMap: leadUsersMap, projectId}))
  }

  return (
    <>
      <DialogSuccessDataImported/>
      <Paper sx={{padding: 2, marginTop: 2}} elevation={4}>
        {currentCampaignGot === true && currentCampaign && (
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <ButtonReadExcelFile/>
            </Grid>
            
            <Grid item xs={4}>
              {projectsLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                  <CircularProgress />
                </div>
              ) : (
                <AppSelector
                  value={projectId || ''}
                  onChange={handleProjectChange}
                  options={projects}
                  label="Proyecto"
                  name="project"
                  required={true}
                  size="small"
                />
              )}
            </Grid>
            
            <Grid item>
              <Button 
                variant="contained" 
                disabled={uploadedData.length === 0 || !projectId} 
                color="success" 
                onClick={handleSyncClick}
              > 
                SINCRONIZAR <CloudSync />
              </Button>
            </Grid>
          </Grid>
        )}
        
        {showProjectAlert && (
          <Alert severity="warning" sx={{ marginTop: 2 }}>
            Debe seleccionar un proyecto antes de sincronizar
          </Alert>
        )}
      </Paper>
    </>
  );
}