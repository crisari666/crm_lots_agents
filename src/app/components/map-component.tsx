import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { ElementRef, useEffect, useRef, useState } from "react";

export default function MapComponent({ center, zoom, markers, onClick}: {
  center: google.maps.LatLngLiteral, zoom: number, markers: google.maps.Marker[], 
  onClick?: ({lat, lng} : {lat: number, lng: number}) => void
}) {
  const [map, setMap] = useState<google.maps.Map>()
  const ref = useRef<ElementRef<"div">>()
  const [markerCluster, setMarkerClusters] = useState<MarkerClusterer>();
  

  useEffect(() => {
    if(ref.current && !map){
      setMap(new window.google.maps.Map(ref.current, {
        center,
        zoom,
      }))
      console.log({map});

    }
    if(map && !markerCluster){
      map!.addListener('click', (e: google.maps.MapMouseEvent)=> {
        if(e.latLng && onClick){
          const {lat, lng} = e.latLng
          onClick({lat: lat(), lng: lng()})
        }
      })
      setMarkerClusters(new MarkerClusterer({map, markers, }));
    }
  },[ref, map])
  
  useEffect(() => {
    if(markerCluster){
      markerCluster.clearMarkers();
      markerCluster.addMarker(markers[0])
    }
  }, [markers]
  )

  return (
    <div ref={ref as any} id="map" style={{height: "100%", width: "100%", minHeight:"600px"}} />
  )

}
