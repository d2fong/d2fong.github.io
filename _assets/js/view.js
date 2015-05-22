'use strict';

// Put your view code here (e.g., the graph renderering code)

///////////////////////////////////////////////
/**
*   Graph View
*/

// Graph view needs to have the activity points model and the graph model

// Create nice resolution canvas from :http://stackoverflow.com/questions/15661339/how-do-i-fix-blurry-text-in-my-html5-canvas

var PIXEL_RATIO = (function () {
    var ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
              ctx.mozBackingStorePixelRatio ||
              ctx.msBackingStorePixelRatio ||
              ctx.oBackingStorePixelRatio ||
              ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
})();


var createHiDPICanvas = function(w, h, ratio) {
    if (!ratio) { ratio = PIXEL_RATIO; }
    var can = document.createElement("canvas");
    can.width = w * ratio;
    can.height = h * ratio;
    can.style.width = w + "px";
    can.style.height = h + "px";
    can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
    return can;
}

var createLine = function(src, x0, y0, x1, y1) {
    src.beginPath();
    src.moveTo(x0, y0);
    src.lineTo(x1, y1);
    src.closePath();
    src.stroke();
}



var drawGraph = function(graphType, src, data) {
    if (graphType == 'bar' ) {
        if (src) {
            var canvas = createHiDPICanvas(800, 800);
            src.innerHTML = '';
            src.appendChild(canvas);
            var src_c = canvas.getContext('2d');


            src_c.lineWidth = "1.0";
            
            createLine(src_c, 35, 0, 35, 500);
            createLine(src_c, 0, 480, 1000, 480);
            src_c.font = "12px Arial";
            src_c.fillText("Time",0,30);
            src_c.fillText("Spent",0,50);
            src_c.fillText("(min)", 0, 70);
            src_c.fillText("0", 25, 490);
            src_c.fillText("250--", 10, 260);            
            src_c.fillText("--", 10, 5);
            src_c.fillText("500", 10, 15);
            src_c.fillText("Activity",760, 490);

            var num_minutes_writing_code = 0;
            var num_minutes_exercising = 0;
            var num_minutes_school = 0;
            var num_minutes_slacking = 0;
            var num_minutes_sleeping = 0;
            //process data
            _.each(data, function(item) {
                switch(item['activityType']) {
                    case 'writing_code':
                        num_minutes_writing_code += parseInt(item['activityDurationInMinutes']);
                        break;
                    case 'exercising':
                        num_minutes_exercising += parseInt(item['activityDurationInMinutes']);
                        break;
                    case 'school':
                        num_minutes_school += parseInt(item['activityDurationInMinutes']);
                        break;
                    case 'slacking':
                        num_minutes_slacking += parseInt(item['activityDurationInMinutes']);
                        break;
                    case 'sleeping':
                        num_minutes_sleeping += parseInt(item['activityDurationInMinutes']);
                        break;
                }
            });

            var max_activity_text_length = 139;
            var acc = 35;
            console.log(num_minutes_writing_code);
            src_c.beginPath();
            src_c.fillStyle = 'yellow';
            src_c.fillRect(acc, (479 - (num_minutes_writing_code)), max_activity_text_length - 50, num_minutes_writing_code) ;
            src_c.stroke();
            src_c.fillText("writing_code", acc + 20, 510);


            acc += max_activity_text_length - 1;

            src_c.beginPath();
            src_c.fillStyle = 'red';
            src_c.fillRect(acc, (479 - (num_minutes_exercising)), max_activity_text_length - 50,  num_minutes_exercising);    
            src_c.stroke();
            src_c.fillText("Exercising", acc + 20, 510); 

            acc += max_activity_text_length - 1;

            src_c.beginPath();
            src_c.fillStyle = 'blue';
            src_c.fillRect(acc, (479 - (num_minutes_school)), max_activity_text_length - 50, num_minutes_school);    
            src_c.stroke();
            src_c.fillText("School", acc + 20, 510);

            acc += max_activity_text_length - 1;

            src_c.beginPath();
            src_c.fillStyle = 'green';
            src_c.fillRect(acc, (479 - (num_minutes_slacking)), max_activity_text_length - 50, num_minutes_slacking);    
            src_c.stroke();
            src_c.fillText("Slacking", acc + 20, 510);

            acc += max_activity_text_length - 1;

            src_c.beginPath();
            src_c.fillStyle = 'orange';
            src_c.fillRect(acc, (479 - (num_minutes_sleeping)), max_activity_text_length - 50, num_minutes_sleeping);    
            src_c.stroke();
            src_c.fillText("Sleeping", acc + 20, 510);
        }
    
    }
}


 var GraphView = function(graphModel, activityModel) {
    var self = this;
    this.graph_model = graphModel;
    this.activity_model = activityModel;

    this.collection_view_btn = document.getElementById('data-point-view');
    this.statistics_view_btn = document.getElementById('statistics-view');
    this.graph_title = document.getElementById('graph-title');

    this.collection_table = document.getElementById('table-wrapper');
    this.statistics_graph = document.getElementById('graph-wrapper');

    this.collection_view_btn.addEventListener('click', function() {
        var graph_name = self.collection_view_btn.value;
        self.graph_model.selectGraph(graph_name);
    });

    this.statistics_view_btn.addEventListener('click', function() {
        var graph_name = self.statistics_view_btn.value;
        self.graph_model.selectGraph(graph_name);
    });

    this.graph_model.addListener(function(eventType, eventTime, eventData) {
        if (eventType == GRAPH_SELECTED_EVENT && self.graph_model.getAvailableGraphNames().indexOf(eventData) > -1) {
            if (eventData != self.graph_model.getNameOfCurrentlySelectedGraph()) {
                self.graph_title.innerHTML = eventData;
                switch (eventData) {
                    case 'ListOfDataPoints':
                        self.collection_table.className = "active";
                        self.statistics_graph.className = "hidden";
                        break;
                    case 'TimeSpentGraph':
                        self.statistics_graph.className = "active";
                        self.collection_table.className = "hidden";
                        break;
                }
            }
        } 
    });

    this.activity_model.addListener(function(eventType, eventTime, eventData) {
        if (eventType == ACTIVITY_DATA_ADDED_EVENT) {
            // Update the data points table
            var g = document.getElementById('ListOfDataPoints').getElementsByTagName('tbody')[0];
            var new_row = g.insertRow();

            var new_cell1 = new_row.insertCell(0);
            var cell1_val = document.createTextNode(eventData['activityDurationInMinutes']);
            new_cell1.appendChild(cell1_val);

            var new_cell0 = new_row.insertCell(0);
            var cell0_val = document.createTextNode(eventData['activityType']);
            new_cell0.appendChild(cell0_val);

            // Update the graph

            drawGraph('bar', self.statistics_graph, self.activity_model.getActivityDataPoints());

        } else if (eventType == ACTIVIYT_DATA_REMOVED_EVENT) {
            // delete it from the points table

            // delete it from the graph


        }
    });

 }

