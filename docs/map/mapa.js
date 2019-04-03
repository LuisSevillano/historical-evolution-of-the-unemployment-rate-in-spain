/* Author(s) = Manuel Maroto (@manuelgmaroto), Luis Sevillano (@SepirData)
 * Date: 2014 Oct
 */
var trimestres = new Array(
  "2015TII",
  "2015TI",
  "2014TIV",
  "2014TIII",
  "2014TII",
  "2014TI",
  "2013TIV",
  "2013TIII",
  "2013TII",
  "2013TI",
  "2012TIV",
  "2012TIII",
  "2012TII",
  "2012TI",
  "2011TIV",
  "2011TIII",
  "2011TII",
  "2011TI",
  "2010TIV",
  "2010TIII",
  "2010TII",
  "2010TI",
  "2009TIV",
  "2009TIII",
  "2009TII",
  "2009TI",
  "2008TIV",
  "2008TIII",
  "2008TII",
  "2008TI",
  "2007TIV",
  "2007TIII",
  "2007TII",
  "2007TI",
  "2006TIV",
  "2006TIII",
  "2006TII",
  "2006TI",
  "2005TIV",
  "2005TIII",
  "2005TII",
  "2005TI"
);
trimestres.reverse();

function addComas(n) {
  var formatValue = d3.format("0,000");
  return formatValue(n)
    .replace(".", ",")
    .replace(".", ",");
}
var colores = new Array("#ECC5B4", "#E3A78F", "#D9886C", "#D0694C", "#A55036");

function getColor(d) {
  return d > 40
    ? colores[4]
    : d > 30
    ? colores[3]
    : d > 20
    ? colores[2]
    : d > 10
    ? colores[1]
    : colores[0];
}

var div = d3
  .select("#wrapper")
  .append("div")
  .attr("class", "tooltip")
  .attr("opacity", 0);

var wmap = 600;
var hmap = 520;
var hCan = 100;
var wCan = 240;
var projection = d3.geo
  .mercator()
  .translate([410, 2140])
  .scale(2500);
var path = d3.geo.path().projection(projection);
var map = d3
  .select("#mapa")
  .append("svg")
  .attr("width", wmap)
  .attr("height", hmap);
var projectionCan = d3.geo
  .mercator()
  .translate([810, 1350])
  .scale(2500);
var pathCan = d3.geo.path().projection(projectionCan);
var mapCan = d3
  .select("#canarias")
  .append("svg")
  .attr("width", wCan)
  .attr("height", hCan);
d3.select("#tasa").html(
  "Trimestre " + trimestres[trimestres.length - 1].substring(5)
);
d3.select("#year").html(trimestres[trimestres.length - 1].substring(0, 4));

var height = 330,
  width = 885,
  trans = 60;
var w = 950,
  h = 380;
