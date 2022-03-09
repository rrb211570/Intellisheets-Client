# Lifestyle-Trackers

The original purpose of this app was to store a couple edit-friendly tracking tables in one place, and learn about JS-related stuff (React, Node, MongoDB, etc) in the process.

As I found it difficult to make editing, and resize the tables the way I wanted to, I slowly ended up simulating a spreadsheet with `<table>`. I did not like the auto-resizing behavior of the `<table>` when it grew to the same dimension as the div that contained it, so I chose to recreate a spreadsheet out of straight `<div>`'s. Because flexbox also shared the same auto-resizing behavior, the table/entry dimensions are now completely managed by functions that manually adjust margins/dimensions. 

Since I saw how easy it was to do resizing, I was motivated to ugrade the project to be a full-lifecycle spreadsheet editor (user signup/login, sheet manager, MVP editor w/ persistent storage).

### TODO :
1. Make sure save/load works.

Should be enough; talk to recruiters.

2. Implement format bar and selected[]
3. Update sprites for format bar, and use onClick event to apply format change on selected[]
4. Trigger recordEntries() on format change
5. Format paint & copy/cut with clipboard[] - single cell
6. Format paint & copy/cut - CTRL/SHIFT selections, row/col selection
7. Right-click menu on axis, for new col/row, and delete row/col


### App entrypoint is 'functions/client/src/index.js'<br>
### The actual components/functionality are in 'functions/client/src/components'
