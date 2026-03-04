import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import { CustomerResumeCallLog } from "../../../../../app/models/customer-resume-model";
import { dateUTCToFriendly } from "../../../../../utils/date.utils";
import { CallMade, CallReceived, Psychology, CheckCircle, Cancel } from "@mui/icons-material";
import CallLogTranscriptionModal from "./call-log-transcription-modal";
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { analyzeCallLogThunk } from "../../customer-view.slice";

export default function CustomerCallLogs({ callLogs }: { callLogs: CustomerResumeCallLog[] }) {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.customer);
  const [selectedTranscription, setSelectedTranscription] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [analyzingCallSId, setAnalyzingCallSId] = useState<string | null>(null);

  // Reverse array to show most recent first
  const sortedCallLogs = [...callLogs].reverse();

  const formatDuration = (seconds: number | null): string => {
    if (seconds === null || seconds === undefined) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleTranscriptionClick = (transcription: string) => {
    setSelectedTranscription(transcription);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedTranscription(null);
  };

  const truncateTranscription = (text: string | undefined): string => {
    if (!text) return "Sin transcripción";
    if (text.length <= 20) return text;
    return text.substring(0, 20) + "...";
  };

  const handleAnalyze = async (callSId: string) => {
    setAnalyzingCallSId(callSId);
    try {
      await dispatch(analyzeCallLogThunk({ callSId })).unwrap();
    } catch (error) {
      console.error("Error analyzing call log:", error);
    } finally {
      setAnalyzingCallSId(null);
    }
  };

  const renderAnalysisIndicators = (analysis: CustomerResumeCallLog["analysis"]) => {
    if (!analysis) return null;

    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <Chip
          icon={analysis.cliente_interesado ? <CheckCircle /> : <Cancel />}
          label="Cliente interesado"
          color={analysis.cliente_interesado ? "success" : "default"}
          size="small"
          sx={{ fontSize: "0.7rem" }}
        />
        <Chip
          icon={analysis.envio_documentacion ? <CheckCircle /> : <Cancel />}
          label="Envío documentación"
          color={analysis.envio_documentacion ? "success" : "default"}
          size="small"
          sx={{ fontSize: "0.7rem" }}
        />
        <Chip
          icon={analysis.informacion_situacion_migratoria ? <CheckCircle /> : <Cancel />}
          label="Info situación migratoria"
          color={analysis.informacion_situacion_migratoria ? "success" : "default"}
          size="small"
          sx={{ fontSize: "0.7rem" }}
        />
        <Chip
          icon={analysis.solicito_llamada ? <CheckCircle /> : <Cancel />}
          label="Solicitó llamada"
          color={analysis.solicito_llamada ? "success" : "default"}
          size="small"
          sx={{ fontSize: "0.7rem" }}
        />
      </Box>
    );
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Duración</TableCell>
              <TableCell>Transcripción</TableCell>
              <TableCell>Análisis</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedCallLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No hay registros de llamadas
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              sortedCallLogs.map((callLog) => (
                <TableRow key={callLog._id}>
                  <TableCell>
                    <Typography variant="body2">
                      {dateUTCToFriendly(callLog.date)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={callLog.event === "outgoing" ? <CallMade /> : <CallReceived />}
                      label={callLog.event === "outgoing" ? "Saliente" : "Entrante"}
                      color={callLog.event === "outgoing" ? "primary" : "success"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDuration(callLog.duration)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {callLog.transcription ? (
                      <Typography
                        variant="body2"
                        sx={{
                          cursor: "pointer",
                          color: "primary.main",
                          textDecoration: "underline",
                          "&:hover": {
                            color: "primary.dark",
                          },
                        }}
                        onClick={() => handleTranscriptionClick(callLog.transcription!)}
                      >
                        {truncateTranscription(callLog.transcription)}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Sin transcripción
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {callLog.analysis ? (
                      renderAnalysisIndicators(callLog.analysis)
                    ) : callLog.transcription ? (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={
                          analyzingCallSId === callLog.callSId ? (
                            <CircularProgress size={16} />
                          ) : (
                            <Psychology />
                          )
                        }
                        onClick={() => handleAnalyze(callLog.callSId)}
                        disabled={analyzingCallSId === callLog.callSId || loading}
                      >
                        Analizar
                      </Button>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Sin análisis
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <CallLogTranscriptionModal
        open={openModal}
        transcription={selectedTranscription || ""}
        onClose={handleCloseModal}
      />
    </>
  );
}

