// script.js

document.addEventListener("DOMContentLoaded", function() {
        d3.csv("family_tree_v2.csv").then(function(data) {
            var svg = d3.select("svg");


            // Color mapping based on house
            var colorMap = {};

            // Extract unique houses and assign colors
            var uniqueHouses = [...new Set(data.map(d => d.House))];
            var colorScale = d3.scaleOrdinal(d3.schemeCategory10); // Example color scale

            uniqueHouses.forEach((house, index) => {
                colorMap[house] = colorScale(index);
            });

            var defaultBoxSize = { width: 100, height: 50 };

            // Combined array for IDs, positions, and parent IDs
            var nodesToDisplay = [
{ id: 0, x: 200, y: 400},  // Eleonore of Portugal
{ id: 1, x: 400, y: 400},  // Frederick III
{ id: 2, x: 300, y: 500},  // Maximilian I
{ id: 3, x: 300, y: 700},  // Charles V
{ id: 4, x: 300, y: 600},  // Philip I of Castile
{ id: 5, x: 800, y: 100},  // John II of France
{ id: 6, x: 800, y: 200},  // Charles V of France
{ id: 7, x: 800, y: 300},  // Charles VI of France
{ id: 8, x: 800, y: 400},  // Charles VII of France
{ id: 9, x: 800, y: 500},  // Louis XI of France
{ id: 10, x: 800, y: 600},  // Charles VIII of France
{ id: 11, x: 950, y: 400},  // John of Angoulême
{ id: 12, x: 950, y: 700},  // Charles of Angoulême
{ id: 13, x: 800, y: 800},  // Francis I of France
{ id: 15, x: 600, y: 200},  // Philip the Bold
{ id: 16, x: 600, y: 300},  // John the Fearless
{ id: 17, x: 600, y: 400},  // Philip the Good
{ id: 18, x: 600, y: 500},  // Charles the Bold
{ id: 19, x: 1000, y: 300},  // Louis I of Orléans
{ id: 20, x: 1100, y: 400},  // Charles of Orléans
{ id: 21, x: 1100, y: 700},  // Louis XII of France

            ];

            // Filter data based on the combined array

            var filteredData = data.filter(d => nodesToDisplay.some(n => n.id == d.ID));
            // Map positions to filtered data

            filteredData.forEach(d => {
                var node = nodesToDisplay.find(n => n.id == d.ID);

                d.x = node.x;
                d.y = node.y;
                d.boxSize = node.boxSize || defaultBoxSize; // Use custom size if specified, otherwise use default
                d.color = colorMap[d.House]; // Assign color based on house

            });

            // Define links with hierarchical layout
            var links = [];
            filteredData.forEach(child => {
                var father = filteredData.find(d => d.ID == child['father ID']);
                var mother = filteredData.find(d => d.ID == child['mother ID']);
                var partner = filteredData.find(d => d.ID == child['Partner ID']);

                if (father && mother && child) {

                    const midpointnode = {x: (mother.x - father.x) / 2 + father.x, y: father.y}

                    links.push({ source: father, target: mother });
                    links.push({ source: midpointnode, target: child });
                    return
                }


                if (father && child) {
                    links.push({ source: father, target: child });
                }

                if (partner && child) {
                    links.push({ source: partner, target: child });
                }

                if (father && partner) {
                    links.push({ source: father, target: partner });
                }


            });


            // Draw links
            svg.selectAll(".link")
                .data(links)
                .enter().append("path")
                .attr("class", "link")
                .attr("d", function(d) {
                    var startX = d.source.x;
                    var startY = d.source.y;
                    var endX = d.target.x;
                    var endY = d.target.y;

                    // Calculate dynamic path based on node positions
                    var path = `M ${startX},${startY} `; // Move to starting point


                    var VDistance = endY - startY

                    var midY = startY + VDistance / 2

                    // Draw vertical line down from parent
                    path += `V ${midY} `;

                    // Draw horizontal line to midpoint for child
                    path += `H ${endX} `;

                    // Draw vertical line down from midpoint for child
                    path += `V ${endY} `;


                    return path;
                });


            // Draw nodes
            var node = svg.selectAll(".node")
                .data(filteredData)
                .enter().append("g")
                .attr("class", "node")
                .attr("transform", d => `translate(${d.x},${d.y})`)
                .on("click", function(event, d) {
                    window.location.href = d.Name.toLowerCase().replace(/\s+/g, '_') + ".html";  // Redirect to the person's page
                });

            node.append("rect")
                .attr("x", d => -d.boxSize.width / 2)
                .attr("y", d => -d.boxSize.height / 2)
                .attr("width", d => d.boxSize.width)
                .attr("height", d => d.boxSize.height)
                .attr("rx", 10) // Rounded corners
                .attr("ry", 10)
                .style("fill", d => d.color);


            // Add foreignObject for text wrapping
            node.append("foreignObject")
                .attr("width", d => d.boxSize.width)
                .attr("height", d => d.boxSize.height)
                .attr("x", d => -d.boxSize.width / 2)
                .attr("y", d => -d.boxSize.height / 2)
                .append("xhtml:div")
                .attr("class", "node-label") // Apply a class for styling
                .html(d => d.Name); // Insert the node's name into the di


           var legend = d3.select("#legend")
                .append("svg")
                .attr("width", 200)
                .attr("height", 150)
                .attr("class", "legend");

            var legendItems = legend.selectAll(".legend-item")
                .data(uniqueHouses)
                .enter().append("g")
                .attr("class", "legend-item")
                .attr("transform", (d, i) => `translate(10, ${i * 20 + 10})`);

            legendItems.append("rect")
                .attr("x", 0)
                .attr("width", 12)
                .attr("height", 12)
                .style("fill", d => colorMap[d]);

            legendItems.append("text")
                .attr("x", 20)
                .attr("y", 6)
                .attr("dy", "0.35em")
                .text(d => d);

            // Add zoom and pan functionality
            var zoom = d3.zoom()
                .scaleExtent([0.5, 5])
                .on("zoom", function(event) {
                    svg.attr("transform", event.transform);
                });

            svg.call(zoom);
        });
});
