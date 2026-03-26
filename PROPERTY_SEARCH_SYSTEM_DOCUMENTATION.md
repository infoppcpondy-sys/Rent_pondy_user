# Property Search Filter System - Complete Documentation

## Overview

A modern, production-ready property search filter system built with React that displays sequential popup modals for filtering properties by area, property type, budget, and BHK. Inspired by real estate apps like Airbnb, MagicBricks, and Housing.com.

## Features

✨ **Sequential Filter Popups** - One filter question at a time with clear options
🎯 **Smart State Management** - Uses React hooks (useState) for clean state handling
📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile
🎨 **Modern UI Design** - Clean, intuitive interface with smooth animations
⚠️ **User-Friendly Controls** - Close, Skip, and Next buttons for flexibility
🔍 **Advanced Search** - Filter by Area, Property Type, Budget, and BHK
📡 **API Integration** - Sends query parameters to backend for filtered results
♿ **Accessible** - Follows accessibility best practices
🌙 **Dark Mode Support** - Includes dark mode CSS for preference-respecting UX

## Components

### 1. PropertySearch.jsx
Main component that provides the search input interface.

**Responsibilities:**
- Renders the search input field
- Handles search button click
- Initiates the filter popup sequence
- Manages loading state
- Calls API to fetch filtered properties

**Props:** None (self-contained)

**State:**
```javascript
{
  searchArea: string,        // User's area input
  showFilterPopup: boolean,  // Show/hide filter modal
  filters: {                 // Selected filter values
    area: string,
    propertyType: string,
    budget: string,
    bhk: string
  },
  isLoading: boolean         // API loading state
}
```

### 2. FilterPopup.jsx
Container component that manages the filter popup lifecycle and state.

**Responsibilities:**
- Defines the filter popup steps
- Manages current step in the sequence
- Tracks selected filters
- Renders the overlay and step controller
- Handles completion of filter process

**Props:**
```javascript
{
  initialFilters: object,      // Initial filter values
  onFiltersComplete: function, // Callback when filters are applied
  onClose: function,           // Callback to close popup
  isLoading: boolean          // Loading state from parent
}
```

**Filter Steps:**
1. Property Type (Apartment, Villa, Independent House, Plot)
2. Budget (Below 10L, 10L-25L, 25L-50L, 50L-1Cr, Above 1Cr)
3. BHK (1 BHK, 2 BHK, 3 BHK, 4+ BHK)
4. Confirmation Screen (Review & Search)

### 3. PopupStepController.jsx
Renders individual popup step with options and buttons.

**Responsibilities:**
- Display current filter question
- Render selectable options
- Show confirmation screen on final step
- Handle button interactions (Close, Skip, Next)
- Display progress indicator
- Manage visual feedback for selections

**Props:**
```javascript
{
  step: number,              // Current step (1-4)
  totalSteps: number,        // Total steps (4)
  popup: object,             // Current popup configuration
  filters: object,           // Current filter selections
  onOptionSelect: function,  // When user selects an option
  onNext: function,          // Next button handler
  onSkip: function,          // Skip button handler
  onClose: function,         // Close button handler
  isLoading: boolean        // Loading state
}
```

## CSS Files

### PropertySearch.css
- Search input and button styling
- Responsive layout for search bar
- Focus states and animations
- Mobile-first approach

### FilterPopup.css
- Dark overlay background (rgba(0,0,0,0.6))
- Fade-in animations

### PopupStepController.css
- Complete modal styling with animations
- Responsive grid layouts
- Button styles (primary, secondary, tertiary)
- Progress bar styling
- Dark mode support
- Comprehensive media queries for all screen sizes
- Smooth transitions and interactions

## User Flow

```
User enters area name
        ↓
User clicks "Search" button
        ↓
Popup 1: Select Property Type (with options)
        ↓
        ├─ Close → Closes everything
        ├─ Skip → Go to Popup 2
        └─ Next → Save selection & Go to Popup 2
        ↓
Popup 2: Select Budget (with options)
        ↓
        ├─ Close → Closes everything
        ├─ Skip → Go to Popup 3 (skip this filter)
        └─ Next → Save selection & Go to Popup 3
        ↓
Popup 3: Select BHK (with options)
        ↓
        ├─ Close → Closes everything
        ├─ Skip → Go to Confirmation (skip this filter)
        └─ Next → Save selection & Go to Confirmation
        ↓
Confirmation Screen: Review all filters
        ↓
        ├─ Close → Closes everything
        ├─ Skip → Go back to search
        └─ Search → Call API with filters & Close
        ↓
API Call: /api/properties?area=...&type=...&budget=...&bhk=...
        ↓
Display Results or Handle Error
```

