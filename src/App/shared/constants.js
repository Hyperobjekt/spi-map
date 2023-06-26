export const MAPBOX_TOKEN = `pk.eyJ1IjoiaHlwZXJvYmpla3QiLCJhIjoiY2pzZ3Bnd3piMGV6YTQzbjVqa3Z3dHQxZyJ9.rHobqsY_BjkNbqNQS4DNYw`;
export const MAP_STYLE = 'mapbox://styles/hyperobjekt/cl007w05t000414oaog417i9s';

export const FULL_FUNCT_ZOOM_THRESHOLD = 5;
export const FLY_TO_ZOOM = 13;

export const US_BOUNDS = [
  [-130, 24],
  [-65, 50],
];

export const coordsToFly = {
  15: {
    center: [-157.86, 21.31],
    zoom: 6.7,
  }
}

export const coordsToFlyOnMobile = {
  15: {
    center: [-157.86, 21.31],
    zoom: 5.5,
  }
}

export const boundsToFly = {
  '02': {
    latitude: 63.04,
    longitude: -155.11,
    zoom: 3.85,
  },
  15: {
    latitude: 23.29,
    longitude: -163.39,
    zoom: 5.52,
  },
};

export const boundsToFlyOnMobile = {
  '02': {
    latitude: 61.6,
    longitude: -153.93,
    zoom: 2.37,
  },
  15: {
    latitude: 20.68,
    longitude: -159.55,
    zoom: 4.61,
  },
};
