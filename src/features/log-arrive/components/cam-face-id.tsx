import { Close, Face, Place } from "@mui/icons-material"
import { Button, Grid, Paper } from "@mui/material"
import { useCallback, useEffect, useRef, useState } from "react"
import AppSelector from "../../../app/components/app-select"
import * as faceapi from 'face-api.js';
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { changeUserPickedAct, getUserForAuthFaceThunk, logArriveFetchUsersThunk, logFaceAuthThunk, updateStepLogArriveViewAct } from "../log-arrive.slice";
import { LogArriveStepEnum } from "../log-arrive.state";
import LoadingIndicator from "../../../app/components/loading-indicator";

export default function CamFaceId() {
  const dispatch = useAppDispatch()
  const videRef = useRef<any>()
  const canvaRef = useRef<any>()
  const imageRef = useRef<any>()
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [camStarted, setCamStarted] = useState(false)
  const { currentUser } = useAppSelector((state) => state.login)
  const { userPosition } = useAppSelector((state) => state.login)
  const {users, userChoose, logArriveStep, loading, userPickedDescriptor} = useAppSelector((state) => state.logArrive)  

  const loadModels =  useCallback(async () => {
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
    await faceapi.nets.faceExpressionNet.loadFromUri('/models');
    await faceapi.nets.mtcnn.loadFromUri('/models');
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
  }, [])
 
  useEffect(() => {
    loadModels()
  }, [loadModels])

  useEffect(() => {
    if(currentUser !== undefined) dispatch(logArriveFetchUsersThunk(currentUser!.office as string ))
  }, [currentUser])

  const startCam = () => {
    navigator.mediaDevices.getUserMedia(
      { video: {} },
    ).then(async (stream) => { 
      setCamStarted(true)
      setStream(stream)
      videRef.current.srcObject = stream;
      console.log(9999);
      
      const displaySize = { width: 534, height: 400 };
      //console.log({displaySize});
      faceapi.matchDimensions(canvaRef.current, displaySize);
      const _interval = setInterval(async () => {
        const faceDetection = await faceapi.detectSingleFace(videRef.current, new faceapi.TinyFaceDetectorOptions({scoreThreshold: 0.5})).withFaceLandmarks().withFaceDescriptor()
        
        
        if(faceDetection !== undefined) {
          const hFace = faceDetection.detection.box.height
          console.log({hFace});
          if(hFace > 200) {
            const resizedDetections = faceapi.resizeResults(faceDetection, displaySize);
            canvaRef.current.getContext('2d').clearRect(0, 0, canvaRef.current.width, canvaRef.current.height);
            faceapi.draw.drawDetections(canvaRef.current, resizedDetections!.detection);
            faceapi.draw.drawFaceLandmarks(canvaRef.current, resizedDetections!.landmarks);
  
            const distance = faceapi.euclideanDistance(resizedDetections.descriptor, Float32Array.from(userPickedDescriptor!.values()))
            console.log({distance});
            if(distance < 0.4) {
              dispatch(logFaceAuthThunk({userId: userChoose, lat: userPosition!.lat, lng: userPosition!.lng}))
              clearInterval(_interval)
            } else {
              // TO DO 
              // SHOW WRONG USER
            }
          }
        }
        //faceapi.draw.drawFaceExpressions(canvaRef.current, resizedDetections)
        }, 1000)
     })
  }

  const stopVideo = () => {
    if(stream !== null) {
      stream.getTracks().forEach((track) => {
        track.stop();
      })
      setCamStarted(false)
    }
  }

  const changeUserSelector = ({val} : {val: string}) => {
    dispatch(changeUserPickedAct(val))
    dispatch(getUserForAuthFaceThunk(val))
  }

  useEffect(() => {
    if(logArriveStep === LogArriveStepEnum.scanFace && !camStarted) {
      startCam()
    } else if(logArriveStep === LogArriveStepEnum.initial) {
      stopVideo()
    }
  }, [logArriveStep])

  const updateStepView = (step: LogArriveStepEnum) => {
    if(step === LogArriveStepEnum.pickUser) {

    } else if(step === LogArriveStepEnum.scanFace) {

    } else if(step === LogArriveStepEnum.initial) {
      stopVideo()
    }
    dispatch(updateStepLogArriveViewAct(step))
      
  }
  return (
    <>
      <LoadingIndicator open={loading}/>
      <Paper sx={{padding: 2, marginBottom: 2}}>
        <Grid container spacing={2}>
          {logArriveStep ===  LogArriveStepEnum.initial && <Grid item> 
            <Button variant="contained" color="success" onClick={() => updateStepView(LogArriveStepEnum.pickUser)}> Registrar llegada  <Place/> </Button> </Grid>
          }
          {logArriveStep ===  LogArriveStepEnum.pickUser &&  LogArriveStepEnum.pickUser && <Grid item xs={3}> 
            <AppSelector options={users} label="Usuario" value={userChoose}  onChange={changeUserSelector}/> </Grid>
          }
          {(logArriveStep ===  LogArriveStepEnum.pickUser || logArriveStep ===  LogArriveStepEnum.scanFace) &&  <Grid item> 
            <Button variant="contained" color="error" onClick={() => updateStepView(LogArriveStepEnum.initial)}> Cancelar Registro  <Close/> </Button> 
          </Grid>}
        </Grid>
      </Paper>
      {logArriveStep ===  LogArriveStepEnum.scanFace && <Paper sx={{position: "relative", padding: 2, minHeight: 410}}>
        <div className='borderFaceModal'>
          <img ref={imageRef} style={{position: 'absolute', top: "-600px"}} alt=''/>
          <video ref={videRef} id="inputVideo" className='videoFaceCam' autoPlay muted width={534} height={400}></video>
          <canvas ref={canvaRef} id="overlay"  className='canvasFaceCam' height={400} width={534}></canvas>  
          <Face fontSize="large" style={{fontSize: 150}} color="disabled"  />
        </div>
      </Paper>}
    </>
  )
}