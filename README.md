# TABU Construction Website

A **simple, static file-based** construction company website with admin panel for managing projects, equipment, job listings, and gallery.

## Features

- **100% Static Website** - No backend server needed
- **Admin Panel** - Simple authentication and file management
- **Project Management** - Upload and manage construction projects
- **Equipment Management** - Add, edit, and manage construction equipment
- **Job Listings** - Post and manage career opportunities
- **Gallery Management** - Upload and manage gallery images
- **Responsive Design** - Works on all devices
- **Local Storage** - Data persists in browser
- **Flat-File Storage** - Jobs stored in JSON file

## How It Works

### Authentication
- Username: `admin`
- Password: `tabu123`
- Change these in `config.js` if needed

### File Structure
```
uploads/
├── gallery/           # Project images and gallery images
└── equipment/         # Equipment images

jobs.json              # Job listings data (flat-file storage)
```

### Admin Panel
1. **Login** with admin credentials
2. **Upload Projects** - Add new construction projects with images
3. **Manage Equipment** - Add, edit, and delete construction equipment
4. **Manage Jobs** - Post, edit, and delete job opportunities
5. **Dashboard** - View statistics and recent uploads

## Setup

1. **No installation needed** - Just open the files in a web browser
2. **Local Development** - Use a local server (like Live Server in VS Code)
3. **Deployment** - Upload all files to any web hosting service

## How It Works (Simple!)

### Adding Projects
1. Go to Admin Panel → Upload Project
2. Fill in project details (title, category, description, location, year)
3. Upload images
4. Images are stored in browser's localStorage
5. Projects appear on main website Projects section

### Adding Equipment
1. Go to Admin Panel → Manage Equipments
2. Fill in equipment details (name, specs, features)
3. Upload equipment image
4. Images are stored in browser's localStorage
5. Equipment appears on main website Equipment section

### Adding Jobs
1. Go to Admin Panel → Manage Jobs
2. Fill in job details (title, department, location, type, experience, salary, description, requirements, responsibilities, benefits)
3. Jobs are stored in `jobs.json` file
4. Jobs appear on main website Job Listings section

### Adding Gallery Images
1. Go to Admin Panel → Gallery Management
2. Upload multiple images
3. Images are stored in browser's localStorage
4. Images appear in the main website gallery modal

## How Content Is Displayed

### Main Website
- **Projects Section** → reads from localStorage data
- **Equipment Section** → reads from localStorage data
- **Job Listings** → reads from `jobs.json` file
- **Gallery Button** → shows all images from localStorage data

### Admin Panel
- **Manage Projects** → shows images from localStorage data
- **Manage Equipment** → shows images from localStorage data
- **Manage Jobs** → manages `jobs.json` file
- **Gallery Management** → manages localStorage data

## Important Notes

### Data Persistence
- **Project and Equipment data** is stored in browser's localStorage
- **Job listings** are stored in `jobs.json` file (persistent across browsers)
- **Data persists between page refreshes**
- **Jobs are shared across all users/devices**

### Image Files
- **Images are NOT actually saved to uploads folder**
- **Images are stored as base64 data in localStorage**
- **This is a limitation of client-side only approach**

## Security Notes

- **Configure admin credentials securely` before deployment
- **Admin panel is accessible** to anyone who knows the credentials
- **No server-side validation** - all validation is client-side
- **Suitable for simple use cases** where security isn't critical
- **Data is stored locally** in user's browser

## Deployment

1. **Upload all files** to your web hosting service
2. **Test admin panel** functionality
3. **Change default password** in production
4. **Note**: Images will only persist in each user's browser
5. **Jobs will persist** across all users (stored in `jobs.json`)

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Responsive design for mobile devices
- localStorage support required

## Support

For issues or questions:
1. Check browser console for errors
2. Verify all files are uploaded correctly
3. Make sure you're using a local server (not opening files directly)
4. Check if localStorage is enabled in your browser

## Limitations

- **Images are not permanently stored** on the server
- **Project/Equipment data is browser-specific** (won't sync across devices)
- **Jobs are shared** across all users (stored in `jobs.json`)
- **No backup** of uploaded images
- **Limited by browser storage capacity** 
