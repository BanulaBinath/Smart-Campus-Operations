import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import './CreateTicket.css';

function CreateTicket() {
  const [formData, setFormData] = useState({
    location: '',
    category: '',
    description: '',
    priority: '',
    contactDetails: '',
    images: []
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'images') {
      const selectedFiles = Array.from(files);

      if (selectedFiles.length > 3) {
        setErrorMessage('You can upload a maximum of 3 images only.');
        return;
      }

      setErrorMessage('');
      setFormData((prev) => ({
        ...prev,
        images: selectedFiles
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setErrorMessage('');
    setSuccessMessage('Ticket form submitted successfully.');

    console.log('Ticket Data:', formData);
  };

  return (
    <DashboardLayout role="USER">
      <section className="create-ticket-box">
        <div className="create-ticket-header">
          <h1>Create Support Ticket</h1>
          <p>Submit a maintenance issue with all the required details for faster resolution.</p>
        </div>

        <form className="create-ticket-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Location / Resource</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter resource or location"
                required
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select category</option>
                <option value="Projector Issue">Projector Issue</option>
                <option value="Air Conditioning">Air Conditioning</option>
                <option value="Electrical">Electrical</option>
                <option value="Furniture Damage">Furniture Damage</option>
                <option value="Cleaning Issue">Cleaning Issue</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                required
              >
                <option value="">Select priority</option>
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="URGENT">URGENT</option>
              </select>
            </div>

            <div className="form-group">
              <label>Contact Details</label>
              <input
                type="text"
                name="contactDetails"
                value={formData.contactDetails}
                onChange={handleChange}
                placeholder="Enter phone number or email"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the issue clearly"
              rows="6"
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label>Upload Images (Maximum 3)</label>
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={handleChange}
            />
          </div>

          {errorMessage && <p className="form-message error-message">{errorMessage}</p>}
          {successMessage && <p className="form-message success-message">{successMessage}</p>}

          <button type="submit" className="submit-ticket-btn">
            Submit Ticket
          </button>
        </form>
      </section>
    </DashboardLayout>
  );
}

export default CreateTicket;