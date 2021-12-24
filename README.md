# Lifestyle-Trackers

The original purpose of this app was to store a couple edit-friendly tracking tables in one place, and learn about JS-related stuff (React, Node, MongoDB, etc) in the process.

As I found it difficult to make editing, and resize the tables the way I wanted to, I slowly ended up simulating a spreadsheet with `<table>`. I did not like the auto-resizing behavior of the `<table>` when it grew to the same dimension as the div that contained it, so I chose to recreate a spreadsheet out of straight `<div>`'s. Because flexbox also shared the same auto-resizing behavior, the table/entry dimensions are now completely managed by functions that manually adjust margins/dimensions.

Undo/redo now works for row/col resizing events.
  
### TODO :
1. Implement applyTextChangeHandler() and applySelectedHandler()
2. Update sprites for format bar, and use onClick event to apply format change on selected[]
3. Trigger recordEntries() on format change and text input change
4. Implement autoSave(): maybe create a separate changeTracker[] that records a list of [#row, #col] cells that were changed; this can be used in autoSave() to update server db. Or changeHistory[] can be used? Will figure it out when I get here..
5. Format paint & copy/cut with clipboard[] - single cell
6. Format paint & copy/cut - CTRL/SHIFT selections, row/col selection
7. Contain spreadsheet inside scrollable div
8. Right-click menu on axis, for new col/row, and delete row/col


### App entrypoint is 'my-app/src/index.js'<br>
### The actual components/functionality are in 'my-app/src/components'
