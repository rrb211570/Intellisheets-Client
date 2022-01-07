import React from 'react';
export default MenuPanel;

function MenuPanel() {
    return (
        <div id="menuID" className="menu" style={{ height: window.innerHeight*.95 }}>
            <button className="menu-button" id="bt1">Reward Palette</button>
            <button className="menu-button" id="bt2">Schedule Planner</button>
            <button className="menu-button" id="bt3">Lofi + Pom</button>
            <button className="menu-button" id="bt4">Groceries</button>
            <button className="menu-button" id="bt5">Food Log</button>
        </div>
    );
}