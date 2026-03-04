import { Delete, ZoomOutMap } from "@mui/icons-material";
import { IconButton, ImageListItem, ImageListItemBar } from "@mui/material";

export default function ImgItemHandler(
  {src, srcSet, onClickDelete = () => {}, onClickPreview = () => {}, showButtons = true} 
  : 
  {src: string, srcSet: string, onClickDelete?:() => void, onClickPreview?: () => void, showButtons?: boolean}) {
  return (
    <ImageListItem cols={3}>
      <img 
        src={src} 
        srcSet={srcSet}
        alt=""
        loading="lazy"
      />
      {showButtons && <ImageListItemBar 
        actionIcon={
          <>
            <IconButton color="error" onClick={onClickDelete}> <Delete/> </IconButton>
            <IconButton color="info" onClick={onClickPreview}> <ZoomOutMap/> </IconButton>
          </>
        }
      />}
    </ImageListItem>
  )
}