# Buscador y filtro de elementos de una capa de polígonos en Leaflet.
Buscador de elementos con Leaflet, Bootstrap 4.6, Geoserver y Postgis

![wfs](https://user-images.githubusercontent.com/16272697/129121000-45718515-906a-4602-9fc6-2e9f8d66a0ab.png)

Información acerca del proyecto.

Se implementa un buscador de elementos de una capa de geometría de polígonos utilizando un servicio WFS. Para el mismo se utiliza las tecnologías Leaflet, Bootstrap 4.6, jQuery, Geoserver y PostgreSQL con la extensión PostGIS.

Proyecto basado en el canal "ivinamri" segun video original titulado "Publishing WMS and WFS with GeoServer and Leaflet".

Log de cambios respecto al código original:
13 de Julio de 2021: Se añade la función strStripAccents() al valor de la variable "queryLayer" a fin de que ignore los acentos en el campo de texto de busqueda.
