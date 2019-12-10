<template>
  <vl-map :load-tiles-while-animating="true" :load-tiles-while-interacting="true" data-projection="EPSG:4326" style="height: 400px">
    <vl-view :zoom.sync="zoom" :center.sync="center" :rotation.sync="rotation"></vl-view>

    <vl-layer-tile>
      <vl-source-sputnik></vl-source-sputnik>
    </vl-layer-tile>

    <vl-layer-tile id="wmts">
      <vl-source-wmts :attributions="attribution" :url="url" :layer-name="layerName" :matrix-set="matrixSet" :format="format" 
                      :style-name="styleName"></vl-source-wmts>
    </vl-layer-tile>
  </vl-map>
</template>

<script>
  export default {
    data () {
      return { 
        zoom: 2,
        center: [-90, 50],
        rotation: 0,
        url: 'https://services.arcgisonline.com/arcgis/rest/services/Demographics/USA_Population_Density/MapServer/WMTS/',
        layerName: '0',
        matrixSet: 'EPSG:3857',
        format: 'image/png',
        styleName: 'default',
        attribution: 'Tiles © <a href="https://services.arcgisonline.com/arcgis/rest/' +
                                        'services/Demographics/USA_Population_Density/MapServer/">ArcGIS</a>',
      }
    },
  }
</script>