let filteredData = [];
let fetchImages = true; // Declared with let for proper scope handling

let nodesToDisplay;

// Fetch node positions and CSV data
Promise.all([
    fetch("data/node_positions.json").then(response => response.json()),
    d3.dsv(';', "family_tree_v2.csv")
]).then(([nodePositions, csvData]) => {
    nodesToDisplay = nodePositions;
    const { colorMap, grayHouses } = initializeColorMap(csvData);
    filteredData = filterAndPositionData(csvData, nodesToDisplay, colorMap);
    const links = defineLinks(filteredData);

    var svg = d3.select("#tree");

    const titleBorderColorMap = {
        "King of France": "#fcee21",
        "Holy Roman Emperor": "#fffffe",
    };

    drawLinks(svg, links);
    drawNodes(svg, filteredData, colorMap, titleBorderColorMap);
    addZoom(svg);
    setupEventListeners(svg);
    setupLegend(colorMap, grayHouses);
});

function initializeColorMap(data) {
    const colorMap = {};
    const houseCounts = {};
    const uniqueHouses = [...new Set(data.map(({ House }) => House))];
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    const grayHouses = new Set();

    data.forEach(d => {
        houseCounts[d.House] = (houseCounts[d.House] || 0) + 1;
    });

    uniqueHouses.forEach((house, index) => {
        colorMap[house] = colorScale(index);
    });

    const predefinedColors = {
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
        "Savoy": "#ef5caa",
        "Luxembourg": "#a7d4f8",
        "Trastámara": "#da7c80",
        "Medici": "#fb9738",
        "Sforza": "#38fbb7",
        "Orsini": "#e1ecad",
        "": "#838383"
    };

    Object.assign(colorMap, predefinedColors);

    uniqueHouses.forEach((house, index) => {
        if (!colorMap[house]) {
            colorMap[house] = colorScale(index);
        }

        if (houseCounts[house] === 1) {
            colorMap[house] = "#838383";
            grayHouses.add(house);
        }
    });

    return {colorMap, grayHouses};
}


function setDynamicFontSizes(selection, d) {
    const baseFontSize = 0; // Base font size in pixels
    const scaleFactor = 0.3; // Scale factor relative to node size

    // Calculate scaled font sizes
    const fontSize = Math.min(d.boxSize.width, d.boxSize.height) * scaleFactor;
    const nameFontSize = fontSize * 0.7; // 50% of the node font size
    const nicknameFontSize = fontSize * 0.65; // 40% of the node font size
    const titleFontSize = fontSize * 0.65; // 60% of the node font size

    selection
        .style("--node-name-font-size", `${nameFontSize}px`)
        .style("--node-nickname-font-size", `${nicknameFontSize}px`)
        .style("--node-title-font-size", `${titleFontSize}px`);
}

function filterAndPositionData(data, nodesToDisplay, colorMap) {
    const sizeByImportance = {
        1: { width: 80, height: 40 }, // Size for importance level 1
        2: { width: 100, height: 60 }, // Size for importance level 2
        3: { width: 160, height: 80 }  // Size for importance level 3
    };


    return data
        .filter(({ ID }) => nodesToDisplay.some(({ id }) => id == ID))
        .map(d => {
            const node = nodesToDisplay.find(({ id }) => id == d.ID);
            const { x, y } = node;
            const boxSize = sizeByImportance[d.importance] || sizeByImportance[2]; // Use size based on importance or default

            return {
                ...d,
                x,
                y,
                boxSize,
                color: colorMap[d.House] || d3.schemeCategory10[0]
            };
        });
}



