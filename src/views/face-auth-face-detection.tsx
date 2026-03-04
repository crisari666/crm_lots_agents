
import { Button, Grid } from '@mui/material';
import * as faceapi from 'face-api.js';
import { useEffect, useRef, useState } from 'react';
import authFaceImg from '../assets/auth-face-img.jpg';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { getAuthFaceThunk } from '../features/auth-face/auth-face.slice';

export default function FaceAuthFaceDetection() {
  const { currentUser } = useAppSelector((state) => state.login)
  const { descriptorFromBack } = useAppSelector((state) => state.authFace)
  const dispatch = useAppDispatch()
  const videRef = useRef<any>()
  const canvaRef = useRef<any>()
  const imageRef = useRef<any>()
  const [camStarted, setCamStarted] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  useEffect(()  => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
      await faceapi.nets.faceExpressionNet.loadFromUri('/models');
      await faceapi.nets.mtcnn.loadFromUri('/models');
     
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
    }
    loadModels()
    
  }, [])

  useEffect(() => {
    if(currentUser !== undefined) {
      dispatch(getAuthFaceThunk({userId: currentUser!._id!}))
    }
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
      setInterval(async () => {
        const faceDetection = await faceapi.detectSingleFace(videRef.current, new faceapi.TinyFaceDetectorOptions({scoreThreshold: 0.5})).withFaceLandmarks().withFaceDescriptor()
        
        
        if(faceDetection !== undefined) {
          const resizedDetections = faceapi.resizeResults(faceDetection, displaySize);
          canvaRef.current.getContext('2d').clearRect(0, 0, canvaRef.current.width, canvaRef.current.height);
          faceapi.draw.drawDetections(canvaRef.current, resizedDetections!.detection);
          faceapi.draw.drawFaceLandmarks(canvaRef.current, resizedDetections!.landmarks);
          const faceDescriptors = [];
        }
        //faceapi.draw.drawFaceExpressions(canvaRef.current, resizedDetections)
        }, 100)
     })
  }

  const takeImage = async ({upload} : {upload: boolean}) => {
    if(camStarted === true) {
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videRef.current, 0, 0, 640, 480);
      
      canvas.toBlob(async (blob) => {
        imageRef.current.src = URL.createObjectURL(blob!);
      }, 'image/jpeg')
      
      const idCardFaceDetection = await faceapi.detectSingleFace(canvas, new faceapi.TinyFaceDetectorOptions())
      //Debug Model
      .withFaceLandmarks().withFaceDescriptor();

      canvaRef.current.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

      if(idCardFaceDetection !== undefined) {
          console.log({idCardFaceDetection});
          console.log(JSON.stringify(idCardFaceDetection.descriptor));
          var { x, y, width, height } = idCardFaceDetection.detection.box;
          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(imageRef.current, x, y, width, height, 0, 0, width, height);

          canvas.toBlob(async (blob) => {
            imageRef.current.src = URL.createObjectURL(blob!);
          }, 'image/jpeg')
          if(upload) {
            //dispatch(setAuthFaceThunk(idCardFaceDetection.descriptor))
          } else {
            console.log({descriptorFromBack: descriptorFromBack!});
            
            const distance = faceapi.euclideanDistance(idCardFaceDetection.descriptor, Float32Array.from(descriptorFromBack!.values()))
            console.log({distance});
            if(distance < 0.5) {
              alert('Usuario autenticado')
            }
            
          }
      }

    }
  }

  const stopVideo = () => {
    if(stream !== null) {
      stream.getTracks().forEach((track) => {
        track.stop();
      })
      setCamStarted(false)
    }
  }

  return (
    <>
      <div style={{position: 'relative', textAlign: 'center', height: 480}}>
        <div className='borderFace'>
          <video ref={videRef} id="inputVideo" className='videoFaceCam' autoPlay muted width={534} height={400}></video>
          <canvas ref={canvaRef} id="overlay"  className='canvasFaceCam'></canvas>  
        </div>
      </div>
      <Grid container>
        <Grid item> <Button size='small' onClick={startCam} variant='contained'  color='success'> Iniciar video </Button> </Grid>
        <Grid item> <Button size='small' variant='contained' onClick={() => takeImage({upload: true})} color='warning' > Guardar descriptor </Button> </Grid>
        <Grid item> <Button size='small' onClick={stopVideo} variant='contained' color="error"> Finalizar Video </Button> </Grid>
        <Grid item> <Button size='small' variant='contained' onClick={() => takeImage({upload: false})} color='secondary'> Comparar descriptor </Button> </Grid>
      </Grid>
      <Grid container>
          <Grid item>
            <img src={authFaceImg} ref={imageRef} className="iconAuthFace" alt="" />
          </Grid>
      </Grid>
    </>
  )
}