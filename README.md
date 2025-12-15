# Movie Recommendation System

A React-based movie recommendation frontend application with role-based access control.

## Features

- **Admin Role**: View user watching history and genre preferences
- **Viewer Role**: Get movie recommendations and mark movies as watched
- **70 Movies Database**: Including latest 2023 releases
- **Hot Movies Slideshow**: Auto-playing showcase of trending films
- **Movie Detail Modal**: Click any movie to view full details
- **Dark Theme**: Professional dark UI with Manrope font

## Tech Stack

- React 18.2.0
- React Router DOM 6.20.0
- LocalStorage for data persistence
- Manrope Font (Google Fonts)

## Deployment

### Deploy to Render

1. Push code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click "New Static Site"
4. Connect your GitHub repository
5. Configure:
   - **Name**: movie-recommend
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
6. Click "Create Static Site"

Render will automatically deploy your app!

### Environment

No environment variables needed - all data stored in browser localStorage.

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Test production build locally
npm install -g serve
serve -s build
```

## Default Accounts

### Admin
- Username: `admin`
- Password: `admin123`

### Viewers
- Username: `viewer1` / Password: `viewer123`
- Username: `viewer2` / Password: `viewer123`
- Username: `viewer3` / Password: `viewer123`

## Project Structure

```
src/
├── components/        # Reusable components (Slideshow, Modal)
├── constants/         # App constants
├── contexts/          # React contexts (Auth)
├── layouts/           # Layout components
├── pages/             # Page components
│   ├── Admin/         # Admin pages
│   └── Viewer/        # Viewer pages
├── routes/            # Route protection
├── services/          # Business logic (movieService)
└── styles/            # CSS files
```

## Features Details

### Hot Movies Slideshow
- Auto-advances every 4 seconds
- Shows movies with rating ≥ 8.0 from 2019+
- Manual navigation with prev/next buttons
- Dot indicators for quick navigation

### Movie Detail Modal
- Click any movie to view details
- Auto-generated descriptions
- Stats display (Year, Rating, Genres)
- Mark as watched functionality

### Navigation
- Logo-based branding
- Top header navigation for Viewers
- Role-based menu display

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
