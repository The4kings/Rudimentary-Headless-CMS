import React, { useState } from 'react';
import axios from 'axios';

const UpdateForm = ({ tableName, row, onUpdateSuccess, onCancel }) => {
  const [formData, setFormData] = useState(row);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const convertDateFormat = (dateString) => {
    const dateParts = dateString.split('/');
    if (dateParts.length === 3) {
      const [day, month, year] = dateParts;
      return `${year}-${month}-${day}`;
    }
    return dateString;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { id, ...updateData } = formData;

      Object.keys(updateData).forEach(key => {
        if (key.toLowerCase().includes('date') || key.toLowerCase().includes('dob') || key.toLowerCase().includes('createdat') || key.toLowerCase().includes('updatedat')) {
          updateData[key] = convertDateFormat(updateData[key]);
        }
      });

      await axios.put(`http://localhost:8800/updateRow/${tableName}/${id}`, updateData);
      onUpdateSuccess({ ...updateData, id });
    } catch (error) {
      alert(`Failed to update entry: ${error.response?.data?.details?.sqlMessage || error.message}`);
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center">
      {Object.keys(row).map((key) => (
        key !== 'id' && (
          <div key={key} className="mb-2">
            <label className='mr-2'>{key}</label>
            <input
              name={key}
              value={formData[key]}
              onChange={handleChange}
              className="border rounded py-1 px-2"
              placeholder={key.toLowerCase().includes('date') || key.toLowerCase().includes('dob') || key.toLowerCase().includes('createdat') || key.toLowerCase().includes('updatedat') ? 'DD/MM/YYYY' : ''}
            />
          </div>
        )
      ))}
      <div className="flex">
        <button type="submit" className="bg-green-500 text-white px-2 py-1 rounded mr-2">Save</button>
        <button type="button" className="bg-gray-500 text-white px-2 py-1 rounded" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};

export default UpdateForm;
