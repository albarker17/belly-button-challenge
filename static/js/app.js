//read in samples.json from url
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

let belly_button_data = {};

function buildBarChart(sample) {
    let sample_data = belly_button_data.samples.filter(obj => obj.id === sample)[0];

   
}

function init() {
    d3.json(url).then(function(data) {
        console.log(data);
        belly_button_data = data;

        let sample_names = belly_button_data.names;

        let dropdownMenu = d3.select("#selDataset");
        sample_names.forEach(name => {
            dropdownMenu.append("option").property("value", name).text(name);
        });

        let sample_one = sample_names[0];
        buildBarChart(sample_one);
        buildBubbleChart(sample_one);
        showMetadata(sample_one);
    })
    .catch(error => console.log("Error: " + error));
}

function buildBarChart (sample) {
    let sample_data = belly_button_data.samples.filter(obj => obj.id === sample)[0];

    //Values, Labels, and Hovertext for the chart

    let values = sample_data.sample_values.slice(0, 10).reverse();
    let labels = sample_data.otu_ids.slice(0, 10).reverse().map(id => `OTU ${id}`);
    let hoverText = sample_data.otu_labels.slice(0, 10).reverse();

    let trace = {
        x: values,
        y: labels,
        text: hoverText,
        type: "bar",
        orientation: "h",
        

    };

    let bar_chart_data = [trace];

    let bar_chart_layout= {
        title: "The Top 10 OTUs",

    };

    Plotly.newPlot("bar", bar_chart_data, bar_chart_layout);
}




//Build Bubble Chart

function buildBubbleChart(sample) {
    let sample_data = belly_button_data.samples.filter(obj => obj.id === sample)[0];

    let trace = {
        x: sample_data.otu_ids,
        y: sample_data.sample_values,
        text: sample_data.otu_labels,
        mode: "markers",
        marker: {
            size: sample_data.sample_values,
            color:sample_data.otu_ids,
            colorscale: "YlOrRd",
                },
        

    };

    let bubble_data = [trace];

    let bubble_layout = {
        title: "The OTU Sample Values",
        xaxis: {title : "OTU ID"},
        yaxis: {title: "Sample Value"},



    };

    Plotly.newPlot("bubble", bubble_data, bubble_layout);
}

//display data

function showMetadata (sample) {
    let metadata= belly_button_data.metadata.filter(obj => obj.id === parseInt (sample))[0];

    let meta_panel = d3.select("#sample-metadata");

    meta_panel.html("");

    Object.entries(metadata).forEach(([key, value]) => {
        meta_panel.append("p").text(`${key}: ${value}`);

    });

}

//update charts

function optionChanged (new_sample) {
    buildBarChart(new_sample);
    buildBubbleChart(new_sample);
    showMetadata(new_sample);
}

init();