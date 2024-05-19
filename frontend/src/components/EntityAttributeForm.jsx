import React, { useState } from "react";
import SectionButton from "./SectionButton";
import axios from "axios";

export default function EntityAttributeForm() {
  const addButton = "Add Attribute";
  const createButton = "Create Entity";
  const [formData, setFormData] = useState({
    entityName: "",
    attributes: [{ attributeName: "", attributeType: "" }],
  });

  const handleChange = (event, index) => {
    const { id, value } = event.target;
    const updatedAttributes = formData.attributes.map((attribute, i) =>
      i === index ? { ...attribute, [id]: value } : attribute
    );
    setFormData({
      ...formData,
      attributes: updatedAttributes,
    });
  };

  const handleAddAttribute = () => {
    setFormData({
      ...formData,
      attributes: [...formData.attributes, { attributeName: "", attributeType: "" }],
    });
  };

  const handleDeleteAttribute = (index) => {
    const updatedAttributes = formData.attributes.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      attributes: updatedAttributes,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const { entityName, attributes } = formData;
    if (!entityName || attributes.some(attr => !attr.attributeName || !attr.attributeType)) {
      alert("Please fill in all required fields.");
      return;
    }

    const payload = {
      tableName: entityName,
      attributes: attributes.reduce((acc, attr) => {
        acc[attr.attributeName] = attr.attributeType;
        return acc;
      }, {}),
    };

    axios.post("http://localhost:8800/createTable", payload)
      .then((response) => {
        alert(response.data);
      })
      .catch((error) => {
        const errorMessage = error.response && error.response.data && error.response.data.details
          ? error.response.data.details.sqlMessage
          : error.message;
        alert(`Failed to create table: ${errorMessage}`);
        console.error(error);
      });
  };

  return (
    <>
      <div>
        <div>
          <input
            type="text"
            id="entityName"
            className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:border-blue-600 border-2"
            placeholder="Entity Name"
            required
            value={formData.entityName}
            onChange={(e) => setFormData({ ...formData, entityName: e.target.value })}
          />
        </div>

        <br />

        {formData.attributes.map((attribute, index) => (
          <div key={index} className="mb-4">
            <div className="flex flex-row gap-2">
              <input
                type="text"
                id="attributeName"
                className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:border-blue-600 border-2"
                placeholder="Attribute Name"
                required
                value={attribute.attributeName}
                onChange={(e) => handleChange(e, index)}
              />
              <input
                type="text"
                id="attributeType"
                className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:border-blue-600 border-2"
                placeholder="Attribute Type"
                required
                value={attribute.attributeType}
                onChange={(e) => handleChange(e, index)}
              />
              <svg
                className="cursor-pointer"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                width="50"
                height="50"
                onClick={() => handleDeleteAttribute(index)}
              >
                <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
              </svg>
            </div>
          </div>
        ))}

        <br />
      </div>

      <div className="flex flex-col mx-auto gap-5 w-1/2">
        <SectionButton name={addButton} onClick={handleAddAttribute} />
        <SectionButton name={createButton} onClick={handleSubmit} />
      </div>
    </>
  );
}
