# Lifestyle-Trackers

The original purpose of this app was to store a couple edit-friendly tracking tables in one place, and learn about JS-related stuff (React, Node, MongoDB, etc) in the process.

As I found it difficult to make editing, and resize the tables the way I wanted to, I slowly ended up simulating a spreadsheet with `<table>`. I did not like the auto-resizing behavior of the `<table>` when it grew to the same dimension as the div that contained it, so I chose to recreate a spreadsheet out of straight `<div>`'s. Because flexbox also shared the same auto-resizing behavior, the table/entry dimensions are now completely managed by functions that manually adjust margins/dimensions. 

Since I saw how easy it was to do resizing, I was motivated to ugrade the project to recreate Google Sheets. Maybe I am suffering from sunk cost fallacy, but hopefully it should be ready for showcasing (Step 4 complete) in another week or two (~40 days total)

### TODO :
1. Automated test to ensure resize & textChange events are captured in recordChange + changeHistory[]/collectedData[]
2. Automated test for Undo/Redo
3. Handlers submit Data to recordChange instead of entries[]
4. Implement server for user auth, sheet creation/organization, load/store sheets, autoSave()

Should be enough; talk to recruiters.

6. Update sprites for format bar, and use onClick event to apply format change on selected[]
7. Trigger recordEntries() on format change and text input change
9. Format paint & copy/cut with clipboard[] - single cell
10. Format paint & copy/cut - CTRL/SHIFT selections, row/col selection
11. Contain spreadsheet inside scrollable div
12. Right-click menu on axis, for new col/row, and delete row/col


### App entrypoint is 'my-app/src/index.js'<br>
### The actual components/functionality are in 'my-app/src/components'
