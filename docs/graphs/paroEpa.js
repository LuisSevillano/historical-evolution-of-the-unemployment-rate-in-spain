/* Author(s) = Manuel Maroto (@manuelgmaroto), Luis Sevillano (@SepirData)
 * Date: 2014 Oct
 */
window.onload = search();
var dispositivo,
  Aedades = new Array(
    "16-19",
    "20-24",
    "25-29",
    "30-34",
    "35-39",
    "40-44",
    "45-49",
    "50-54",
    "55-59",
    "60-64",
    "65-69",
    "+70"
  ),
  nombresSectores = new Array(
    "Agricultura",
    "Industria",
    "Construcción",
    "Servicios",
    "Otros*"
  ),
  widthBar = 415,
  bar_height = 20,
  heightBar = bar_height * edades.length,
  xFrom,
  y,
  leftWidth = 20,
  gap = 1,
  labelArea = 160,
  rightOffset = widthBar + labelArea,
  indicesH,
  indicesM,
  color = d3.scale
    .linear()
    .range(["#ECC5B4", "#E3A78F", "#D9886C", "#D0694C", "#A55036"]);
Aedades.reverse();

function search() {
  var tipoDispositivo = navigator.userAgent.toLowerCase();
  if (tipoDispositivo.search(/iphone|ipod|ipad|android/) > -1) {
    dispositivo = "click";
  } else {
    dispositivo = "mouseover";
  }
}

var numeros = new Array(0, 5, 10, 15, 20, 25, 30, 35, 40, 45);
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
  var formatValue = d3.format("0.000");
  return formatValue(n).replace(".", ",");
}
var years = new Array(
  "2005",
  "2006",
  "2007",
  "2008",
  "2009",
  "2010",
  "2011",
  "2012",
  "2013",
  "2014",
  "2015"
);
var div = d3
  .select("#wrapper")
  .append("div")
  .attr("class", "tooltip");
var height = 330,
  width = 900,
  trans = 22;
var w = 970,
  h = 350;
