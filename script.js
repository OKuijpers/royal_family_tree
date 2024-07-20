// script.js

document.addEventListener("DOMContentLoaded", function () {
    // var dsv = d3.dsv(';')
    d3.dsv(';', "family_tree_v2.csv").then(function (data) {
        var svg = d3.select("#tree");
        var g = svg.select("g");


        // Color mapping based on house
        var colorMap = {};
        var houseCounts = {}; // New object to count the number of entries per house
        var uniqueHouses = [...new Set(data.map(d => d.House))];
        var colorScale = d3.scaleOrdinal(d3.schemeCategory10); // Example color scale

        data.forEach(d => {
            houseCounts[d.House] = (houseCounts[d.House] || 0) + 1;
        });

        uniqueHouses.forEach((house, index) => {
            colorMap[house] = colorScale(index);
        });

        uniqueHouses.sort((a, b) => a.localeCompare(b));



        const predefined_colors = {
            "Valois": "#1f78e2",
            "Bourbon": "#6c5098",
            "Valois-Angoulême": "#3ea2ea",
            "Valois-Orléans": "#3957ec",
            "Valois-Burgundy": "#6f4fff",
            "Valois-Anjou": "#20a898",
            "Aviz": "#20a85b",
            "Habsburg": "#ca2525",
            "Stuart": "#7c0411",
            "Wittelsbach": "#ffeeef",
            "Visconti": "#d6cb6f",
            "Savoy": "#da7c80",
            "Luxembourg": "#a7d4f8",
            "Trastámara": "#da7c80",
            "Medici": "#fb9738",
            "Orsini": "#e1ecad",
            "": "#838383"
        }

        colorMap = {...colorMap, ...predefined_colors}

        var grayHouses = new Set();

        uniqueHouses.forEach((house, index) => {
            if (houseCounts[house] === 1) {
                colorMap[house] = "#838383"; // Gray color for houses with only one entry
                grayHouses.add(house); // Track gray houses

            }
        });


        var titleBorderColorMap = {
            "King of France": "#fcee21",
            "Holy Roman Emperor": "#fffffe",
            // Add other titles and colors here
            // "Title": "Color"
        };


        var defaultBoxSize = {width: 100, height: 60};

        // Combined array for IDs, positions, and parent IDs
var nodesToDisplay = [
            {id: 0, x: 200 - 1500, y: 490}, // Eleonore of Portugal
            {id: 1, x: 400 - 1500, y: 490}, // Frederick III
            {id: 2, x: 300 - 1500, y: 620}, // Maximilian I
            {id: 3, x: 150 - 1500, y: 880}, // Charles V
            {id: 4, x: 300 - 1500, y: 750}, // Philip I of Castile

            {id: 5, x: 800, y: 100}, // John II of France
            {id: 6, x: 800, y: 230}, // Charles V of France
            {id: 7, x: 800, y: 360}, // Charles VI of France
            {id: 8, x: 875, y: 490}, // Charles VII of France
            {id: 9, x: 800, y: 620}, // Louis XI of France
            {id: 10, x: 875, y: 750}, // Charles VIII of France
            {id: 11, x: 1750-650, y: 490}, // John of Angoulême
            {id: 12, x: 1750-650, y: 880}, // Charles of Angoulême
            {id: 13, x: 1600-650, y: 1010}, // Francis I of France
            {id: 14, x: 1600-650, y: 1140}, // Henry II of France
            {id: 15, x: -300+100, y: 230}, // Philip the Bold
            {id: 16, x: -300+100, y: 360}, // John the Fearless
            {id: 17, x: -300+100, y: 490}, // Philip the Good
            {id: 18, x: -300+100, y: 620}, // Charles the Bold
            {id: 19, x: 1750-650, y: 360}, // Louis I of Orléans
            {id: 20, x: 1900-650, y: 490}, // Charles of Orléans
            {id: 21, x: 1900-650, y: 880}, // Louis XII of France
            {id: 24, x: -500+100, y: 230}, // Margaret III
            {id: 25, x: -500+100, y: 360}, // Margaret of Bavaria
            {id: 26, x: -500+100, y: 490}, // Isabella of Portugal
            {id: 27, x: -500+100, y: 620}, // Margaret of York
            {id: 29, x: 1450-650, y: 880}, // Louise of Savoy

            // New entries for wives of French kings
            {id: 30, x: 950, y: 230}, // Jeanne of Bourbon (wife of Charles V)
            {id: 31, x: 950, y: 360}, // Isabeau of Bavaria (wife of Charles VI)
            {id: 32, x: 725, y: 490}, // Marie of Anjou (wife of Charles VII)
            {id: 33, x: 950, y: 620}, // Margaret of Scotland (wife of Louis XI)
            {id: 34, x: 725, y: 750}, // Anne of Brittany (wife of Charles VIII)

            {id: 37, x: 600, y: 230}, // Louis I, Duke of Anjou
            {id: 38, x: 450, y: 230}, // Marie of Blois
            {id: 35, x: 525, y: 360}, // Louis II, Duke of Anjou
            {id: 36, x: 675, y: 360}, // Yolande of Aragon
            {id: 40, x: 600, y: 100}, // Bonne of Bohemia

            {id: 41, x: 350, y: 490}, // Louis III, Duke of Anjou
            {id: 42, x: 225, y: 490}, // Margaret of Savoy
            {id: 43, x: 600, y: 490}, // René of Anjou
            {id: 44, x: 475, y: 490}, // Isabella, Duchess of Lorraine
            {id: 45, x: 100, y: 490}, // Charles of Maine
            {id: 46, x: -25, y: 490},  // Cobella Ruffo


            {id: 47, x: 1900-650, y: 360}, // Valentina Visconti
            {id: 48, x: -125, y: 750}, // Mary of Burgundy
            {id: 49, x: -50, y: 620},  // Isabella of Bourbon







    {id: 50, x: 0-1800, y: 0 + 230},                  //  John I of Castile
    {id: 52, x: -200 - 1800, y: 130 + 230},           // Ferdinand I of Aragon
    {id: 57, x: 200 - 1800, y: 130 + 230},            // Henry III of Castile
    {id: 53, x: 200 - 1800, y: 260 + 230},            // John II of Castile
    {id: 54, x: 300 - 1800, y: 390 + 230},            // Henry IV of Castile
    {id: 55, x: 100 - 1800, y: 390 + 230},            // Isabella I of Castile
    {id: 58, x: -100 - 1800, y: 260 + 230},           // John II of Aragon
    {id: 59, x: -300 - 1800, y: 260 + 230},           // Alfonso V of Aragon
    {id: 56, x: -100 - 1800, y: 390 + 230},           // Ferdinand II of Aragon

    {id: 62, x: 0 - 300 - 1800, y: 520 + 230},            // Isabella of Aragon, Queen of Portugal
    {id: 63, x: 150 - 300 - 1800, y: 520 + 230},            // John, Prince of Asturias
    {id: 64, x: 600 - 300 - 1800, y: 520 + 230},            // Joanna of Castile
    {id: 65, x: 450 - 300 - 1800, y: 520 + 230},            // Maria of Aragon, Queen of Portugal
    {id: 66, x: 300 - 300 - 1800, y: 520 + 230},            // Catherine of Aragon, Queen of England


        // Habsburgers
    {id: 67, x:300 - 1500, y: 360},
    {id: 68, x:500 - 1500, y: 360},
    {id: 69, x:400 - 1500, y: 230},
    {id: 70, x:200 - 1500, y: 230},
    {id: 71, x:300 - 1500, y: 100},
    {id: 72, x:500 - 1500, y: 100},


    // Medici
    {id: 75, x:350 - 3500, y: 360},
    {id: 76, x:500 - 3500, y: 360},
    {id: 74, x:425 - 3500, y: 230},
    {id: 84, x:275 - 3500, y: 230},
    {id: 83, x:350 - 3500, y: 100},
    {id: 73, x:500 - 3500, y: 100},

    {id: 86, x:225 - 3500, y: 490},
    {id: 89, x:50 - 3500, y: 490},
    {id: 85, x:350 - 3500, y: 490},
    {id: 88, x:475 - 3500, y: 490},
    {id: 91, x:625 - 3500, y: 490},
    {id: 87, x:750 - 3500, y: 490},
    {id: 90, x:900 - 3500, y: 490},


    {id: 92, x:825 - 3500, y: 620},
    {id: 93, x:975 - 3500, y: 620},
    {id: 94, x:550 - 3500, y: 620},

    {id: 97, x:600 - 3500, y: -30},
    {id: 98, x:400 - 3500, y: -30},

    {id: 99, x:650 - 3500, y: 100},
    {id: 100, x:800 - 3500, y: 100},

    {id: 101, x:650 + 75 - 3500, y: 230},

    {id: 103, x:650 - 3500, y: 360},
    {id: 102, x:650 + 150 - 3500 + 100, y: 360},
    {id: 108, x:650 + 300 - 3500 + 100, y: 360},

    {id: 109, x:650 + 300 - 75 - 3500 + 100, y: 100},
    {id: 110, x:650 + 300 + 75 - 3500 + 100, y: 100},

    {id: 112, x:650 + 150 - 3500 + 100, y: 750}



        ];


        // Filter data based on the combined array
        var filteredData = data.filter(d => nodesToDisplay.some(n => n.id == d.ID));

        // Map positions to filtered data
        filteredData.forEach(d => {
            var node = nodesToDisplay.find(n => n.id == d.ID);
            d.x = node.x;
            d.y = node.y;
            d.boxSize = node.boxSize || defaultBoxSize; // Use custom size if specified, otherwise use default
            d.color = colorMap[d.House] || colorScale(uniqueHouses.indexOf(d.House)); // Assign color based on house or fallback to colorScale
        });

        // Define links with hierarchical layout
        var links = [];
        filteredData.forEach(child => {
            var father = filteredData.find(d => d.ID == child['father ID']);
            var mother = filteredData.find(d => d.ID == child['mother ID']);
            var partner = filteredData.find(d => d.ID == child['Partner ID']);

            if (father && mother && child) {
                const midpointnode = {x: (mother.x - father.x) / 2 + father.x, y: father.y};
                links.push({source: father, target: mother, color: father.color});
                links.push({source: midpointnode, target: child, color: father.color});
                return;
            }

            if (father && child) {
                links.push({source: father, target: child, color: father.color});
            }

            if (partner && child) {
                links.push({source: partner, target: child, color: partner.color});
            }


        });

        // Draw links
        g.selectAll(".link")
            .data(links)
            .enter().append("path")
            .attr("class", "link")
            .attr("d", function (d) {
                var startX = d.source.x;
                var startY = d.source.y;
                var endX = d.target.x;
                var endY = d.target.y;

                // Calculate dynamic path based on node positions
                var path = `M ${startX},${startY} `; // Move to starting point
                var VDistance = endY - startY;
                var midY = startY + VDistance / 5 * 3;

                path += `V ${midY} `;
                path += `H ${endX} `;
                path += `V ${endY} `;

                return path;
            })
            .style("stroke", d => d.color);


        // Draw nodes
        var node = g.selectAll(".node")
            .data(filteredData)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", d => `translate(${d.x},${d.y})`)
            .on("click", function (event, d) {
                window.location.href = d.Name.toLowerCase().replace(/\s+/g, '_') + ".html"; // Redirect to the person's page
            });

        node.append("rect")
            .attr("x", d => -d.boxSize.width / 2)
            .attr("y", d => -d.boxSize.height / 2)
            .attr("width", d => d.boxSize.width)
            .attr("height", d => d.boxSize.height)
            .attr("rx", 15) // Rounded corners
            .attr("ry", 15)
            .style("fill", d => d.color)
            .style("stroke", d => titleBorderColorMap[d.Title] || "none")
            .style("stroke-width", d => titleBorderColorMap[d.Title] ? 4 : 0);

        // Add foreignObject for text wrapping
        node.append("foreignObject")
            .attr("width", d => d.boxSize.width)
            .attr("height", d => d.boxSize.height)
            .attr("x", d => -d.boxSize.width / 2)
            .attr("y", d => -d.boxSize.height / 2)
            .append("xhtml:div")
            .attr("class", "node-label") // Apply a class for styling
            .html(d => `
                <div class="node-name">${d.Name}</div>
                <div class="node-nickname">${d.nickname}</div>
                <div class="node-title">${d.Title}</div>
`);

        node.append("text")
            .attr("x", 0)
            .attr("y", d => d.boxSize.height / 2 + 12) // Adjust position as needed
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .text(d => `${d['Birth Year']} - ${d['Death Year']}`)
            .style("fill", d => d.color)
            .style("font-size", "12px");

        node.filter(d => d.Title === "Holy Roman Emperor")
            .append("image")
            .attr("xlink:href", "static/Heraldic_Imperial_Crown.svg")
            .attr("width", 30) // Adjust the size as needed
            .attr("height", 30) // Adjust the size as needed
            .attr("x", -15) // Center the image horizontally
            .attr("y", -62) // Position it above the node box (adjust as needed)
            .attr("class", "node-crown");


        var zoom = d3.zoom()
            .scaleExtent([0.2, 2]) // Limit zoom scale
            .on("zoom", function (event) {
                g.attr("transform", event.transform);
            });

        // Apply the zoom behavior to the SVG element



        svg.call(zoom);

                // Center the initial view
        svg.call(zoom.transform, d3.zoomIdentity.translate(3000, 200).scale(0.8));


        node.on("click", function (event, d) {
            showPersonInfo(d);
        });



        var legend = d3.select("#legend")
            .append("svg")
            .attr("width", 200)
            .attr("height", 550)
            .attr("class", "legend");

        var filteredHouses = uniqueHouses.filter(house => !grayHouses.has(house));


        var legendItems = legend.selectAll(".legend-item")
            .data(filteredHouses)
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
            .text(d => d)
            .style("fill", "white"); // Set text color to white

        var fetchImages = true;


        async function fetchWikipediaImageURL(wikipediaLink) {
            try {
                const pageTitle = wikipediaLink.split('/').pop();
                const apiURL = `https://en.wikipedia.org/w/api.php?action=query&titles=${pageTitle}&prop=pageimages&format=json&pithumbsize=200&origin=*`;

                const response = await fetch(apiURL);
                const data = await response.json();
                const pages = data.query.pages;
                const page = Object.values(pages)[0];

                if (page.thumbnail && page.thumbnail.source) {
                    return page.thumbnail.source;
                } else {
                    return null;
                }
            } catch (error) {
                console.error('Error fetching Wikipedia API:', error);
                return null;
            }
        }

        // Updated showPersonInfo function to include image fetching
        async function showPersonInfo(person) {
            var sidePanel = document.querySelector(".side-panel");
            var personInfo = document.getElementById("person-info");

            // Populate the side panel with the person's info
            personInfo.innerHTML = `
            <h2>${person.Name}</h2>
            <p><em>${person.nickname}</em></p>
            <p><strong>Title:</strong> ${person.Title}</p>
            <p><strong>House:</strong> ${person.House}</p>
            <p><strong>Birth Date:</strong> ${person['Birth Year']}</p>
            <p><strong>Death Date:</strong> ${person['Death Year']}</p>
            <a href="${person['Wikipedia Link']}" style="color: black">Wikipedia</a>
        `;

            // Fetch and display the image
            if (fetchImages) {
                console.log('loading')
                const imageURL = await fetchWikipediaImageURL(person['Wikipedia Link']);
                if (imageURL) {
                    personInfo.innerHTML += `<img src="${imageURL}" alt="${person.Name}">`;
                }
            }

            // Show the side panel
            d3.select(".side-panel").style("background-color", person.color);

            sidePanel.classList.add("open");
        }

        document.querySelector(".close-btn").addEventListener("click", function () {
            document.querySelector(".side-panel").classList.remove("open");
        });

        var toggleButton = document.getElementById("toggle-images-btn");
        toggleButton.addEventListener("click", function () {
            fetchImages = !fetchImages;
            toggleButton.textContent = fetchImages ? "Hide Images" : "Show Images";
            toggleButton.classList.toggle("active", fetchImages);
        });


    });
});
