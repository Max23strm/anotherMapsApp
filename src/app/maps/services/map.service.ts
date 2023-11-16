import { Injectable } from '@angular/core';
import { AnySourceData, LngLatBounds, LngLatLike, Map, Marker, Popup } from 'mapbox-gl';
import { Feature } from '../interfaces/places.interface';
import { DirectionsApiClient } from '../api/directionsApiClient'
import { DirectionsResponse, Route } from '../interfaces/directions.interface';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private map: Map | undefined;
  private markers: Marker[] =[]

  get isMapReady() {
    return !!this.map
  }

  constructor (private directionsApi : DirectionsApiClient){}

  setMap(map: Map){
    this.map = map
  }

  flyTo ( coords:LngLatLike){
    if( !this.isMapReady) throw new Error ("El mapa no esta inicializado")

    this.map?.flyTo({
      zoom: 14,
      center:coords
    })
  }

  createMarkerFromPlaces (places: Feature[], userlocation: [number, number] | undefined) {

    if(!this.map) throw new Error ('Mapa no inicializado')

    this.markers.forEach(marker => marker.remove());

    const newMarkers=[];

    for( const place of places) {
      const [lng, lat] = place.center;

      const popUp = new Popup()
      .setHTML(`
          <h6>${place.text}</h6>
          <span>${place.place_name}</span>
          `);

      const newMarker = new Marker()
        .setLngLat([lng,lat])
        .setPopup(popUp)
        .addTo(this.map)

        newMarkers.push(newMarker)
    }

    this.markers = newMarkers
    if(places.length === 0) return

    //Limites del mapa
    const bounds = new LngLatBounds()

    newMarkers.forEach(e=>bounds.extend(e.getLngLat()))
    if(userlocation) bounds.extend(userlocation)

    this.map.fitBounds(bounds,{
      padding: 200
    })
  }

  getRouteBetweenPoints(start:[number, number], end:[number, number]) {
    this.directionsApi.get<DirectionsResponse>(`/${start.join(",")};${end.join(',')}`)
      .subscribe(resp=> this.drawPolyline(resp.routes[0]))
  }

  private drawPolyline( ruta: Route) {
    console.log({distance: ruta.distance/ 1000, diration: ruta.duration / 60})

    if(!this.map) throw new Error ('No mapa iniciado')

    const coords = ruta.geometry.coordinates;

    const bounds = new LngLatBounds()

    coords.forEach(([lng, lat]) =>{
      bounds.extend([lng, lat])
    })


    this.map.fitBounds(bounds, {padding: 200})

    const sourceData: AnySourceData = {
      type:'geojson',
      data:{
        type:'FeatureCollection',
        features:[
          {
            type:'Feature',
            properties:{},
            geometry:{
              type:'LineString',
              coordinates:coords
            }
          }
        ]
      }
    }

    if(this.map.getLayer('RouteString')){
      this.map.removeLayer('RouteString');
      this.map.removeSource('RouteString');
    }

    this.map.addSource('RouteString', sourceData);

    this.map.addLayer({
      id:'RouteString',
      type:'line',
      source: 'RouteString',
      layout:{
        "line-cap":'round',
        'line-join':'round'
      },
      paint:{
        "line-color":'red',
        "line-width":3
      }
    })

  

  }



}