///////////////////////////////////////////////
/**
*   Activity Collection View
*/
var isValidNum = function(n) {
    return !(isNaN(parseFloat(n))) && isFinite(n);
}

var isValidHealthInput = function(n) {
    return isValidNum(n) && (n <= 5) && (n >= 1);
}

var isValidMinuteInput = function(n) {
    return isValidNum(n) && (n <= 60) && (n >= 1);
}

var validateActivityType = function(activity) {
    var valid_list_of_activities = [
        'writing_code',
        'exercising',
        'school',
        'sleeping',
        'slacking'
    ];

    if (valid_list_of_activities.indexOf(activity) <= -1) {
        alert("Please choose from the predefined list of activites");
        return 1;
    }

    return 0;
}


var validateHealth = function(healthDict) {

    var acc = 0;

    _.each(healthDict, function(v, k) {
        if (!isValidHealthInput(v)) { 
            alert(k + " must be a value between 1 and 5");
            acc++;
        }
    });

    return acc;
}

var validateMinutes = function(n) {
    return !(isValidNum(n) && (n <= 60) && (n >= 1));

}
var ActivityCollectionView = function(model) {
    var self = this;
    this.model = model;

    // Input form submit button
    this.form_input_submit = document.getElementById('input-form-submit');
    
    // Last submitted data point
    this.last_submitted = document.getElementById('last-submitted');

    // Bind Activity view with model
    this.form_input_submit.addEventListener('click', function() {

        var activity_type = document.getElementById('activity').value;

        var health_metrics_dict = {};
        health_metrics_dict.energy = document.getElementById('energy').value;
        health_metrics_dict.stress = document.getElementById('stress').value;
        health_metrics_dict.hapiness = document.getElementById('hapiness').value;

        var minute_duration = document.getElementById('time').value;

        var result = 0;
        result = validateActivityType(activity_type) 
        + validateMinutes(minute_duration) 
        + validateHealth(health_metrics_dict);

        if (result == 0) {
            var data_point = new ActivityData(activity_type, health_metrics_dict, minute_duration);
            self.model.addActivityDataPoint(data_point);
        }
    });

    // Bind model change to view
    this.model.addListener(function(eventType, eventTime, eventData) {
        if (eventType == ACTIVITY_DATA_ADDED_EVENT) {
            self.last_submitted.innerHTML = eventTime.toString();
        }
    });


}

///////////////////////////////////////
/**
 *  TabView  
 */

var TabView = function(model) {
    // Obtains itself   
    var self = this;

    // Stores the model
    this.model = model;

    // Available tabs and divs
    this.nav_input_tab = document.getElementById('nav-input-tab');
    this.input_div = document.getElementById('input-div');

    this.nav_analysis_tab = document.getElementById('nav-analysis-tab');
    this.analysis_div = document.getElementById('analysis-div');

    // Binds tab view with model  
    this.nav_input_tab.addEventListener('click', function() {
        model.selectTab('InputTab');
    });

    this.nav_analysis_tab.addEventListener('click', function() {
        model.selectTab('AnalysisTab');
    });

    // Binds model change with view
    this.model.addListener(function(eventType, eventTime, eventData) {
        if (eventType === TAB_SELECTED_EVENT)   {
            switch (eventData) {
                case 'InputTab':
                    self.nav_input_tab.className = "active";
                    self.nav_analysis_tab.className = "";
                    self.input_div.className = '';
                    self.analysis_div.className = 'hidden';
                    break;
                case 'AnalysisTab':
                    self.nav_analysis_tab.className = "active";
                    self.nav_input_tab.className = "";
                    self.input_div.className = 'hidden';
                    self.analysis_div.className = '';
                    break;
            }
        }
    });
}