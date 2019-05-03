const getDistanceToOffice = fullLocationData => {
  const officeCoordinates = {
    latitude: 52.502931,
    longitude: 13.408249
  };
  // calulating difference and translating degrees to radians (1° = π/180 rad ≈ 0.01745)
  const lat =
    ((officeCoordinates.latitude + fullLocationData.latitude) / 2) * 0.01745;

  // covering km/lon variation depending on the latitude (less to poles, greated near equator)
  const dx =
    111.3 *
    Math.cos(lat) *
    (officeCoordinates.longitude - fullLocationData.longitude);

  // km/lat is constand with 111.3km between two circles of longitude
  const dy = 111.3 * (officeCoordinates.latitude - fullLocationData.latitude);

  let distance = Math.sqrt(dx * dx + dy * dy);
  distance = Math.round(distance, 2);

  return `${distance} km`;
};

const checkJSONFileConsistency = (uploadedFile, fileName) => {
  if (uploadedFile.longitude && uploadedFile.latitude) {
    return true;
  } else {
    return false;
  }
};

module.exports = {
  getDistanceToOffice: getDistanceToOffice,
  checkJSONFileConsistency: checkJSONFileConsistency
};
