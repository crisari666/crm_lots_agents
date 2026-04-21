import React, { useEffect, useMemo, useState } from "react"
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography
} from "@mui/material"
import Close from "@mui/icons-material/Close"
import DeleteOutline from "@mui/icons-material/DeleteOutline"
import AddPhotoAlternate from "@mui/icons-material/AddPhotoAlternate"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import type { Theme } from "@mui/material/styles"
import { useAppDispatch } from "../../../app/hooks"
import {
  createProjectReleaseThunk,
  deleteProjectReleaseImageThunk,
  updateProjectReleaseThunk,
  uploadProjectReleaseImageThunk,
  fetchProjectReleasesThunk
} from "../slice/project-releases.slice"
import type { ProjectRelease, ProjectReleaseListStatus } from "../types/project-release.types"
import { buildProjectReleaseAssetUrl } from "../utils/project-release-assets.util"
import { PROJECT_IMAGE_MAX_BYTES } from "../../project/utils/project-uploads.util"

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"]
  ]
}

const descriptionEditorMinHeight = (theme: Theme) => {
  const lh = theme.typography.body1.lineHeight
  const lineHeightUnitless = typeof lh === "number" ? lh : Number.parseFloat(String(lh)) || 1.5
  return `${4 * lineHeightUnitless}em`
}

const uploadsBaseUrl = import.meta.env.VITE_URL_RAG_AGENT_UPLOADS ?? ""

type Mode = "create" | "edit"

type ProjectReleaseDialogCPProps = {
  open: boolean
  onClose: () => void
  mode: Mode
  initialRelease: ProjectRelease | null
  listTab: ProjectReleaseListStatus
}

