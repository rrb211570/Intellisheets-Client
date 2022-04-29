# Lifestyle-Trackers

The original purpose of this app was to store a couple edit-friendly tracking tables in one place, and learn about JS-related stuff (React, Node, MongoDB, etc) in the process.

As I found it difficult to make editing, and resize the tables the way I wanted to, I slowly ended up simulating a spreadsheet with `<table>`. I did not like the auto-resizing behavior of the `<table>` when it grew to the same dimension as the div that contained it, so I chose to recreate a spreadsheet out of straight `<div>`'s. Because flexbox also shared the same auto-resizing behavior, the table/entry dimensions are now completely managed by functions that manually adjust margins/dimensions. 

Since I saw how easy it was to do resizing, I was motivated to ugrade the project to be a full-lifecycle spreadsheet editor (user signup/login, sheet manager, MVP editor w/ persistent storage).

See demo on my [portfolio](https://portfolio-6cfe3.firebaseapp.com).

### POSSIBLE FUTURE UPDATES :
1. Open-source SpreadsheetPanel
2. Format bar, selection properties (ctrl, shift, row, col, table)

### App entrypoint is 'functions/client/src/index.js'<br>
### The actual components/functionality are in 'functions/client/src/components'
