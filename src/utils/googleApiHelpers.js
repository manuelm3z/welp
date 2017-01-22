export function searchNearby(google, map, request) {
	return new Promise((resolve, reject) => {
		const service = new google.maps.places.PlaceService(map);

		serice.nearbySearch(request, (results, status, pagination) => {
			if (status == google.maps.places.PlacesServiceStatus.OK) {
				resolve(results, pagination);
			} else {
				reject(results, status);
			}
		})
	})
}