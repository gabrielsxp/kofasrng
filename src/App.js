import React from 'react';
import Routes from './components/Routes/index';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import TouchBackend from 'react-dnd-touch-backend';
import MultiBackend, { TouchTransition } from 'react-dnd-multi-backend';

const HTML5toTouch = {
  backends: [
    {
      backend: HTML5Backend
    },
    {
      backend: TouchBackend,
      options: { enableMouseEvents: true },
      preview: true,
      transition: TouchTransition
    }
  ]
};

function App() {
  return (
    <div className="App">
      <DndProvider backend={MultiBackend} options={HTML5toTouch}>
        <Routes />
      </DndProvider>
    </div>
  );
}

export default App;
