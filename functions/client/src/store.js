import { combineReducers, createStore } from 'redux';
import Data from './components/SpreadSheetPanel/core/history/data.js'
const NEWSTATE = 'NEWSTATE';
const UNDO = 'UNDO';
const REDO = 'REDO';
const CLEARHISTORYSTATE = 'CLEARHISTORYSTATE';
const UPDATESELECTED = 'UPDATESELECTED';
const UPDATESHEETDIMENSIONS = 'UPDATESHEETDIMENSIONS';
const SAVE = 'SAVE';
const ROLLBACKANDMERGE = 'ROLLBACKANDMERGE';

const historyReducer = (state = {
    changeHistory: [new Data()],
    changeHistoryIndex: 0,
    collectedData: new Data(),
    sentData: new Data()
}, action) => {
    switch (action.type) {
        case NEWSTATE: return {
            changeHistory: [...state.changeHistory.slice(0, state.changeHistoryIndex), action.prevRecordedData, action.dataAfterChange],
            changeHistoryIndex: state.changeHistoryIndex + 1,
            collectedData: action.collectedData,
            sentData: state.sentData
        };
        case UNDO: return {
            changeHistory: state.changeHistory,
            changeHistoryIndex: state.changeHistoryIndex - 1,
            collectedData: action.collectedData,
            sentData: state.sentData
        }
        case REDO: return {
            changeHistory: state.changeHistory,
            changeHistoryIndex: state.changeHistoryIndex + 1,
            collectedData: action.collectedData,
            sentData: state.sentData
        }
        case CLEARHISTORYSTATE: return {
            changeHistory: [new Data()],
            changeHistoryIndex: 0,
            collectedData: new Data(),
            sentData: new Data()
        }
        case SAVE: return {
            changeHistory: state.changeHistory,
            changeHistoryIndex: state.changeHistoryIndex,
            collectedData: new Data(),
            sentData: state.collectedData
        }
        case ROLLBACKANDMERGE: return {
            changeHistory: state.changeHistory,
            changeHistoryIndex: state.changeHistoryIndex,
            collectedData: rollBackAndMerge(state.collectedData, state.sentData),
            sentData: new Data()
        }
        default: return state;
    }
}
function rollBackAndMerge(collectedData, savedData) {

}

const formatReducer = (state = { selectedEntries: [] }, action) => {
    switch (action.type) {
        case UPDATESELECTED: return {
            selectedEntries: action.selectedEntries
        }
        default: return state;
    }
}

const resizerDimensionsReducer = (state = {}, action) => {
    switch (action.type) {
        case UPDATESHEETDIMENSIONS: return {
            tableHeight: action.tableHeight != null ? action.tableHeight : state.tableHeight,
            tableWidth: action.tableWidth != null ? action.tableWidth : state.tableWidth
        }
        default: return state;
    }
}

const rootReducer = combineReducers({
    history: historyReducer,
    formatSelect: formatReducer,
    resizerDimensions: resizerDimensionsReducer,
});

const mapStateToProps = (state) => {
    return {
        changeHistory: state.history.changeHistory,
        changeHistoryIndex: state.history.changeHistoryIndex,
        collectedData: state.history.collectedData,
        sentData: state.history.sentData,
        selectedEntries: [],// todo
        tableHeight: state.resizerDimensions.tableHeight,
        tableWidth: state.resizerDimensions.tableWidth,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        newHistoryState: (prevRecordedData, dataAfterChange, collectedData) => {
            dispatch(newHistoryState(prevRecordedData, dataAfterChange, collectedData));
        },
        undo: (collectedData) => {
            dispatch(undo(collectedData));
        },
        redo: (collectedData) => {
            dispatch(redo(collectedData));
        },
        clearHistoryState: () => {
            dispatch(clearHistoryState());
        },
        updateSelected: (entries) => {
            dispatch(updateSelectedEntries(entries));
        },
        updateSheetDimensions: (height, width) => {
            dispatch(updateSheetDimensions(height, width));
        },
        save: () => {
            dispatch(saveSheet());
        },
    }
};

const newHistoryState = (prevRecordedData, dataAfterChange, collectedData) => {
    return {
        type: NEWSTATE,
        prevRecordedData: prevRecordedData,
        dataAfterChange: dataAfterChange,
        collectedData: collectedData,
        sentData: null
    }
}

const undo = (collectedData) => {
    return {
        type: UNDO,
        collectedData: collectedData
    }
}

const redo = (collectedData) => {
    return {
        type: REDO,
        collectedData: collectedData
    }
}

const clearHistoryState = () => {
    return {
        type: CLEARHISTORYSTATE
    }
}

const updateSelectedEntries = (entries) => {
    return {
        type: UPDATESELECTED,
        selectedEntries: entries
    }
}

const updateSheetDimensions = (height, width) => {
    return {
        type: UPDATESHEETDIMENSIONS,
        tableHeight: height,
        tableWidth: width
    }
};

const saveSheet = () => {
    return {
        type: SAVE
    }
}

const store = createStore(rootReducer);

export { store, mapStateToProps, mapDispatchToProps, updateSheetDimensions, clearHistoryState};