import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UpdateForm from './UpdateForm';

const ShowTableData = () => {
  const [tableNames, setTableNames] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [tableState, setTableState] = useState([]);
  const [editRow, setEditRow] = useState(null);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const res = await axios.get('http://localhost:8800/tables');
        setTableNames(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTables();
  }, []);

  useEffect(() => {
    if (selectedTable) {
      const fetchTableData = async () => {
        try {
          const res = await axios.get(`http://localhost:8800/tableData/${selectedTable}`);
          if (Array.isArray(res.data)) {
            const formattedData = res.data.map(row => {
              const formattedRow = { ...row };
              Object.keys(formattedRow).forEach(key => {
                if (isValidDate(formattedRow[key])) {
                  formattedRow[key] = formatDate(formattedRow[key]);
                }
              });
              return formattedRow;
            });
            setTableState(formattedData);
          } else {
            setTableState([]);
          }
        } catch (error) {
          console.log(error);
          setTableState([]);
        }
      };
      fetchTableData();
    }
  }, [selectedTable]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8800/deleteRow/${selectedTable}/${id}`);
      setTableState((prevState) => prevState.filter((row) => row.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = (row) => {
    const formattedRow = { ...row };
    Object.keys(formattedRow).forEach(key => {
      if (isValidDate(formattedRow[key])) {
        formattedRow[key] = formatDate(formattedRow[key]);
      }
    });
    setEditRow(formattedRow);
  };

  const handleUpdateSuccess = (updatedRow) => {
    const formattedRow = { ...updatedRow };
    Object.keys(formattedRow).forEach(key => {
      if (isValidDate(formattedRow[key])) {
        formattedRow[key] = formatDate(formattedRow[key]);
      }
    });
    setTableState((prevState) => prevState.map(row => (row.id === formattedRow.id ? formattedRow : row)));
    setEditRow(null);
  };

  const handleCancelUpdate = () => {
    setEditRow(null);
  };

  const isValidDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
    return regex.test(dateString) || isoRegex.test(dateString);
  };

  const formatDate = (dateString) => {
    if (dateString.includes('T')) {
      const [datePart] = dateString.split('T');
      const [year, month, day] = datePart.split('-');
      return `${day}/${month}/${year}`;
    }
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="text-center">
      <select
        value={selectedTable}
        onChange={(e) => setSelectedTable(e.target.value)}
        className="border rounded py-1 px-2 mb-4"
      >
        <option value="">Select a table</option>
        {tableNames.map((table, index) => (
          <option key={index} value={table}>{table}</option>
        ))}
      </select>

      {editRow ? (
        <div className="mt-4">
          <h3 className='mb-2'>Update Row:</h3>
          <UpdateForm
            tableName={selectedTable}
            row={editRow}
            onUpdateSuccess={handleUpdateSuccess}
            onCancel={handleCancelUpdate}
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                {tableState.length > 0 && Object.keys(tableState[0]).map((key) => (
                  <th key={key} className="py-2 px-4 border-b border-gray-300">{key}</th>
                ))}
                <th className="py-2 px-4 border-b border-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tableState.map((row, index) => (
                <tr key={index} className="text-center">
                  {Object.values(row).map((value, idx) => (
                    <td key={idx} className="py-2 px-4 border-b border-gray-300">{value}</td>
                  ))}
                  <td className="py-2 px-4 border-b border-gray-300">
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded mr-2"
                      onClick={() => handleDelete(row.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                      onClick={() => handleUpdate(row)}
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ShowTableData;
