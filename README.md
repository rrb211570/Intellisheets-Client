# Lifestyle-Trackers

The original purpose of this app was to store a couple edit-friendly tracking tables in one place, and learn about JS-based frameworks/libraries (React, Node.js, MongoDB, etc).

As I found it difficult to make editing, and resize the tables the way I wanted to, I ended up slowly simulating a spreadsheet with <table>. Because I had trouble disabling the auto-resizing behavior of the <table> entries when the table grew to the same dimension as the div that contained it, I chose to recreate a spreadsheet out of straight <div>'s. Because flexbox also shared the same auto-resizing behavior, the table/entry dimensions are now completely managed by functions that manually adjust margins/dimensions.
  
###TODO (in vague order of priority):
  - Change history table for undo/redo, and to communicate changes to pending server db through pending autosave() function.
  - Transparent divs on top of each entry, which can be double-clicked to enable text input; Clicking away, re-enables the div, preventing single-click input
  - Create format bar, which can be used to format table entries
  - Contain spreadsheet inside scrollable div
  

App entrypoint is 'my-app/src/index.js'<br>
The actual components/functionality are in 'my-app/src/components'
