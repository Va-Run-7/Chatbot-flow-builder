import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import FlowBuilder from './components/FlowBuilder/FlowBuilder';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <FlowBuilder />
    </DndProvider>
  );
}

export default App;
