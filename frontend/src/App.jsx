import { useState } from 'react';
import './App.css';
import EntityAttributeForm from './components/EntityAttributeForm';
import EntityValueForm from './components/EntityValueForm';
import SectionButton from './components/SectionButton';
import Title from './components/Title';
import ShowTableData from './components/ShowTableData'

function App() {
  const mainHeading = "Rudimentary Headless CMS";
  const attributeButton = "Insert Entity"; 
  const valueButton = "Insert Value";
  const newButton = "Show Table"; 

  const [showAttributeForm, setShowAttributeForm] = useState(false);
  const [showValueForm, setShowValueForm] = useState(false);
  const [showNewComponent, setShowNewComponent] = useState(false); 
  const [containerWidth, setContainerWidth] = useState('max-w-lg');

  const handleAttributeButtonClick = () => {
    setShowAttributeForm(true);
    setShowValueForm(false);
    setShowNewComponent(false);
    setContainerWidth('max-w-lg');
    console.log("Done");
  };

  const handleValueButtonClick = () => {
    setShowAttributeForm(false);
    setShowValueForm(true);
    setShowNewComponent(false);
    setContainerWidth('max-w-lg');
    console.log("Done");
  };

  const handleNewButtonClick = () => {
    setShowAttributeForm(false);
    setShowValueForm(false);
    setShowNewComponent(true);
    setContainerWidth('w-full');
    console.log("New component shown");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F6F4F1] py-8">
      <div className={`inline-block bg-white p-10 rounded-lg shadow-lg shadow-slate-300 w-full h-full mx-auto ${containerWidth}`}>
        <Title title={mainHeading} />
        <br /><br />
        <div className='flex flex-row gap-4 justify-center items-center'>
          <SectionButton name={attributeButton} onClick={handleAttributeButtonClick} />
          <SectionButton name={valueButton} onClick={handleValueButtonClick} />
          <SectionButton name={newButton} onClick={handleNewButtonClick} /> 
        </div>
        <br /><br />
        {showAttributeForm && <EntityAttributeForm />}
        {showValueForm && <EntityValueForm />}
        {showNewComponent && (
          <div className="w-full">
            <ShowTableData />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
