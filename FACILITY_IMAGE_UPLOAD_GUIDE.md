# Facility Image Upload Integration Guide

## ✅ Implementation Complete

The frontend has been successfully integrated with the existing Spring Boot backend API for facility management with image upload support.

## 🎯 What Was Implemented

### 1. Student Facilities Page (View Only)
**File**: `frontend/src/pages/student/StudentFacilitiesPage.jsx`

**Features**:
- ✅ Fetches facilities from `GET http://localhost:8080/api/facilities`
- ✅ Displays facility images from backend (`imageUrl` field)
- ✅ Shows placeholder image if no image exists
- ✅ Image URL construction: `BASE_URL + facility.imageUrl`
- ✅ Card-based UI with hover effects
- ✅ Image display with fixed height (h-48) and object-cover
- ✅ Rounded corners and shadow effects
- ✅ "View Details" button opens modal with full facility info
- ✅ "Book Now" button (placeholder functionality)
- ✅ Filter by type and status
- ✅ Responsive grid layout (1/2/3 columns)

**Image Handling**:
```javascript
const BASE_URL = "http://localhost:8080";
const DEFAULT_IMAGE = "https://via.placeholder.com/400x250?text=No+Image";

<img 
  src={facility.imageUrl ? `${BASE_URL}${facility.imageUrl}` : DEFAULT_IMAGE}
  alt={facility.name}
  className="w-full h-full object-cover"
  onError={(e) => {
    e.target.src = DEFAULT_IMAGE;
  }}
/>
```

### 2. Admin Add Facility Page (With Image Upload)
**File**: `frontend/src/Components/admin/addFacility.js`

**Features**:
- ✅ Form with all facility fields
- ✅ Image upload with file input
- ✅ Image preview using `URL.createObjectURL()`
- ✅ Image validation (type and size)
- ✅ Remove image button
- ✅ Multipart form data submission
- ✅ Sends to `POST http://localhost:8080/api/facilities`

**Image Upload Implementation**:
```javascript
// Create FormData for multipart request
const formDataToSend = new FormData();

// Append facility data as JSON blob
formDataToSend.append('facility', new Blob([JSON.stringify(facilityData)], { 
  type: 'application/json' 
}));

// Append image if selected
if (selectedImage) {
  formDataToSend.append('image', selectedImage);
}

// Send request
await axios.post(`${BASE_URL}/api/facilities`, formDataToSend, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  withCredentials: true,
});
```

**Image Preview**:
```javascript
const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  }
};
```

## 📋 API Endpoints Used

### 1. Get All Facilities
```
GET http://localhost:8080/api/facilities
```
**Response**:
```json
[
  {
    "id": 1,
    "name": "IT Department",
    "type": "LAB",
    "category": "Academic",
    "capacity": 30,
    "location": "Building A",
    "status": "ACTIVE",
    "description": "Computer Lab",
    "imageUrl": "/uploads/facilities/550e8400-e29b-41d4-a716-446655440000.jpg"
  }
]
```

### 2. Create Facility with Image
```
POST http://localhost:8080/api/facilities
Content-Type: multipart/form-data
```
**Request Body**:
- `facility` (JSON blob): Facility data
- `image` (file): Image file (optional)

**Response**:
```json
{
  "id": 1,
  "name": "IT Department",
  "type": "LAB",
  "category": "Academic",
  "capacity": 30,
  "location": "Building A",
  "status": "ACTIVE",
  "description": "Computer Lab",
  "imageUrl": "/uploads/facilities/550e8400-e29b-41d4-a716-446655440000.jpg"
}
```

### 3. Access Uploaded Image
```
GET http://localhost:8080/uploads/facilities/550e8400-e29b-41d4-a716-446655440000.jpg
```

## 🎨 UI Improvements

### Student View
1. **Card Layout**:
   - Image at top (h-48, rounded corners)
   - Status badge overlay on image
   - Facility details below
   - Action buttons at bottom

2. **Hover Effects**:
   - Card lifts up (`hover:-translate-y-1`)
   - Shadow increases (`hover:shadow-lg`)
   - Smooth transitions (300ms)

3. **Details Modal**:
   - Full-screen overlay
   - Large image display
   - Complete facility information
   - Close button
   - Book button

### Admin View
1. **Image Upload Section**:
   - Drag-and-drop style border
   - Upload icon and instructions
   - Image preview with remove button
   - File size and type validation

