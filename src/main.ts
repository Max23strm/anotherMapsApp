import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

import Mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"

Mapboxgl.accessToken = 'pk.eyJ1IjoibWF4LW92ZWphayIsImEiOiJjbGx6Z3FqdXQybDRyM2twaXgzODV2anNlIn0.pRGNGplB_2FMObgiCTzahg';

if(!navigator.geolocation){
  alert('Navegador no soporta la Geolocalizacion')
  throw new Error('Navegador no soporta la Geolocalizacion')
}


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