d3.csv("../data/historico.csv", function(csv) {
  d3.csv("../data/edades.csv", function(edades) {
    d3.csv("../data/sectores.csv", function(sectores) {
      var fiebre = new Array();
      for (i = 0; i < trimestres.length; i++) {
        fiebre.push({
          trim: trimestres[i],
          une: csv[52][trimestres[i]]
        });
      }
      var contenedorSvg = d3
        .select("#contenedorGrafico")
        .append("svg")
        .attr("width", w)
        .attr("height", h);
      var escalaX = d3.scale
        .linear()
        .domain([0, trimestres.length - 1])
        .range([0, width]);
      var escalaY = d3.scale
        .linear()
        .domain([0, 30])
        .range([height, 10]);
      var ejeY = d3.svg
        .axis()
        .scale(escalaY)
        .orient("left")
        .ticks(11);
      var ejeX = d3.svg
        .axis()
        .scale(escalaX)
        .orient("bottom")
        .ticks(13);
      var interpolate = "cardinal";
      var area = d3.svg
        .area()
        .x(function(d, i) {
          return escalaX(i);
        })
        .y0(height)
        .y1(function(d) {
          return escalaY(d.une);
        })
        .interpolate(interpolate);
      var funcionLinea = d3.svg
        .line()
        .x(function(d, i) {
          return escalaX(i);
        })
        .y(function(d, i) {
          return escalaY(d.une);
        })
        .interpolate(interpolate);
      var dibujaLinea = contenedorSvg
        .append("path")
        .attr("d", funcionLinea(fiebre))
        .attr("stroke", "#C46448")
        .attr("stroke-width", 3)
        .attr("fill", "none")
        .attr("transform", "translate(" + trans + ",0)");
      contenedorSvg
        .append("path")
        .datum(fiebre)
        .attr("class", "area")
        .attr("d", area)
        .attr("transform", "translate(" + trans + ",0)");
      contenedorSvg
        .selectAll(".xLabel")
        .data(escalaX.ticks(13))
        .enter()
        .append("svg:text")
        .attr("class", "xLabel")
        .text(function(d, i) {
          return trimestres[d];
        })
        .attr("x", function(d) {
          return escalaX(d);
        })
        .attr("y", h);
      contenedorSvg
        .selectAll(".yLabel")
        .data(escalaY.ticks(20))
        .enter()
        .append("svg:text")
        .attr("class", "yLabel")
        .attr("text-anchor", "end")
        .text(function(d, i) {
          return i * 2;
        })
        .attr("y", function(d) {
          return escalaY(d);
        })
        .attr("x", 15)
        .attr("transform", "translate(0," + 3 + ")");
      contenedorSvg
        .append("g")
        .attr("class", "grid")
        .attr("stroke", "black")
        .attr("stroke-width", 0.5)
        .attr("opacity", 0.3)
        .attr("transform", "translate(" + trans + "," + height + ")")
        .call(ejeX.tickSize(-320, 0, 0).tickFormat(""));
      contenedorSvg
        .append("g")
        .attr("class", "grid")
        .attr("stroke", "black")
        .attr("stroke-width", 0.5)
        .attr("opacity", 0.3)
        .call(ejeY.tickSize(-width, 0, 0).tickFormat(""))
        .attr("transform", "translate(" + trans + ",0)");
      contenedorSvg
        .selectAll("rect")
        .data(fiebre)
        .enter()
        .append("rect")
        .attr("x", function(d, i) {
          return escalaX(i) - 12;
        })
        .attr("y", 0)
        .attr("height", height)
        .attr("width", 24)
        .attr("transform", "translate(" + trans + ",0)")
        .attr("opacity", 0)
        .on(dispositivo, function(d, i) {
          d3.select(this).call(eliminar);
          return mouseover(d, i);
        })
        .on("mouseout", mouseOut);
      div.style("opacity", 0.8);
      div.html(
        fiebre[fiebre.length - 1].trim.substring(5) +
          "Trimestre " +
          fiebre[fiebre.length - 1].trim.substring(0, 4) +
          "</br><b>" +
          addComas(fiebre[fiebre.length - 1].une) +
          "%</b> Tasa paro"
      );
      div.style("left", "760px").style("top", "115px");
      contenedorSvg
        .append("circle")
        .attr("cx", 900)
        .attr("cy", escalaY(fiebre[fiebre.length - 1].une))
        .attr("r", 4)
        .attr("id", "circulo")
        .attr("transform", "translate(" + trans + ",0)")
        .attr("fill", "#C46448");

      function mouseOut(d) {
        div.style("opacity", 0);
      }

      function mouseover(d, i) {
        var centroX = escalaX(i);
        var centroY = escalaY(d.une);
        contenedorSvg
          .append("line")
          .attr("x1", 0)
          .attr("y1", centroY)
          .attr("x2", width)
          .attr("y2", centroY)
          .attr("stroke-width", 1)
          .attr("stroke", "gray")
          .attr("transform", "translate(" + trans + ",0)")
          .attr("id", "linea1")
          .attr("pointer-events", "none");
        contenedorSvg
          .append("line")
          .attr("x1", centroX)
          .attr("y1", height)
          .attr("x2", centroX)
          .attr("y2", 10)
          .attr("stroke-width", 1)
          .attr("stroke", "gray")
          .attr("transform", "translate(" + trans + ",0)")
          .attr("id", "linea2")
          .attr("pointer-events", "none");
        contenedorSvg
          .append("circle")
          .attr("cx", centroX)
          .attr("cy", centroY)
          .attr("r", 4)
          .attr("id", "circulo")
          .attr("transform", "translate(" + trans + ",0)")
          .attr("fill", "#C46448");
        div.style("opacity", 0.8);
        div.html(
          d.trim.substring(5) +
            " Trimestre " +
            d.trim.substring(0, 4) +
            "</br><b>" +
            addComas(d.une) +
            "%</b> Tasa paro"
        );
        div
          .style("left", function() {
            return d3.event.pageX > w - 200
              ? d3.event.pageX - 190 + "px"
              : d3.event.pageX + 20 + "px";
          })
          .style("top", centroY + 40 + "px");
        totValue.text(function() {
          return d.une + "%";
        });
        d3.select("#donut", update(d));
      }

      function eliminar() {
        var linea1 = document.getElementById("linea1");
        var linea2 = document.getElementById("linea2");
        var circulo = document.getElementById("circulo");
        var circuloIn = document.getElementById("circuloIn");
        if (circulo) {
          var madre = circulo.parentNode;
          madre.removeChild(circulo);
        }
        if (circuloIn) {
          var madre = circuloIn.parentNode;
          madre.removeChild(circuloIn);
        }
        if (linea1 && linea2) {
          var padre = linea1.parentNode;
          padre.removeChild(linea1);
          padre.removeChild(linea2);
        }
      }

      var xLeft = d3.scale
        .linear()
        .domain([0, 100])
        .range([0, widthBar]);
      var xRight = d3.scale
        .linear()
        .domain([0, 100])
        .range([0, widthBar]);
      var chartM = d3
        .select("#barrasM")
        .append("svg")
        .attr("class", "chart")
        .attr("width", leftWidth + widthBar)
        .attr("height", (bar_height + gap * 2) * Aedades.length + 30)
        .append("g")
        .attr("transform", "translate(3, 0)");
      var chartH = d3
        .select("#barrasH")
        .append("svg")
        .attr("class", "chart")
        .attr("width", leftWidth + widthBar)
        .attr("height", (bar_height + gap * 2) * Aedades.length + 30)
        .append("g")
        .attr("transform", "translate(-3, 0)");
      var edadesText = d3
        .select("#edades")
        .append("svg")
        .attr("width", 60)
        .attr("class", "edades")
        .attr("height", (bar_height + gap * 2) * Aedades.length + 30)
        .append("g")
        .attr("transform", "translate(00, 20)");
      var svg = d3
        .select("#barrasInter")
        .append("svg")
        .attr("width", 430)
        .attr("height", 335)
        .attr("class", "barr")
        .append("g");
      var indiceBarras = d3.range(0, 11);
      var x = d3.scale
        .linear()
        .domain([0, 11])
        .range([0, 430]);
      var y = d3.scale
        .linear()
        .domain([0, 35])
        .range([0, 275]);
      var yBarras = d3.scale
        .linear()
        .domain([0, 50])
        .range([220, 5]);
      var ejeXBarras = d3.svg.axis().scale(x);
      var ejeYBarras = d3.svg
        .axis()
        .orient("left")
        .scale(yBarras)
        .ticks(5);
      svg
        .selectAll(".xLabel")
        .data(x.ticks(10))
        .enter()
        .append("svg:text")
        .attr("class", "xLabel")
        .text(function(d, i) {
          return years[i];
        })
        .attr("x", function(d) {
          return x(d) + 5;
        })
        .attr("y", 245);
      var data = new Array();
      data.length = 0;
      var enterAntiClockwise = {
        startAngle: Math.PI * 2,
        endAngle: Math.PI * 2
      };
      var radius = 135;
      var radius2 = 130;
      var pie = d3.layout.pie().sort(null);
      var outArc = d3.svg
        .arc()
        .innerRadius(radius * 0.65)
        .outerRadius(radius * 1);
      var arc = d3.svg
        .arc()
        .outerRadius(radius * 0.8)
        .innerRadius(radius * 0.4);
      var vis = d3
        .select("#donut")
        .append("svg")
        .attr("width", 525)
        .attr("height", 260)
        .append("svg:g")
        .attr("transform", "translate(" + 265 + "," + 130 + ")");
      vis.append("g").attr("class", "labels");

      vis.append("g").attr("class", "slices");
      vis.append("g").attr("class", "lines");
      var c_group = vis.append("svg:g").attr("class", "c_group");
      var c_Circle = c_group
        .append("svg:circle")
        .attr("fill", "white")
        .attr("r", radius * 0.4);
      var totLabel = c_group
        .append("svg:text")
        .attr("class", "label")
        .attr("dy", -15)
        .attr("text-anchor", "middle")
        .text("TOTAL");
      var totValue = c_group
        .append("svg:text")
        .attr("class", "total")
        .attr("dy", 7)
        .attr("text-anchor", "middle")
        .text(function() {
          return addComas(fiebre[fiebre.length - 1].une) + "%";
        });
      var totalUnits = c_group
        .append("svg:text")
        .attr("class", "units")
        .attr("dy", 23)
        .attr("text-anchor", "middle") // text-align: right
        .text("Tasa paro");
      var slice = vis
        .select(".slices")
        .selectAll("path.slice")
        .data(pie(data))
        .enter()
        .append("path")
        .attr("id", function(d, i) {
          return "id_" + i;
        })
        .attr("fill", function(d, i) {
          return color(i);
        })
        .attr("d", arc)
        .attr("class", "slice")
        .each(function(d) {
          this._current = d.value;
        }); // store the initial values
      var polyline = vis
        .select(".lines")
        .selectAll("polyline")
        .data(pie(data));

      function arcTween(a) {
        var i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function(t) {
          return arc(i(t));
        };
      }

      function arcTweenOut(a) {
        var i = d3.interpolate(this._current, {
          startAngle: Math.PI * 2,
          endAngle: Math.PI * 2,
          value: 0
        });
        this._current = i(0);
        return function(t) {
          return arc(i(t));
        };
      }

      /* -----------------U--P--D--A--T--E----------------- */

      function update(d) {
        data.length = 0;
        var fecha =
          d.trim.substring(5) + " Trimestre " + d.trim.substring(0, 4);
        var total = d.une;
        var rand = Math.random().toFixed(5);
        for (i = 0; i < sectores.length - 1; i++) {
          if (sectores[i][d.trim] != null) {
            data.push(parseFloat(sectores[i][d.trim]));
          } else {
            data.push(1);
            break;
          }
        }
        slice = slice.data(pie(data));
        slice
          .enter()
          .append("path")
          .attr("fill", function(d, i) {
            return color(i);
          })
          .attr("id", function(d, i) {
            return "id_" + i;
          })
          .attr("class", "slice")
          .attr("d", arc(enterAntiClockwise))
          .each(function(d) {
            this._current = {
              data: d.data,
              value: d.value,
              startAngle: enterAntiClockwise.startAngle,
              endAngle: enterAntiClockwise.endAngle
            };
          });

        slice
          .exit()
          .transition()
          .duration(100)
          .attrTween("d", arcTweenOut)
          .remove();
        slice
          .transition()
          .duration(100)
          .attrTween("d", arcTween);
        slice
          .on(dispositivo, function() {
            d3.select(this).attr("opacity", 0.8);
            var z = this.getAttribute("id");
            var id = z.substring(z.length - 1, z.length);
            totValue.text(function() {
              if (data != 1) {
                totalUnits.text("Uds. en miles");
                return addComas(data[id]);
              } else {
                totalUnits.text("");
                return "Sin datos";
              }
            });
            totLabel.text(function() {
              if (data != 1) {
                return nombresSectores[id].toUpperCase();
              }
            });
          })
          .on("mouseout", function() {
            d3.select(this).attr("opacity", 1);
            var z = this.getAttribute("id");
            var id = z.substring(z.length - 1, z.length);
            totalUnits.text("Tasa de paro");
            totValue.text(function() {
              return addComas(total) + "%";
            });
            totLabel.text("TOTAL");
          });
        c_group.on(dispositivo, function() {
          vis
            .select(".slices")
            .selectAll("path.slice")
            .attr("opacity", 1);
          totLabel.text("TOTAL");
          totValue.text(function() {
            return addComas(total) + "%";
          });
        });
        var text = vis
          .select(".labels")
          .selectAll("text")
          .data(pie(data));
        text
          .enter()
          .append("text")
          .attr("fill", "#777")
          .attr("dy", ".35em")
          .attr("d", arc(enterAntiClockwise))
          .each(function(d, i) {
            this._current = {
              data: d.data,
              value: d.value,
              startAngle: enterAntiClockwise.startAngle,
              endAngle: enterAntiClockwise.endAngle
            };
          });
        text.text(function(d, i) {
          if (data != 1) {
            return nombresSectores[i] + " | " + addComas(data[i]);
          } else {
            return "Sin datos";
          }
        });
        text
          .transition()
          .duration(100)
          .attrTween("transform", function(d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
              var d2 = interpolate(t);
              var pos = outArc.centroid(d2);
              pos[0] = radius2 * (midAngle(d2) < Math.PI ? 1 : -1);
              return "translate(" + pos + ")";
            };
          })
          .styleTween("text-anchor", function(d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
              var d2 = interpolate(t);
              return midAngle(d2) < Math.PI ? "start" : "end";
            };
          });

        function midAngle(d) {
          return d.startAngle + (d.endAngle - d.startAngle) / 2;
        }
        text
          .transition()
          .duration(100)
          .attrTween("transform", function(d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
              var d2 = interpolate(t);
              var pos = outArc.centroid(d2);
              pos[0] = radius2 * (midAngle(d2) < Math.PI ? 1 : -1);
              return "translate(" + pos + ")";
            };
          })
          .styleTween("text-anchor", function(d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
              var d2 = interpolate(t);
              return midAngle(d2) < Math.PI ? "start" : "end";
            };
          });
        text.exit().remove();
        polyline = polyline.data(pie(data));
        polyline
          .enter()
          .append("polyline")
          .attr("class", "polyline")
          .attr("pointer-events", "none");
        polyline
          .transition()
          .duration(100)
          .attrTween("points", function(d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
              var d2 = interpolate(t);
              var pos = outArc.centroid(d2);
              pos[0] = radius2 * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
              return [arc.centroid(d2), outArc.centroid(d2), pos];
            };
          });
        polyline.exit().remove();
        var barrasH = [];
        var barrasM = [];
        var cont = 0;
        for (i = 0; i < edades.length; i++) {
          barrasH.push(edades[i][d.trim]);
          if (i > 10) break;
        }
        for (i = 12; i < edades.length; i++) {
          barrasM.push(edades[i][d.trim]);
          cont++;
        }
        barrasH.reverse();
        barrasM.reverse();
        indicesH = d3.range(0, barrasH.length);
        indicesM = d3.range(0, barrasM.length);
        yL = d3.scale
          .ordinal()
          .domain(indicesH)
          .rangeBands([0, (bar_height + 2 * gap) * Aedades.length]);
        edadesText
          .selectAll("text.name")
          .data(Aedades)
          .enter()
          .append("text")
          .attr("x", 30)
          .attr("y", function(d, i) {
            return i * yL.rangeBand() + 20;
          })
          .attr("dy", ".36em")
          .attr("text-anchor", "middle")
          .attr("class", "name")
          .text(String);
        chartH
          .selectAll("line")
          .data(xLeft.ticks(15))
          .enter()
          .append("line")
          .attr("x1", function(d) {
            return xLeft(d) + leftWidth;
          })
          .attr("x2", function(d) {
            return xLeft(d) + leftWidth;
          })
          .attr("y1", 0)
          .attr("y2", (bar_height + gap * 2) * Aedades.length);
        chartH
          .selectAll(".rule")
          .data(xLeft.ticks(15))
          .enter()
          .append("text")
          .attr("class", "rule")
          .attr("x", function(d) {
            return widthBar - xLeft(d) + 20;
          })
          .attr("y", (bar_height + gap * 2) * Aedades.length + 20)
          .attr("dy", -6)
          .attr("text-anchor", "middle")
          .text(String);
        var men = chartH.selectAll("rect").data(barrasH);
        men
          .enter()
          .append("rect")
          .attr("class", "left")
          .attr("width", "0")
          .attr("transform", "translate(60, 0)");
        men
          .exit()
          .transition()
          .duration(100)
          .attr("width", "0")
          .remove();
        men
          .transition()
          .duration(100)
          .attr("y", function(d, i) {
            return yL(i) + gap;
          })
          .attr("height", bar_height)
          .attr("x", function(d) {
            return widthBar - xLeft(d) + 20;
          })
          .attr("width", xLeft)
          .attr("transform", "translate(0, 0)");
        var textM = chartH.selectAll(".values").data(barrasH);
        textM
          .enter()
          .append("text")
          .attr("class", "right")
          .attr("opacity", 0);
        textM
          .exit()
          .transition()
          .duration(100)
          .attr("opacity", 0)
          .remove();
        textM
          .transition()
          .duration(100)
          .attr("x", function(d) {
            return widthBar - xLeft(d);
          })
          .attr("y", function(d, i) {
            return yL(i) + yL.rangeBand() / 2;
          })
          .attr("dx", -5)
          .attr("dy", ".36em")
          .attr("text-anchor", "middle")
          .attr("class", "values")
          .text(function(d, i) {
            return addComas(d) + "%";
          })
          .attr("opacity", 1);
        yR = d3.scale
          .ordinal()
          .domain(indicesM)
          .rangeBands([0, (bar_height + 2 * gap) * Aedades.length]);
        chartM
          .selectAll("line")
          .data(xRight.ticks(15))
          .enter()
          .append("line")
          .attr("x1", function(d) {
            return xRight(d);
          })
          .attr("x2", function(d) {
            return xRight(d);
          })
          .attr("y1", 0)
          .attr("y2", (bar_height + gap * 2) * Aedades.length);
        chartM
          .selectAll(".rule")
          .data(xRight.ticks(15))
          .enter()
          .append("text")
          .attr("class", "rule")
          .attr("x", function(d) {
            return xRight(d);
          })
          .attr("y", (bar_height + gap * 2) * Aedades.length + 20)
          .attr("dy", -6)
          .attr("text-anchor", "middle")
          .attr("font-size", 15)
          .text(String);
        var woman = chartM.selectAll("rect").data(barrasM);
        woman
          .enter()
          .append("rect")
          .attr("class", "right")
          .attr("width", "0");
        woman
          .exit()
          .transition()
          .duration(100)
          .attr("width", "0")
          .remove();
        woman
          .transition()
          .duration(100)
          .attr("y", function(d, i) {
            return yR(i) + gap;
          })
          .attr("height", bar_height)
          .attr("x", 0)
          .attr("width", xRight);
        var textW = chartM.selectAll("text.values").data(barrasM);
        textW
          .enter()
          .append("text")
          .attr("class", "right")
          .attr("opacity", 0);
        textW
          .exit()
          .transition()
          .duration(100)
          .attr("opacity", 0)
          .remove();
        textW
          .transition()
          .duration(100)
          .attr("x", xRight)
          .attr("y", function(d, i) {
            return yR(i) + yR.rangeBand() / 2;
          })
          .attr("dx", 24.5)
          .attr("dy", ".36em")
          .attr("text-anchor", "middle")
          .attr("class", "values")
          .text(function(d) {
            return addComas(d) + "%";
          })
          .attr("opacity", 1);
        var barras = [];
        for (i = 0; i < fiebre.length; i++) {
          if (fiebre[i].trim.substring(5) === d.trim.substring(5)) {
            barras.push({
              trim: fiebre[i].trim,
              Total: fiebre[i].une
            });
          }
        }
        var bars = svg.selectAll("rect").data(barras);
        bars
          .enter()
          .append("rect")
          .attr("transform", "translate(17,-20)")
          .attr("width", "0")
          .attr("fill", "#C46448");
        bars
          .exit()
          .transition()
          .duration(1)
          .attr("transform", "translate(30,-20)")
          .attr("width", 0)
          .remove();
        bars
          .transition()
          .duration(100)
          .attr("transform", "translate(3,-20)")
          .attr("x", function(d, i) {
            return x(i);
          })
          .attr("y", function(d) {
            return 250 - y(d.Total);
          })
          .attr("width", 35)
          .attr("height", function(d) {
            return y(d.Total);
          })
          .attr("value", function(d) {
            return d.Total;
          });
        bars
          .on(dispositivo, function(d) {
            d3.select(this).attr("fill", "#E28F77");
          })
          .on("mouseout", function() {
            d3.select(this).attr("fill", "#C46448");
          });
        var textBar = svg.selectAll(".textBar").data(barras);
        textBar
          .enter()
          .append("text")
          .attr("class", "textBar")
          .attr("transform", "translate(8,0)")
          .attr("opacity", 0)
          .attr("pointer-events", "none");
        textBar
          .exit()
          .transition()
          .duration(120)
          .remove();
        textBar
          .transition()
          .duration(100)
          .attr("opacity", 1)
          .text(function(d, i) {
            return addComas(d.Total) + "%";
          })
          .attr({
            x: function(d, i) {
              return x(i) + 13;
            },
            y: function(d) {
              return 250 - y(d.Total);
            }
          })
          .attr("font-size", "11px")
          .attr("dy", "-25")
          .attr("text-anchor", "middle");
        document.getElementById("trimestre").innerHTML =
          "TASA DE PARO INTERTRIMESTRAL<br>Trimestre " + d.trim.substring(5);
        document.getElementById("mes").innerHTML =
          "DATOS POR SECTORES<br>" +
          d.trim.substring(0, 4) +
          " Trimestre " +
          d.trim.substring(5);
        document.getElementById("sexos").innerHTML =
          "TASA DE PARO POR SEXOS Y FRANJAS DE EDAD<br>" +
          d.trim.substring(0, 4) +
          " Trimestre " +
          d.trim.substring(5);
      }

      update(fiebre[fiebre.length - 1]);
    });
  });
});
d3.select("#wrapper").on("touchstart", function() {
  div
    .transition()
    .duration(100)
    .style("opacity", 0);
});
