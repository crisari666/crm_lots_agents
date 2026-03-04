import { Divider, Grid } from '@mui/material';
import * as faceapi from 'face-api.js';
import { RefObject, useEffect, useRef } from 'react';
import img1 from '../img_auth/20240625_104033.jpg';
import img2 from '../img_auth/20240625_104057.jpg';
import img3 from '../img_auth/multiple_faces.jpeg';

export default function FaceAuthView() {
  const idCardRef = useRef<any>();
  const selfieRef = useRef<any>();
  const multiFaceRef = useRef<any>();
  const canvasRef = useRef<any>(null);

  const renderFace = async (img: any, x: any, y: any, width: any, height: any) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    ctx?.drawImage(img, x, y, width, height, 0, 0, width, height);
    canvas.toBlob(async (blob) => {
      img.src = URL.createObjectURL(blob!);
    }, 'image/jpeg')
  }

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
      await faceapi.nets.faceExpressionNet.loadFromUri('/models');
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');

      const idCardFaceDetection = await faceapi.detectSingleFace(idCardRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();

      console.log({idCardFaceDetection});
      
      
      const selfieFaceDetection = await faceapi.detectSingleFace(selfieRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
      
      console.log({selfieFaceDetection});


      if(idCardFaceDetection) {
        const { x, y, width, height } = idCardFaceDetection.detection.box;
        renderFace(idCardRef.current, x, y, width, height);
      }
      
      if(selfieFaceDetection) {
        const { x, y, width, height } = selfieFaceDetection.detection.box;
        renderFace(selfieRef.current, x, y, width, height);
      }
      putImageAtCanvas(multiFaceRef)
      detectMultipleFaces();
    }
    loadModels();
  }, [])

  const putImageAtCanvas = async (img: RefObject<any>) => {
    const canvas = canvasRef.current;
    canvas.width = 600;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');

    ctx?.drawImage(img.current, 0, 0, 600, 300);
    canvas.toBlob(async (blob: any) => {
      img.current.src = URL.createObjectURL(blob!);
    }, 'image/jpeg')
  }

  const detectMultipleFaces = async () => {
    let fullFaceDescriptions = await faceapi.detectAllFaces(multiFaceRef.current).withFaceLandmarks().withFaceDescriptors().withFaceExpressions();

    console.log({fullFaceDescriptions});

    fullFaceDescriptions = faceapi.resizeResults(fullFaceDescriptions, {width: 600, height: 300});

    faceapi.draw.drawDetections(canvasRef.current, fullFaceDescriptions);
    faceapi.draw.drawFaceLandmarks(canvasRef.current, fullFaceDescriptions);
    faceapi.draw.drawFaceExpressions(canvasRef.current, fullFaceDescriptions);
  }
  return (
    <div>
      <h1>FaceAuthView</h1>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <img className='auth_face' ref={selfieRef} src={img1} alt="" />
        </Grid>
        <Grid item xs={6}>
          <img  className='auth_face' ref={idCardRef}  src={img2} alt="" />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={6}>
          <img  className='auth_face' ref={multiFaceRef}  src={img3} alt="" />
        </Grid>
      </Grid>
      <Divider sx={{marginBlock: 3}}/>
      <canvas ref={canvasRef} height={300} width={600} style={{backgroundColor: 'orange'}}/>
    </div>
  );
}