var aux = trimestres.length - 1;
var width_slider = 920;
var height_slider = 50;
d3.csv("../data/historico.csv", function(data) {
  d3.json("../data/Provincias.json", function(json) {
    d3.json("../data/canarian.json", function(can) {
      /* ------SLIDER----- */
      var svg = d3
        .select("#slider")
        .attr("class", "chart")
        .append("svg")
        .attr("width", width_slider)
        .attr("height", height_slider);
      var yeardomain = [0, trimestres.length - 1];
      var axisyears = [
        parseFloat(trimestres[0].substring(0, 4)),
        parseFloat(trimestres[0].substring(0, 4)),
        parseFloat(trimestres[0].substring(0, 4)),
        parseFloat(trimestres[trimestres.length - 1].substring(0, 4))
      ];

      var pointerdata = [
        {
          x: 0,
          y: 0
        },
        {
          x: 0,
          y: 25
        },
        {
          x: 25,
          y: 25
        },
        {
          x: 25,
          y: 0
        }
      ];
      var scale = d3.scale
        .linear()
        .domain(yeardomain)
        .rangeRound([0, width]);
      var x = d3.svg
        .axis()
        .scale(scale)
        .orient("top")
        .tickFormat(function(d) {
          return d;
        })
        .tickSize(0)
        .tickValues(axisyears);
      svg
        .append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + 15 + ",0)")
        .call(x);
      var drag = d3.behavior
        .drag()
        .origin(function() {
          return {
            x: d3.select(this).attr("x"),
            y: d3.select(this).attr("y")
          };
        })
        .on("dragstart", dragstart)
        .on("drag", dragmove)
        .on("dragend", dragend);

      svg
        .append("g")
        .append("rect")
        .attr("class", "slideraxis")
        .attr("width", width_slider)
        .attr("height", 7)
        .attr("x", 0)
        .attr("y", 16);
      var cursor = svg
        .append("g")
        .attr("class", "move")
        .append("svg")
        .attr("x", width)
        .attr("y", 7)
        .attr("width", 30)
        .attr("height", 60);

      cursor.call(drag);
      var drawline = d3.svg
        .line()
        .x(function(d) {
          return d.x;
        })
        .y(function(d) {
          return d.y;
        })
        .interpolate("linear");

      //---------------------------
      cursor
        .append("path")
        .attr("class", "cursor")
        .attr("transform", "translate(" + 7 + ",0)")
        .attr("d", drawline(pointerdata));
      cursor.on("mouseover", function() {
        d3.select(".move").style("cursor", "hand");
      });

      function dragmove() {
        var x = Math.max(0, Math.min(width, d3.event.x));
        d3.select(this).attr("x", x);
        var z = parseInt(scale.invert(x));
        aux = z;
        drawMap(z);
      }

      function dragstart() {
        d3.select(".cursor").style("fill", "#D9886C");
      }

      function dragend() {
        d3.select(".cursor").style("fill", "");
      }
      for (var i = 0; i < data.length; i++) {
        var codeState = data[i].code;
        var dataValue = data[i][trimestres[trimestres.length - 1]];
        //                console.log(dataValue);
        for (var j = 0; j < json.features.length; j++) {
          var jsonState = json.features[j].properties.code;
          if (codeState == jsonState) {
            json.features[j].properties.value = dataValue;
            break;
          }
        }
        for (var z = 0; z < can.features.length; z++) {
          var canState = can.features[z].properties.code;
          if (codeState == canState) {
            can.features[z].properties.value = dataValue;
            break;
          }
        }
      }
      var cont = map
        .selectAll("#mapa path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("class", "path")
        .attr("d", path)
        .style("fill", function(d) {
          return getColor(d.properties.value);
        })
        .attr("fill-opacity", "1")
        .attr("stroke", "#202020")
        .attr("stroke-width", 0.3)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseout", mouseout);
      //canarias
      var isl = mapCan
        .selectAll("#canarias path")
        .data(can.features)
        .enter()
        .append("path")
        .attr("class", "path")
        .attr("d", pathCan)
        .style("fill", function(d) {
          return getColor(d.properties.value);
        })
        .attr("fill-opacity", "1")
        .attr("stroke", "#202020")
        .attr("stroke-width", 0.3)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseout", mouseout);

      function mouseover(d) {
        d3.select(this)
          .attr("stroke-width", "1px")
          .attr("fill-opacity", "0.9");
        div.style("opacity", 0.9);
        div.html(
          "<b>" +
            d.properties.name +
            "</b></br>Tasa paro: <b>" +
            addComas(data[d.properties.code][trimestres[aux]]) +
            "%</b> <br>" +
            d.properties.comunidad
        );
      }

      function mouseout(d) {
        d3.select(this)
          .attr("stroke-width", ".3")
          .attr("fill-opacity", "1");
        div.style("opacity", 0);
      }

      function mousemove(d) {
        div.style({
          left: function() {
            if (d3.event.pageX > 780) {
              return d3.event.pageX - 180 + "px";
            } else {
              return d3.event.pageX + 23 + "px";
            }
          },
          top: d3.event.pageY - 20 + "px"
        });
      }
      //maxMin(data, aux);
      function drawMap(index) {
        d3.select("#tasa").html("Trimestre " + trimestres[index].substring(5));
        d3.select("#year").html(trimestres[index].substring(0, 4));
        cont.style("fill", function(d) {
          for (var i = 0; i < data.length; i++) {
            var codeState = data[i].code;
            var dataValue = data[i][trimestres[index]];
            for (var j = 0; j < json.features.length; j++) {
              var jsonState = json.features[j].properties.code;
              if (codeState == jsonState) {
                json.features[j].properties.value = dataValue;
                break;
              }
            }
          }
          var value = d.properties.value;
          if (value) {
            return getColor(value);
          } else {
            return "#ccc";
          }
        });
        cont
          .on("mousemove", function(d) {
            div.style("opacity", 0.9);
            div
              .html(
                "<b>" +
                  d.properties.name +
                  "</b></br>Tasa de paro: <b>" +
                  addComas(data[d.properties.code][trimestres[aux]]) +
                  "%</b> <br>" +
                  d.properties.comunidad
              )
              .style("left", function() {
                if (d3.event.pageX > 780) {
                  return d3.event.pageX - 180 + "px";
                } else {
                  return d3.event.pageX + 23 + "px";
                }
              })
              .style("top", d3.event.pageY - 20 + "px");
          })
          .on("mouseout", function() {
            return div.style("opacity", 0);
          })
          .on("mouseout", mouseout);
        isl.style("fill", function(d) {
          for (var i = 0; i < data.length; i++) {
            var codeState = data[i].code;
            var dataValue = data[i][trimestres[index]];
            for (var j = 0; j < can.features.length; j++) {
              var jsonState = can.features[j].properties.code;
              if (codeState == jsonState) {
                can.features[j].properties.value = dataValue;
                break;
              }
            }
          }
          var value = d.properties.value;
          if (value) {
            return getColor(value);
          } else {
            return "#ccc";
          }
        });
        isl
          .on("mousemove", function(d) {
            div.style("opacity", 0.9);
            div
              .html(
                "<b>" +
                  d.properties.name +
                  "</b></br>Tasa de paro: <b>" +
                  addComas(data[d.properties.code][trimestres[aux]]) +
                  "%</b> <br>" +
                  d.properties.comunidad
              )
              .style("left", function() {
                if (d3.event.pageX > 780) {
                  return d3.event.pageX - 180 + "px";
                } else {
                  return d3.event.pageX + 23 + "px";
                }
              })
              .style("top", d3.event.pageY - 20 + "px");
          })
          .on("mouseout", function() {
            return div.style("opacity", 0);
          })
          .on("mouseout", mouseout);
        maxMin(data, index);
      }
      maxMin(data, aux);

      function maxMin(d, index) {
        d3.select("#minimoParo").html("");
        d3.select("#maximoParo").html("");
        d3.select("#mediaParo").html("");
        var datos = [];
        var provincia = [];
        for (var i = 0; i < data.length - 1; i++) {
          //-1 para que no cargue Nacional
          datos.push(d[i][trimestres[index]]);
          provincia.push(d[i].state);
        }
        var max_min = d3.extent(datos);
        console.log(max_min);
        var provinciaMax;
        var provinciaMin;
        for (var j = 0; j < data.length - 1; j++) {
          if (max_min[0] == datos[j]) {
            provinciaMin = provincia[j];
          }
          if (max_min[1] == datos[j]) {
            provinciaMax = provincia[j];
          }
        }
        var nombreMediaParo = d3
          .select("#mediaParo")
          .html(addComas(data[52][trimestres[index]]) + "%");
        var nombreProvinciaMax = d3
          .select("#maximoParo")
          .html(
            addComas(max_min[1]) +
              "%<br>" +
              "<span id='provincia'>" +
              provinciaMax +
              "</span>"
          );
        var nombreProvinciaMin = d3
          .select("#minimoParo")
          .html(
            addComas(max_min[0]) +
              "%<br>" +
              "<span id='provincia'>" +
              provinciaMin +
              "</span"
          );
      }
    });
  });
});

d3.select("#wrapper").on("touchstart", function() {
  div
    .transition()
    .duration(100)
    .style("opacity", 0);
});
