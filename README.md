# Tableau Embed Example: Maintain Filter Selections across embedded workbooks
This embed example shows how a user's filter selections can be saved from a workbook session, and then applied automatically to a different embedded workbook.  When the dashboard is loaded, an event handler is created to watch for dashboard selection changes.  If a user changes the selection(s) of a filter in the embedded view, that change propegates up to the web app.  The web app saves the filter's field name and selection values as a variable within the browser's local storage.  Later when the web page gets reloaded, it checks the local storage for any filters and if it finds any they are applied to the workbook before it loads.  The end result is that if an end user selects [Country]="USA" from dashboard A and then reload the page, the dashboard will still be filtered for [Country]="USA".  Even better, if they navigate to another dashboard, the filter [Country]="USA" will be automatically applied.  

![Image of LocalStorage variables being saved](/screenshots/example.png)

## Notes
In a production environment, you may want to put some additional boundaries on this code.  Perhaps one example would be hard-coding a list of possible fields that get saved (instead of *every* filter selection).