## API Integration

### Frontend to Backend Communication

The PropertySearch component builds query parameters from selected filters:

```javascript
// Example API call:
GET /api/properties?area=arumbarthapuram&type=apartment&budget=25-50&bhk=2
```

Query Parameters:
| Parameter | Description | Example |
|-----------|-------------|---------|
| `area` | Property location | `arumbarthapuram` |
| `type` | Property type (lowercase) | `apartment` |
| `budget` | Budget range (lowercase, hyphenated) | `25-50` |
| `bhk` | Number of bedrooms | `2` |

### Backend Endpoint Example (Node.js/Express)

```javascript
// GET /api/properties
router.get('/api/properties', async (req, res) => {
  const { area, type, budget, bhk } = req.query;

  // Build MongoDB filter
  const filter = {};

  if (area) {
    filter.area = { $regex: area, $options: 'i' };
  }

  if (type) {
    filter.propertyType = type.replace('-', ' ');
  }

  if (budget) {
    const budgetRanges = {
      'below-10l': { min: 0, max: 1000000 },
      '10l-25l': { min: 1000000, max: 2500000 },
      '25l-50l': { min: 2500000, max: 5000000 },
      '50l-1cr': { min: 5000000, max: 10000000 },
      'above-1cr': { min: 10000000, max: Infinity }
    };
    const range = budgetRanges[budget];
    if (range) {
      filter.price = { $gte: range.min, $lte: range.max };
    }
  }

  if (bhk) {
    filter.bhk = bhk;
  }

  const properties = await Property.find(filter).limit(20);
  res.json({ success: true, count: properties.length, properties });
});
```

### Expected Response Format

```json
{
  "success": true,
  "count": 15,
  "properties": [
    {
      "_id": "123abc",
      "name": "Modern Apartment",
      "area": "Arumbarthapuram",
      "propertyType": "Apartment",
      "bhk": "2",
      "price": 4500000,
      "image": "url-to-image",
      "description": "Spacious 2 BHK apartment..."
    }
  ]
}
```

## Installation & Setup

### 1. Copy Component Files

Place these files in your `src/Components/` directory:
- `PropertySearch.jsx`
- `FilterPopup.jsx`
- `PopupStepController.jsx`
- `PropertySearch.css`
- `FilterPopup.css`
- `PopupStepController.css`

### 2. Copy Service File

Place this file in your `src/Services/` directory:
- `propertyApiService.js`

### 3. Setup Environment Variables

Create a `.env` file in your project root:
```
REACT_APP_API_URL=http://localhost:5000
```

For production:
```
REACT_APP_API_URL=https://your-api-domain.com
```

### 4. Import and Use

```javascript
import PropertySearch from './Components/PropertySearch';

function App() {
  return (
    <div className="app">
      <PropertySearch />
      {/* Rest of your component */}
    </div>
  );
}
```

## Customization

### Changing Filter Options

Edit the `POPUP_STEPS` array in `FilterPopup.jsx`:

```javascript
const POPUP_STEPS = [
  {
    id: 1,
    title: 'Select Property Type',
    field: 'propertyType',
    options: ['Your', 'Custom', 'Options']
  },
  // ... more steps
];
```

### Customizing Colors

Modify the CSS variables in the component CSS files:

```css
/* Primary color (blue) */
background-color: #2563eb;  /* Change this */

/* Success color, border color, etc. */
border-color: #2563eb;      /* Change this */
```

### Adjusting Popup Size

In `PopupStepController.css`:

```css
.popup-step-controller {
  max-width: 500px;  /* Change this for wider/narrower */
  width: 90%;        /* Change this for responsive width */
}
```

### Disabling Skip Button

In `PopupStepController.jsx`, add a condition:

```javascript
<button
  className="btn btn-tertiary"
  onClick={onSkip}
  disabled={isLoading || !allowSkip}  // Add custom condition
>
  Skip
</button>
```

## Styling Integration

The component uses `PropertySearch.css` to style only the search input. It does **NOT** modify the existing search input styles from your application. If you have custom styling for search inputs, it will be preserved.

Key classes:
- `.property-search-container` - Main wrapper
- `.search-wrapper` - Flex container for input and button
- `.search-input` - Text input field
- `.search-button` - Search button

## Responsive Design

The system is fully responsive with breakpoints for:

- **Desktop** (1024px+): Full-size popup with multi-column layouts
- **Tablet** (768px - 1023px): Optimized for medium screens
- **Mobile** (480px - 767px): Single-column, compact layout
- **Small Mobile** (<480px): Extra compact with adjusted spacing

