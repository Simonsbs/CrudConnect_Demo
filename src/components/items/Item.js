import React, { useState, useEffect } from "react";
import axios from "axios";

function Item({ deleteItem }) {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    Data: {},
    Scope: "Public",
  });
  const [dataString, setDataString] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [bearerToken, setBearerToken] = useState("");
  const [projectID, setProjectID] = useState("");
  const [category, setCategory] = useState("");

  const fetchItems = async () => {
    const config = bearerToken
      ? { headers: { Authorization: `Bearer ${bearerToken}` } }
      : {};
    try {
      const response = await axios.get(
        `https://gnte7mjwg9.execute-api.us-east-1.amazonaws.com/newdev/item/${projectID}_${category}`,
        config
      );
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDataChange = (e) => {
    const { value } = e.target;
    setDataString(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = bearerToken
      ? { headers: { Authorization: `Bearer ${bearerToken}` } }
      : {};

    // Parse dataString to object before sending to API
    const parsedData = dataString ? JSON.parse(dataString) : {};
    const postData = {
      Data: parsedData,
      Scope: formData.Scope,
    };

    if (editMode) {
      try {
        await axios.put(
          `https://gnte7mjwg9.execute-api.us-east-1.amazonaws.com/newdev/item/${projectID}_${category}/${formData.ItemID}`,
          formData, // For editing, we send the entire formData
          config
        );
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.ItemID === formData.ItemID ? formData : item
          )
        );
        setEditMode(false);
        setFormData({
          Data: {},
          Scope: "Public",
        });
        setDataString("");
      } catch (error) {
        console.error("Error updating item:", error);
      }
    } else {
      try {
        await axios.post(
          `https://gnte7mjwg9.execute-api.us-east-1.amazonaws.com/newdev/item/${projectID}_${category}`,
          postData, // For adding, we send only Data and Scope
          config
        );
        setItems((prevItems) => [...prevItems, formData]);
        setFormData({
          Data: {},
          Scope: "Public",
        });
        setDataString("");
      } catch (error) {
        console.error("Error adding item:", error);
      }
    }
  };

  const handleEdit = (item) => {
    setFormData(item);
    setDataString(JSON.stringify(item.Data));
    setEditMode(true);
  };

  const handleDelete = async (id) => {
    const config = bearerToken
      ? { headers: { Authorization: `Bearer ${bearerToken}` } }
      : {};
    try {
      await axios.delete(
        `https://gnte7mjwg9.execute-api.us-east-1.amazonaws.com/newdev/item/${projectID}_${category}/${id}`,
        config
      );
      setItems((prevItems) => prevItems.filter((item) => item.ItemID !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div>
      <h1>Items</h1>
      <div>
        <label>Bearer Token:</label>
        <input
          value={bearerToken}
          onChange={(e) => setBearerToken(e.target.value)}
          placeholder="Bearer Token"
        />
      </div>
      <div>
        <label>Project ID:</label>
        <input
          value={projectID}
          onChange={(e) => setProjectID(e.target.value)}
          placeholder="Project ID"
        />
      </div>
      <div>
        <label>Category:</label>
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
        />
      </div>
      <button onClick={fetchItems}>Refresh</button>
      <ul>
        {items.map((item) => (
          <li key={item.ItemID}>
            {JSON.stringify(item.Data)}
            <button onClick={() => handleEdit(item)}>Edit</button>
            <button onClick={() => handleDelete(item.ItemID)}>Delete</button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          name="Data"
          value={dataString}
          onChange={handleDataChange}
          placeholder="Data (JSON format)"
        />
        <input
          name="Scope"
          value={formData.Scope}
          onChange={handleInputChange}
          placeholder="Scope"
        />
        <button type="submit">{editMode ? "Update" : "Add"}</button>
      </form>
    </div>
  );
}

export default Item;
