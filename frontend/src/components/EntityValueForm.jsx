import React, { useState, useEffect } from 'react';
import SectionButton from './SectionButton';
import axios from 'axios';

export default function EntityValueForm() {
  const addButton = "Add Entry";
  const [tableNames, setTableNames] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [attributes, setAttributes] = useState([]);
  const [attributeState, setAttributeState] = useState({});

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const res = await axios.get('http://localhost:8800/tables');
        setTableNames(res.data);
      } catch (error) {
        console.log('Error fetching table names:', error);
      }
    };
    fetchTables();
  }, []);

  const handleTableChange = async (e) => {
    const tableName = e.target.value;
    setSelectedTable(tableName);
    
    if (tableName) {
      try {
        const res = await axios.get(`http://localhost:8800/tableAttributes/${tableName}`);
        const attributeNames = res.data.map(attribute => attribute.Field);
        setAttributes(attributeNames);
      } catch (error) {
        console.log('Error fetching attributes:', error);
      }
    } else {
      setAttributes([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAttributeState((prev) => ({ ...prev, [name]: value }));
  };

  const convertDateFormat = (date) => {
    if (!date.includes('/')) {
      return date;
    }
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
  };

  const handleAddEntry = async () => {
    if (!selectedTable) {
      alert("Please select a table");
      return;
    }

    if (Object.keys(attributeState).length === 0) {
      alert("Please fill in the attributes");
      return;
    }

    const convertedAttributes = {};
    for (const [key, value] of Object.entries(attributeState)) {
      if (key.toLowerCase().includes('date of birth') || key.toLowerCase().includes('dob') || key.toLowerCase().includes('date')) {
        convertedAttributes[key] = convertDateFormat(value);
      } else if (key.toLowerCase().includes('createdat') || key.toLowerCase().includes('updatedat')) {
        convertedAttributes[key] = value.split('T')[0]; 
      } else {
        convertedAttributes[key] = value;
      }
    }

    try {
      const res = await axios.post('http://localhost:8800/tableDatas', {
        tableName: selectedTable,
        attributes: convertedAttributes,
      });
      alert(res.data);
    } catch (error) {
      const errorMessage = error.response && error.response.data && error.response.data.details
        ? error.response.data.details.sqlMessage
        : error.message;
      alert(`Failed to add entry: ${errorMessage}`);
      console.log('Error adding entry:', error);
    }
  };

  return (
    <>
      <div>
        <div>
          <select
            id="entity_name"
            value={selectedTable}
            onChange={handleTableChange}
            className="bg-gray-50 border-gray-300 text-gray-400 text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:border-blue-600 border-2"
            required
          >
            <option value="">Select Entity Name</option>
            {tableNames.map((table, index) => (
              <option key={index} value={table}>{table}</option>
            ))}
          </select>
        </div>
        <br />
        {selectedTable && attributes.length > 0 && attributes.map((attribute, index) => (
          attribute.toLowerCase() !== 'id' && (
            <div key={index} className="flex flex-row gap-2 mb-4">
              <div className='w-full'>
                <label htmlFor={attribute} className="block mb-2 text-sm font-medium text-gray-900">{attribute}</label>
                <input
                  type="text"
                  id={attribute}
                  name={attribute}
                  value={attributeState[attribute] || ''} 
                  onChange={handleChange}
                  className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:border-blue-600 border-2"
                  placeholder={attribute.toLowerCase().includes('date of birth') || attribute.toLowerCase().includes('dob') || attribute.toLowerCase().includes('date') ? 'DD/MM/YYYY' : (attribute.toLowerCase().includes('createdat') || attribute.toLowerCase().includes('updatedat') ? 'YYYY-MM-DD' : attribute)}
                />
              </div>
            </div>
          )
        ))}
        <br />
      </div>
      <div className="flex justify-center">
        <SectionButton name={addButton} onClick={handleAddEntry} />
      </div>
    </>
  );
}
