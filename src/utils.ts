export type CustomPlace = google.maps.places.PlaceResult & { distance: number };

export type Pair = { place: CustomPlace; marker: google.maps.Marker };