All CSS uses mobile-first approach for better performance.

## Accessibility Features

✓ Semantic HTML structure
✓ ARIA labels on buttons
✓ Keyboard navigation support
✓ Color contrast meets WCAG standards
✓ Focus states clearly visible
✓ Reduced motion media query support
✓ Screen reader friendly
✓ Touch-friendly button sizes (min 44x44px on mobile)

## Performance Optimization

- Lazy loading of components (if needed)
- Memoized callbacks to prevent unnecessary re-renders
- Efficient CSS with no animation on mobile (prefers-reduced-motion)
- Minimal DOM manipulation
- Optimized event listeners

## Error Handling

The `PropertySearch` component includes:

```javascript
try {
  const response = await fetch(`/api/properties?${queryParams}`);
  if (!response.ok) throw new Error('Failed to fetch');
  const data = await response.json();
  // Handle success
} catch (error) {
  console.error('Error fetching properties:', error);
  alert('Failed to fetch properties. Please try again.');
}
```

## Browser Support

✓ Chrome/Edge 90+
✓ Firefox 88+
✓ Safari 14+
✓ Mobile browsers (iOS Safari, Chrome Mobile)
✓ IE 11 (with polyfills for CSS Grid)

## Known Limitations

1. **Overlay Close**: Clicking the overlay currently closes the popup. To disable, remove or modify the `onClick={onClose}` on the overlay div.

2. **Multi-Select**: Currently single-select for each filter. To enable multi-select, you'd need to modify the filters structure from string to array.

3. **Dynamic Options**: Filter options are hardcoded. To make them dynamic from API, fetch from `/api/filter-options` on component mount.

4. **Validation**: Area input is not validated against backend. Add validation in `PropertySearch.jsx` if needed.

## Advanced Features

### Adding Area Auto-complete

```javascript
const [areaSuggestions, setAreaSuggestions] = useState([]);

const handleAreaChange = async (value) => {
  setSearchArea(value);
  if (value.length > 2) {
    const suggestions = await fetchAreaSuggestions(value);
    setAreaSuggestions(suggestions);
  }
};
```

### Adding Filter History

```javascript
const [filterHistory, setFilterHistory] = useState([]);

const handleFiltersComplete = (filters) => {
  setFilterHistory([...filterHistory, filters]);
  // ...also save to localStorage
};
```

### Adding Recent Searches

```javascript
// Save to localStorage
localStorage.setItem('recentSearches', JSON.stringify([...recent, searchArea]));

// Load on component mount
useEffect(() => {
  const recent = JSON.parse(localStorage.getItem('recentSearches')) || [];
  setRecentSearches(recent);
}, []);
```

## Testing

### Unit Tests Example

```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PropertySearch from './PropertySearch';

describe('PropertySearch Component', () => {
  test('renders search input and button', () => {
    render(<PropertySearch />);
    expect(screen.getByPlaceholderText(/search by area/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  test('shows error when search area is empty', () => {
    render(<PropertySearch />);
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    expect(screen.getByText(/please enter an area name/i)).toBeInTheDocument();
  });

  test('shows filter popup when search is valid', async () => {
    render(<PropertySearch />);
    fireEvent.change(screen.getByPlaceholderText(/search by area/i), {
      target: { value: 'Chennai' }
    });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/select property type/i)).toBeInTheDocument();
    });
  });
});
```

## Troubleshooting

### Popup Not Appearing
- Check if `showFilterPopup` state is true
- Verify FilterPopup component is imported correctly
- Check browser console for errors

### API Not Returning Data
- Verify API endpoint is correct in `.env`
- Check Network tab in DevTools
- Ensure backend is running
- Check query parameters format

### Styling Issues
- Clear browser cache (Ctrl+Shift+Delete)
- Check CSS file paths
- Verify CSS class names match component
- Use browser DevTools to inspect elements

### Mobile Layout Broken
- Check viewport meta tag in HTML head
- Verify CSS media queries are correct
- Test with actual mobile device, not just DevTools emulation

## Future Enhancements

Potential improvements:
- [ ] Multi-select filters
- [ ] Custom date range picker
- [ ] Saved searches functionality
- [ ] Filter presets (e.g., "Popular", "New Listed")
- [ ] Map view integration
- [ ] Advanced filters (amenities, parking, etc.)
- [ ] Real-time filter result count updates
- [ ] Filter analytics and tracking

## Support & Contribution

For issues or feature requests, please refer to the main project documentation or contact the development team.

## License

This component is part of the Rent Pondy application and follows the same license as the parent project.

---

**Last Updated:** March 2026
**Version:** 1.0.0
**Status:** Production Ready ✓