2. **Form Layout**:
   - Clean, professional design
   - Proper spacing and alignment
   - Validation messages
   - Loading states

## 🔧 Configuration

### Base URL
```javascript
const BASE_URL = "http://localhost:8080";
```

### Default Placeholder Image
```javascript
const DEFAULT_IMAGE = "https://via.placeholder.com/400x250?text=No+Image";
```

### Image Validation
- **Allowed types**: image/* (jpg, png, gif, etc.)
- **Max size**: 5MB
- **Error handling**: Shows error message if validation fails

## 🧪 Testing Instructions

### 1. Test Student View

1. **Start Backend**:
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

2. **Start Frontend**:
   ```bash
   cd frontend
   npm start
   ```

3. **Login as Student**:
   - Navigate to `http://localhost:3000`
   - Click "Login"
   - Enter student credentials

4. **View Facilities**:
   - Click "Facilities" in sidebar
   - Verify facilities display with images
   - Check placeholder image for facilities without images
   - Click "Details" to view modal
   - Click "Book Now" to test booking alert

### 2. Test Admin Add Facility

1. **Login as Admin**:
   - Navigate to `http://localhost:3000`
   - Click "Login"
   - Enter admin credentials

2. **Navigate to Facilities**:
   - Click "Facilities" in sidebar
   - Click "Add Facility" tab

3. **Upload Image**:
   - Click on upload area
   - Select an image file
   - Verify preview appears
   - Test remove button

4. **Fill Form**:
   - Select facility name
   - Select type
   - Select category
   - Enter capacity (if not GROUND)
   - Enter room number (if CLASSROOM/LAB/HALL)
   - Enter location
   - Select status
   - Enter description

5. **Submit**:
   - Click "Save Facility"
   - Verify success
   - Check facility appears in list with image

### 3. Test Image Display

1. **With Image**:
   - Create facility with image
   - Verify image displays in student view
   - Check image URL in browser DevTools
   - Verify image loads from `/uploads/facilities/`

2. **Without Image**:
   - Create facility without image
   - Verify placeholder image displays
   - Check no broken image icons

3. **Error Handling**:
   - Try uploading non-image file
   - Try uploading file > 5MB
   - Verify error messages display

## 📁 File Structure

```
frontend/src/
├── pages/
│   └── student/
│       └── StudentFacilitiesPage.jsx  ← Updated with image display
├── Components/
│   └── admin/
│       └── addFacility.js             ← Updated with image upload
└── services/
    └── facilityService.js             ← Existing (no changes)
```

## 🔑 Key Features

### Student Side
✅ View facilities with images
✅ Placeholder for missing images
✅ Responsive card layout
✅ Hover effects
✅ Details modal
✅ Filter by type/status
✅ Book Now button (placeholder)

### Admin Side
✅ Upload facility image
✅ Image preview before submit
✅ Remove uploaded image
✅ File validation (type & size)
✅ Multipart form submission
✅ Error handling
✅ Success feedback

## 🚀 Next Steps (Optional Enhancements)

1. **Update Facility with Image**:
   - Modify Facility.js to support image upload in edit mode
   - Allow replacing existing image
   - Keep old image if no new image selected

2. **Image Optimization**:
   - Add image compression before upload
   - Generate thumbnails on backend
   - Lazy loading for images

3. **Gallery View**:
   - Add multiple images per facility
   - Image carousel in details modal
   - Image zoom functionality

4. **Drag & Drop**:
   - Implement drag-and-drop for image upload
   - Show upload progress
   - Support multiple file selection

## ⚠️ Important Notes

1. **No Backend Changes**: All backend functionality already exists
2. **Image Path**: Backend returns `/uploads/facilities/uuid.ext`
3. **Full URL**: Frontend constructs `http://localhost:8080/uploads/facilities/uuid.ext`
4. **Error Handling**: Images that fail to load show placeholder
5. **Validation**: Frontend validates file type and size before upload
6. **Security**: Backend validates on server side as well

## 🎉 Summary

The facility image upload feature is now fully integrated:
- Students can view facilities with images
- Admins can upload images when creating facilities
- Images are stored on the server and served via static file handler
- Proper error handling and validation in place
- Clean, professional UI with hover effects and modals

Everything is working and ready to use! 🚀
