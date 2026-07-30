import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export function useMap() {
  let mapInstance: L.Map | null = null;

  const initMap = async (elementId: string, ubicacion?: string, defaultLat = -38.7359, defaultLng = -72.5904) => {
    let lat = defaultLat;
    let lng = defaultLng;

    if (ubicacion) {
      try {
        const query = encodeURIComponent(`${ubicacion}, Temuco, Chile`);
        const response = await fetch(`https://photon.komoot.io/api/?q=${query}&limit=1`);
        if (response.ok) {
          const datos = await response.json();
          if (datos.features && datos.features.length > 0) {
            lng = datos.features[0].geometry.coordinates[0];
            lat = datos.features[0].geometry.coordinates[1];
          }
        }
      } catch (error) {
        console.error('Error de geocodificación con Photon:', error);
      }
    }

    if (mapInstance) {
      mapInstance.remove();
    }

    mapInstance = L.map(elementId).setView([lat, lng], 15);

    // Nueva capa de mapa más profesional y limpia
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(mapInstance);

    const customIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });

    const popupText = ubicacion || 'Ubicación Desconocida';
    L.marker([lat, lng], { icon: customIcon })
        .addTo(mapInstance)
        .bindPopup(`<b>${popupText}</b>`)
        .openPopup();
  };

  const destroyMap = () => {
    if (mapInstance) {
      mapInstance.remove();
      mapInstance = null;
    }
  };

  return {
    initMap,
    destroyMap
  };
}