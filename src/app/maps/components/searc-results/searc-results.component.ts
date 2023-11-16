import { Component } from '@angular/core';
import { MapService, PlacesService } from '../../services';
import { Feature } from '../../interfaces/places.interface';

@Component({
  selector: 'app-searc-results',
  templateUrl: './searc-results.component.html',
  styleUrls: ['./searc-results.component.css']
})
export class SearcResultsComponent {

  public selectedId :string =""

  constructor(
      private placesService:PlacesService,
      private mapService:MapService
  ){}

  get isLoadingPlaces() {
    return this.placesService.isLoadingPlaces
  }
  get places() {
    return this.placesService.places
  }

  flyTo (place : Feature) {
    this.selectedId = place.id
    const [lng, lat] = place.center
    this.mapService.flyTo([lng,lat])
  }

  getDirections(place:Feature){

    if(!this.placesService.userLocation) throw new Error('No hay user location')

    const start = this.placesService.userLocation
    const end = place.center as [number, number]

    this.mapService.getRouteBetweenPoints(start,end)

    this.placesService.deletePlaces()
  }

}