function drawNodes(svg, filteredData, colorMap, titleBorderColorMap) {
    // Select the group element within the SVG for nodes
    var g = svg.select("g");

    // Append node groups
    var node = g.selectAll(".node")
        .data(filteredData)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.x},${d.y})`)
        .each(function(d) { setDynamicFontSizes(d3.select(this), d); }); // Apply dynamic font sizes

    // Append rectangles for nodes
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

    // Add text labels inside the nodes
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

    // Add birth and death years below the node box
    node.append("text")
        .attr("x", 0)
        .attr("y", d => d.boxSize.height / 2 + 12) // Adjust position as needed
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(d => `${d['Birth Year']} - ${d['Death Year']}`)
        .style("fill", d => d.color)

    // Add special images (e.g., crowns) for specific titles
    node.filter(d => d.Title === "Holy Roman Emperor")
        .append("image")
        .attr("xlink:href", "static/Heraldic_Imperial_Crown.svg")
        .attr("x", -15) // Center the image horizontally
        .attr("y", d => - 30 - d.boxSize.height/2) // Position it above the node box (adjust as needed)
        .attr("class", "node-crown");
}


function setupLegend(colorMap, grayHouses) {
    // Select the legend container or create it if it doesn't exist
    const legend = d3.select("#legend")
        .append("svg")
        .attr("width", 200)
        .attr("height", 550)
        .attr("class", "legend");

    // Filter out gray houses for the main legend
    const filteredHouses = Object.keys(colorMap).filter(house => !grayHouses.has(house));

    // Create legend items for each house
    const legendItems = legend.selectAll(".legend-item")
        .data(filteredHouses)
        .enter().append("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => `translate(10, ${i * 20 + 10})`);

    // Append color rectangles to the legend items
    legendItems.append("rect")
        .attr("x", 0)
        .attr("width", 12)
        .attr("height", 12)
        .style("fill", d => colorMap[d]);

    // Append house names to the legend items
    legendItems.append("text")
        .attr("x", 20)
        .attr("y", 6)
        .attr("dy", "0.35em")
        .text(d => d)
        .style("fill", "white"); // Set text color to black

    // Add a section for gray houses, if any
    if (grayHouses.size > 0) {
        const grayLegend = legend.append("g")
            .attr("class", "gray-legend")
            .attr("transform", `translate(10, ${filteredHouses.length * 20 + 30})`);

        grayLegend.append("rect")
            .attr("x", 0)
            .attr("width", 12)
            .attr("height", 12)
            .style("fill", "#838383");

        grayLegend.append("text")
            .attr("x", 20)
            .attr("y", 6)
            .attr("dy", "0.35em")
            .text("Single-entry houses")
            .style("fill", "white");
    }
}

function addZoom(svg) {
    const zoom = d3.zoom()
        .scaleExtent([0.2, 2])
        .on("zoom", event => svg.select("g").attr("transform", event.transform));

    svg.call(zoom);
    svg.call(zoom.transform, d3.zoomIdentity.translate(3500, 200).scale(0.8));
}

function setupEventListeners(svg) {
    // Handle node click event
    svg.selectAll(".node")
        .on("click", function (event, d) {
            showPersonInfo(d); // Show information about the clicked person
        });

    // Handle close button click
    document.querySelector(".close-btn").addEventListener("click", function () {
        document.querySelector(".side-panel").classList.remove("open");
    });

    // Handle toggle images button click
    var toggleButton = document.getElementById("toggle-images-btn");
    toggleButton.addEventListener("click", function () {
        fetchImages = !fetchImages; // Toggle image fetching
        toggleButton.textContent = fetchImages ? "Hide Images" : "Show Images";
        toggleButton.classList.toggle("active", fetchImages);
    });
}

async function showPersonInfo(person) {
    const { Name, nickname, Title, House, ['Birth Year']: birthYear, ['Death Year']: deathYear, ['Wikipedia Link']: wikipediaLink } = person;

    var sidePanel = document.querySelector(".side-panel");
    var personInfo = document.getElementById("person-info");

    const father = filteredData.find(({ ID }) => ID === person['father ID']);
    const mother = filteredData.find(({ ID }) => ID === person['mother ID']);
    const partner = filteredData.find(({ ID }) => ID == person['Partner ID']);

    // Populate the side panel with the person's info
    personInfo.innerHTML = `
            <h2>${person.Name}</h2>
            <p><em>${person.nickname}</em></p>
            <p><strong>Title:</strong> ${person.Title}</p>
            <p><strong>House:</strong> ${person.House}</p>
            <p><strong>Birth Date:</strong> ${person['Birth Year']}</p>
            <p><strong>Death Date:</strong> ${person['Death Year']}</p>
            <hr style="color: black">
            <p><strong>Father:</strong> ${father ? father.Name : 'Unknown'}</p>
            <p><strong>Mother:</strong> ${mother ? mother.Name : 'Unknown'}</p>
            <p><strong>Partner:</strong> ${partner ? partner.Name : 'Unknown'}</p>
            <p></p>
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


function generateLinkPath(d) {
    var startX = d.source.x;
    var startY = d.source.y;
    var endX = d.target.x;
    var endY = d.target.y;

    // Create a path string for the link
    var path = `M ${startX},${startY} `; // Move to starting point
    var VDistance = endY - startY;
    var midY = startY + VDistance / 5 * 3;

    path += `V ${midY} `;
    path += `H ${endX} `;
    path += `V ${endY} `;

    return path;
}

function drawLinks(svg, links) {
    var g = svg.select("g");

    // Draw links
    g.selectAll(".link")
        .data(links)
        .enter().append("path")
        .attr("class", "link")
        .attr("d", generateLinkPath) // Use the helper function to generate path
        .style("stroke", d => d.color)
        .style("fill", "none")
        .style("stroke-width", 2); // Adjust the stroke width as needed
}

function defineLinks(filteredData) {
    const links = [];

    filteredData.forEach(child => {
        const { ['father ID']: fatherId, ['mother ID']: motherId, ['Partner ID']: partnerId } = child;

        const father = filteredData.find(({ ID }) => ID == fatherId);
        const mother = filteredData.find(({ ID }) => ID == motherId);
        const partner = filteredData.find(({ ID }) => ID == partnerId);

            if (partner && child) {
            links.push({source: partner, target: child, color: partner.color});
        }

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

    return links;
}
