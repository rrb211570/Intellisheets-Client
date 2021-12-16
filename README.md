# Lifestyle-Trackers

The original purpose of this app was to store a couple edit-friendly tracking tables in one place, and learn about JS-related stuff (React, Node, MongoDB, etc) in the process.

As I found it difficult to make editing, and resize the tables the way I wanted to, I slowly ended up simulating a spreadsheet with `<table>`. I did not like the auto-resizing behavior of the `<table>` when it grew to the same dimension as the div that contained it, so I chose to recreate a spreadsheet out of straight `<div>`'s. Because flexbox also shared the same auto-resizing behavior, the table/entry dimensions are now completely managed by functions that manually adjust margins/dimensions.
  
### TODO (in vague order of priority):
  - changeHistory[] for undo/redo, and to communicate changes to pending server db through pending autosave().
  - Transparent divs on top of each entry, which can be double-clicked to enable text input; Clicking away, re-enables the div; This prevents single-click input
  - Create format bar, which can be used to format table entries: I'm thinking font style/height/color, bg color, alignment, border, bold/italic/underline, transform entry to checkbox, and single-row merge-and-center (multi-row is more complicated, I might not want to do it)
  - Contain spreadsheet inside scrollable div
  - selected[] to copy/paste/format multiple entries at once; Requires capture of (ctrl/shift + click) events
  - Paint format
  

### App entrypoint is 'my-app/src/index.js'<br>
### The actual components/functionality are in 'my-app/src/components'
