const sources = [
  {
    id: 'states_tileset',
    region_id: '*',
    metric_id: '*',
    subgroup_id: '*',
    year: '*',
    tiles: [
      'https://firebasestorage.googleapis.com/v0/b/spi-map-5fc21.appspot.com/o/spi-tilesets%states%2Fstates%2F{z}%2F{x}%2F{y}.pbf?alt=media',
    ],
    type: 'vector',
    min_zoom: 1,
    max_zoom: 8,
  },
  {
    id: 'cities_tileset',
    region_id: '*',
    metric_id: '*',
    subgroup_id: '*',
    year: '*',
    tiles: [
      'https://firebasestorage.googleapis.com/v0/b/spi-map-5fc21.appspot.com/o/spi-tilesets%2Fcities%2Fcities%2F{z}%2F{x}%2F{y}.pbf?alt=media',
    ],
    type: 'vector',
    min_zoom: 7,
    max_zoom: 11,
  },
  {
    id: 'tracts_tileset',
    region_id: '*',
    metric_id: '*',
    subgroup_id: '*',
    year: '*',
    tiles: [
      'https://firebasestorage.googleapis.com/v0/b/spi-map-5fc21.appspot.com/o/spi-tilesets/tracts/tracts/{z}/{x}/{y}.pbf',
    ],
    type: 'vector',
    min_zoom: 11,
    max_zoom: 20,
  },
];

export default sources;