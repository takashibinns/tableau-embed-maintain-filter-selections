//  Define the settings for this example web page
const settings = {
    'containerId': 'vizContainer',
    'navContainerId': 'navigation',
    'tableauServer': 'https://public.tableau.com',
    'localVariablePrefix': 'tf-',
    'dashboards': [
        { 'id':'cases',         'url': '/views/MeningitisandNeonatalSepsisTracker_15543731247200/CasesandDeaths'        },
        { 'id':'prevention',    'url': '/views/MeningitisandNeonatalSepsisTracker_15543731247200/Prevention'            },
        { 'id':'surveillance',  'url': '/views/MeningitisandNeonatalSepsisTracker_15543731247200/Surveillance'          },
        { 'id':'diagnosis',     'url': '/views/MeningitisandNeonatalSepsisTracker_15543731247200/DiagnosisandTreatment' }
    ]
}

//  Placeholder variable for the currently embedded Tableau viz
let viz;

//  Helper Function - Convert the query string into a JSON object
//  https://www.developerdrive.com/turning-the-querystring-into-a-json-object-using-javascript/
const QueryStringToJSON = () => {            
    var pairs = location.search.slice(1).split('&');
    
    var result = {};
    pairs.forEach(function(pair) {
        pair = pair.split('=');
        result[pair[0]] = decodeURIComponent(pair[1] || '');
    });

    return JSON.parse(JSON.stringify(result));
}

//  Helper Function - Create the nav buttons
const initNavigation = (dashboards, currentId) => {

    //  Get a reference to the navigation bar container
    let nav = $('#' + settings.navContainerId);

    //  Loop through each dashboard
    dashboards.forEach((dashboard)=>{

        //  Get the current url
        const newUrl = window.location.href.split('?')[0] + '?dashboard=' + dashboard.id;

        //  Build the new button's html
        let dashboardButton;
        if (dashboard.id===currentId){
            //  This dashboard is currently being displayed
            dashboardButton = `<a href="${newUrl}" class="active">${dashboard.id}</a>`;
        } else {
            //  This dashboard is not being displayed
            dashboardButton = `<a href="${newUrl}">${dashboard.id}</a>`;
        }

        //  Add the html to the dom
        nav.append(dashboardButton);
    })
}

//  Helper Function - Look for any saved session variables
const loadSessionFilters = (options) => {

    const prefix = settings.localVariablePrefix;
    const pLength = prefix.length;

    //  Get a reference to all saved selections
    const allItems = { ...localStorage };
    for (const item in allItems) {
        //  Only look for items that are labeled as saved filters
        if (item.substring(0, pLength)===prefix){
            //  The label matches, strip off the prefix and save it to the options object
            const field = item.substring(pLength);
            if (!options[field]) {
                options[field] = allItems[item];
            }
        }
    }
    return options;
}

//  Event Handler - Triggered when a user makes a filter selection
const saveFilterSelection = (event) => {
    event.getFilterAsync().then( (filter) => {
        //  Get the field name
        const field = filter.getFieldName();
        //  Get the selected values
        let values = [];
        filter.getAppliedValues().forEach( (v) => {
            values.push(encodeURIComponent(v.value));
        })
        //  Save the selection to the user's local storage
        window.localStorage.setItem(settings.localVariablePrefix + field, values.join(','))
    })
}

//  Main Function - Load the tableau dashboard
const initViz = () => {

    //  Figure out the div container we want to embed into
    const containerDiv = document.getElementById(settings.containerId);

    //  parse the query string of the current url
    const qs = QueryStringToJSON();

    //  Figure out which dashboard to display (just use the first one if none are selected)
    const selectedDashboard = settings.dashboards.filter((d)=>{return d.id===qs.dashboard});
    const dashboard = selectedDashboard.length>0 ? selectedDashboard[0] : settings.dashboards[0];

    //  Build out this page's dashboard navigation buttons
    initNavigation(settings.dashboards, dashboard.id);
    
    //  Define the dashboard's URL
    const url = settings.tableauServer + dashboard.url;

    //  Initialize the embed options
    let initialOptions = {
        hideTabs: true,
        onFirstInteractive: () => {
            //  Add event handler for when a filter selection changes
            viz.addEventListener(tableau.TableauEventName.FILTER_CHANGE, saveFilterSelection)
        }
    };

    //  Add in any saved filter selections
    const finalOptions = loadSessionFilters(initialOptions)
    
    //  Create the viz
    viz = new tableau.Viz(containerDiv, url, finalOptions);
}

/*
function yearFilter(year) {
    var sheet = viz.getWorkbook().getActiveSheet();
    if (year === "") {
        sheet.clearFilterAsync("Academic Year");
    } else {
        sheet.applyFilterAsync("Academic Year", year, tableau.FilterUpdateType.REPLACE);
    }
}
*/