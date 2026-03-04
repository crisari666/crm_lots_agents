import { CloudUpload, Face, SensorOccupied } from "@mui/icons-material";
import * as faceapi from 'face-api.js';
import { Alert, AlertTitle, Button, Dialog, DialogContent, IconButton, LinearProgress, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { closeDialogFaceRegisterAct, getAuthFaceThunk, setCamStartedAct, setCloseFaceToCamAct, setModelsLoadedAct, uploadFaceAutThunk } from "../auth-face.slice";
import { FileUtils } from "../../../utils/file.utils";

export default function DialogAuthFaceRegister() {
  const dispatch = useAppDispatch()
  const { modelsLoaded, camStarted, closeFaceToCam, uploadingFile, showDialogRegisterAuthFace, successAuthFaceRegister } = useAppSelector((state) => state.authFace)
  const { currentUser } = useAppSelector((state) => state.login)
  const videRef = useRef<any>()
  const canvaRef = useRef<any>()
  const imageRef = useRef<any>()
  const [stream, setStream] = useState<MediaStream | null>(null)

  const loadModels =  useCallback(async () => {
    console.log("loading models");
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
    await faceapi.nets.faceExpressionNet.loadFromUri('/models');
    await faceapi.nets.mtcnn.loadFromUri('/models');
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
    dispatch(setModelsLoadedAct(true))
  }, [dispatch])



  useEffect(() => {
    if(showDialogRegisterAuthFace === true) loadModels()
  }, [loadModels, showDialogRegisterAuthFace])
  
  useEffect(() => {
    if(currentUser !== undefined && currentUser?.level! >= 2 &&  currentUser?.level! <= 4) dispatch(getAuthFaceThunk({userId: currentUser?._id!}))
  }, [currentUser, dispatch])

  useEffect(() => {
    if(camStarted === true) {
      setInterval(() => {}, 1000)
    }
  }, [camStarted])
  
  const startCam = useCallback(() => {

    navigator.mediaDevices.getUserMedia(
      { video: {} },
    ).then(async (stream) => { 
      dispatch(setCamStartedAct(true))
      videRef.current.setAttribute('autoplay', '');
      videRef.current.setAttribute('muted', '');
      videRef.current.setAttribute('playsinline', '');
      videRef.current.srcObject = stream;   
      setStream(stream)
      const displaySize = { width: 534, height: 400 };
      faceapi.matchDimensions(canvaRef.current, displaySize);

      let _interval_ = setInterval(async () => {
        if(uploadingFile === false && videRef.current !== undefined && videRef.current !== null) {
          const canvas = document.createElement('canvas');
          canvas.width = 534;
          canvas.height = 400;
          const ctx = canvas.getContext('2d');
          console.log(`Demonio`);
          
          ctx?.drawImage(videRef.current, 0, 0, 534, 400);
          
          canvas.toBlob(async (blob: any) =>  imageRef.current.src = URL.createObjectURL(blob!), 'image/jpeg')
          if(imageRef.current.height === 0) return
          const faceDetection = await faceapi.detectSingleFace(imageRef.current, new faceapi.TinyFaceDetectorOptions({scoreThreshold: 0.8})).withFaceLandmarks().withFaceDescriptor()
          if(faceDetection !== undefined) {
            
            const hFace = faceDetection.detection.box.height
            if(hFace < 230) {
              if(closeFaceToCam === false) dispatch(setCloseFaceToCamAct(true))
            } else {
  
              //Draw screenshot from cam to image
  
              var { x, y, width, height } = faceDetection.detection.box;
              canvas.width = width;
              canvas.height = height;
              ctx?.drawImage(imageRef.current, x, y, width, height, 0, 0, width, height);
  
              const resizedDetections = faceapi.resizeResults(faceDetection, displaySize);
              canvaRef.current.getContext('2d').clearRect(0, 0, canvaRef.current.width, canvaRef.current.height);
              faceapi.draw.drawDetections(canvaRef.current, resizedDetections!.detection);
              //faceapi.draw.drawFaceLandmarks(canvaRef.current, resizedDetections!.landmarks);
              
              canvas.toBlob(async (blob: any) => {
                const urlmage = URL.createObjectURL(blob!)
                const res: Response = await fetch(urlmage);
                const blobF: Blob = await res.blob();
                const type = FileUtils.getMimeTypeFromBase64Url(urlmage);
      
                const file = new File([blobF], 'image.jpeg', { type: type! });
                dispatch(uploadFaceAutThunk({descriptor: faceDetection.descriptor, image: file}))
                dispatch(setCamStartedAct(false))
                stream.getTracks().forEach(function (track) { track.stop();})
                clearInterval(_interval_)
              }, 'image/jpeg')
  
            }
            
          }
        }
        }, 1000)
        
        
     })
  }, [dispatch, uploadingFile, closeFaceToCam])


  useEffect(() => {
    if(modelsLoaded === true && uploadingFile === false){
      startCam()
    }
  }, [modelsLoaded, startCam, uploadingFile])

  return (
    <>
      <Dialog open={showDialogRegisterAuthFace}>
        <DialogContent>

          <Typography variant="h6"> Autenticacion facial requerida</Typography>
          <Typography variant="overline">Tu informacion se encuentra 100% segura y no sera revelada a terceros</Typography>
          {uploadingFile === false && <div style={{position: 'relative', textAlign: 'center', height: 400}}>
            <div className='borderFaceModal'>
              <img ref={imageRef} style={{position: 'absolute', top: "-600px"}} alt=''/>
              <video ref={videRef} id="inputVideo" className='videoFaceCam' autoPlay muted width={534} height={400}></video>
              <canvas ref={canvaRef} id="overlay"  className='canvasFaceCam' height={400} width={534}></canvas>  
              <Face fontSize="large" style={{fontSize: 150}} color="disabled"  />
            </div>
          </div>}
          {uploadingFile === false && closeFaceToCam === true && <Alert icon={<SensorOccupied/>} color="info" sx={{marginBottom: 2}}>
            Acerca tu rostro a la camara y quede ocupando el espacio circular
          </Alert>}
          {successAuthFaceRegister === true && <Alert icon={<CloudUpload/>} color="success" sx={{marginBottom: 2}} >
            <AlertTitle>Registro facial exitoso </AlertTitle>
              <Button variant="outlined" onClick={() => {
                dispatch(closeDialogFaceRegisterAct())
                window.location.reload()
                }
              }> ACEPTAR </Button>
            </Alert>}
          {uploadingFile === true && !successAuthFaceRegister && <>
            <LinearProgress sx={{height: 10}} color="secondary" />
            <Typography variant="overline"> <CloudUpload /> Registro facial en proceso...</Typography>
          </>
          }
        </DialogContent>
      </Dialog>
    </>
  )
}