export default function ProjectReleaseDialogCP({
  open,
  onClose,
  mode,
  initialRelease,
  listTab
}: ProjectReleaseDialogCPProps) {
  const dispatch = useAppDispatch()
  const [title, setTitle] = useState("")
  const [location, setLocation] = useState("")
  const [googleMapLocation, setGoogleMapLocation] = useState("")
  const [description, setDescription] = useState("")
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const [saving, setSaving] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setLocalError(null)
    setPendingFiles([])
    if (mode === "edit" && initialRelease) {
      setTitle(initialRelease.title)
      setLocation(initialRelease.location)
      setGoogleMapLocation(initialRelease.googleMapLocation)
      setDescription(initialRelease.description ?? "")
    } else {
      setTitle("")
      setLocation("")
      setGoogleMapLocation("")
      setDescription("")
    }
  // Only re-seed when opening or switching record; omit initialRelease body deps so image-only updates do not reset the form.
  // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional
  }, [open, mode, initialRelease?._id])

  const existingImages = mode === "edit" && initialRelease ? initialRelease.images ?? [] : []

  const validate = () => {
    if (!title.trim() || !location.trim() || !googleMapLocation.trim()) {
      setLocalError("Título, ubicación y enlace de Google Maps son obligatorios.")
      return false
    }
    return true
  }

  const addFiles = (files: FileList | null) => {
    if (!files?.length) return
    const next: File[] = []
    for (let i = 0; i < files.length; i++) {
      const f = files[i]
      if (f.size > PROJECT_IMAGE_MAX_BYTES) {
        setLocalError(`"${f.name}" supera el tamaño máximo (${Math.round(PROJECT_IMAGE_MAX_BYTES / (1024 * 1024))} MB).`)
        return
      }
      next.push(f)
    }
    setLocalError(null)
    setPendingFiles((prev) => [...prev, ...next])
  }

  const handleSubmit = async () => {
    if (!validate()) return
    if (mode === "edit" && !initialRelease) return
    setSaving(true)
    setLocalError(null)
    try {
      if (mode === "create") {
        const created = await dispatch(
          createProjectReleaseThunk({
            title: title.trim(),
            location: location.trim(),
            googleMapLocation: googleMapLocation.trim(),
            description: description.trim() || undefined
          })
        ).unwrap()
        for (const file of pendingFiles) {
          await dispatch(uploadProjectReleaseImageThunk({ releaseId: created._id, file })).unwrap()
        }
      } else if (initialRelease) {
        await dispatch(
          updateProjectReleaseThunk({
            id: initialRelease._id,
            data: {
              title: title.trim(),
              location: location.trim(),
              googleMapLocation: googleMapLocation.trim(),
              description: description.trim()
            }
          })
        ).unwrap()
        for (const file of pendingFiles) {
          await dispatch(
            uploadProjectReleaseImageThunk({ releaseId: initialRelease._id, file })
          ).unwrap()
        }
      }
      await dispatch(fetchProjectReleasesThunk(listTab))
      onClose()
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "No se pudo guardar."
      setLocalError(msg)
    } finally {
      setSaving(false)
    }
  }

  const handleRemoveExisting = async (imageName: string) => {
    if (!initialRelease) return
    if (!window.confirm("¿Eliminar esta imagen?")) return
    setSaving(true)
    setLocalError(null)
    try {
      await dispatch(
        deleteProjectReleaseImageThunk({ releaseId: initialRelease._id, imageName })
      ).unwrap()
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "No se pudo eliminar la imagen."
      setLocalError(msg)
    } finally {
      setSaving(false)
    }
  }

  const quillSx = useMemo(
    () => (theme: Theme) => ({
      "& .quill": { bgcolor: "background.paper" },
      "& .ql-toolbar": {
        borderTopLeftRadius: theme.shape.borderRadius,
        borderTopRightRadius: theme.shape.borderRadius,
        borderColor: "divider"
      },
      "& .ql-container": {
        borderBottomLeftRadius: theme.shape.borderRadius,
        borderBottomRightRadius: theme.shape.borderRadius,
        borderColor: "divider",
        fontFamily: theme.typography.fontFamily
      },
      "& .ql-editor": {
        minHeight: descriptionEditorMinHeight(theme)
      }
    }),
    []
  )

  return (
    <Dialog open={open} onClose={() => !saving && onClose()} fullWidth maxWidth="md">
      <DialogTitle sx={{ pr: 6 }}>
        {mode === "create" ? "Nuevo proyecto release" : "Editar proyecto release"}
        <IconButton
          aria-label="cerrar"
          onClick={() => !saving && onClose()}
          sx={{ position: "absolute", right: 8, top: 8, cursor: "pointer" }}
          disabled={saving}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          {localError ? (
            <Typography color="error" variant="body2">
              {localError}
            </Typography>
          ) : null}
          <TextField
            label="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
            disabled={saving}
          />
          <TextField
            label="Ubicación (texto)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            fullWidth
            disabled={saving}
            helperText="Nombre legible del lugar."
          />
          <TextField
            label="Google Maps (URL o embed)"
            value={googleMapLocation}
            onChange={(e) => setGoogleMapLocation(e.target.value)}
            required
            fullWidth
            disabled={saving}
          />
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Descripción
            </Typography>
            <Box sx={quillSx}>
              <ReactQuill theme="snow" modules={quillModules} value={description} onChange={setDescription} readOnly={saving} />
            </Box>
          </Box>

          {mode === "edit" && existingImages.length > 0 ? (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Imágenes actuales
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {existingImages.map((name) => (
                  <Box
                    key={name}
                    sx={{
                      position: "relative",
                      width: 100,
                      height: 100,
                      borderRadius: 1,
                      overflow: "hidden",
                      border: 1,
                      borderColor: "divider"
                    }}
                  >
                    <Box
                      component="img"
                      src={buildProjectReleaseAssetUrl(uploadsBaseUrl, name)}
                      alt=""
                      sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveExisting(name)}
                      disabled={saving}
                      sx={{
                        position: "absolute",
                        top: 2,
                        right: 2,
                        bgcolor: "background.paper",
                        cursor: "pointer",
                        "&:hover": { bgcolor: "background.paper" }
                      }}
                      aria-label="eliminar imagen"
                    >
                      <DeleteOutline fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
            </Box>
          ) : null}

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {mode === "create" ? "Imágenes (después de crear se suben)" : "Añadir imágenes"}
            </Typography>
            <Button
              variant="outlined"
              component="label"
              startIcon={<AddPhotoAlternate />}
              disabled={saving}
              sx={{ cursor: "pointer" }}
            >
              Elegir archivos
              <input
                type="file"
                hidden
                multiple
                accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                onChange={(e) => {
                  addFiles(e.target.files)
                  e.target.value = ""
                }}
              />
            </Button>
            {pendingFiles.length > 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Pendientes: {pendingFiles.map((f) => f.name).join(", ")}
              </Typography>
            ) : null}
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={() => !saving && onClose()} disabled={saving} sx={{ cursor: "pointer" }}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={saving} sx={{ cursor: "pointer" }}>
          {saving ? "Guardando…" : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
