# Property Search Filter System - Quick Start Guide

## 📋 Files Created

```
src/Components/
├── PropertySearch.jsx        (Main search component)
├── FilterPopup.jsx          (Popup container)
├── PopupStepController.jsx  (Individual popup renderer)
├── PropertySearch.css       (Search bar styling)
├── FilterPopup.css          (Overlay styling)
└── PopupStepController.css  (Modal styling)

src/Services/
└── propertyApiService.js    (API calls)
```

## ⚡ 5-Minute Integration

### Step 1: Import Component
```jsx
import PropertySearch from './Components/PropertySearch';
```

### Step 2: Add to Your Page
```jsx
function PropertyListingPage() {
  return (
    <div>
      <PropertySearch />
      {/* Your property list/results here */}
    </div>
  );
}
```

### Step 3: Setup Backend Endpoint
Create an API endpoint that accepts these query parameters:
```
GET /api/properties?area=&type=&budget=&bhk=
```

### Step 4: Done! 🎉
The component is now fully functional with:
- ✅ Area search input
- ✅ Sequential filter popups
- ✅ Smart state management
- ✅ API integration ready
- ✅ Responsive design

## 🎨 Customization Examples

### Change Filter Options
Edit `FilterPopup.jsx` line ~30:
```jsx
const POPUP_STEPS = [
  {
    id: 1,
    title: 'Select Property Type',
    field: 'propertyType',
    options: ['Apartment', 'Villa', 'Independent House', 'Plot']  // ← Edit here
  },
  // ...
];
```

### Change Primary Color
Find and replace in all CSS files:
```css
#2563eb → #your-color  /* Blue */
#1d4ed8 → #your-color-dark /* Dark Blue */
```

### Adjust Popup Width
In `PopupStepController.css`:
```css
.popup-step-controller {
  max-width: 600px;  /* Increase this */
}
```

## 🔧 Backend Setup (Node.js/Express)

### Basic Endpoint
```javascript
const express = require('express');
const router = express.Router();

router.get('/api/properties', async (req, res) => {
  const { area, type, budget, bhk } = req.query;
  
  // Build your MongoDB/SQL query
  const filter = {};
  
  if (area) filter.area = { $regex: area, $options: 'i' };
  if (type) filter.propertyType = type.replace('-', ' ');
  if (bhk) filter.bhk = bhk;
  
  // Add budget range logic
  if (budget) {
    const ranges = {
      'below-10l': { $lte: 1000000 },
      '10l-25l': { $gte: 1000000, $lte: 2500000 },
      // ... more ranges
    };
    filter.price = ranges[budget];
  }
  
  const properties = await Property.find(filter);
  res.json({ success: true, count: properties.length, properties });
});

module.exports = router;
```

### Environment Setup
Create `.env`:
```
REACT_APP_API_URL=http://localhost:5000
```

## 📱 Responsive Breakpoints

| Device | Width | Notes |
|--------|-------|-------|
| Desktop | 1024px+ | Full popup with animations |
| Tablet | 768px-1023px | Optimized layout |
| Mobile | 480px-767px | Single column, touch-friendly |
| Small Mobile | <480px | Extra compact |

All breakpoints are handled automatically by CSS.

## 🎯 Filter Sequence

```
User Input (Area)
    ↓
Popup 1: Property Type
    ├─ Close → Exit
    ├─ Skip → Next
    └─ Next → Save & Next
    ↓
Popup 2: Budget Range
    ├─ Close → Exit
    ├─ Skip → Next
    └─ Next → Save & Next
    ↓
Popup 3: BHK
    ├─ Close → Exit
    ├─ Skip → Next
    └─ Next → Save & Next
    ↓
Confirmation Screen
    ├─ Close → Exit
    ├─ Skip → Back
    └─ Search → API Call
    ↓
Results Displayed
```

## 🔄 State Flow

```javascript
PropertySearch
├── State: searchArea, filters, showFilterPopup
├── On Search Click → Sets filters, shows FilterPopup
└── FilterPopup
    ├── State: currentStep, filters
    ├── Renders: PopupStepController
    └── On Next → Updates currentStep
        └── On Complete → Calls API, closes popup
```

## 📊 API Query Parameters

| Parameter | Type | Example | Format |
|-----------|------|---------|--------|
| `area` | string | `arumbarthapuram` | lowercase |
| `type` | string | `apartment` | lowercase |
| `budget` | string | `25-50` | lowercase, hyphenated |
| `bhk` | string | `2` | number |

**Example URL:**
```
/api/properties?area=chennai&type=apartment&budget=25-50&bhk=2
```

## ✨ Features Summary

| Feature | Status | Notes |
|---------|--------|-------|
| Sequential Popups | ✅ | 1 question per popup |
| Close/Skip/Next Buttons | ✅ | Full control |
| Progress Bar | ✅ | Visual feedback |
| Responsive Design | ✅ | Mobile to desktop |
| Dark Mode | ✅ | Automatic detection |
| API Integration | ✅ | Query parameters |
| Accessible | ✅ | WCAG compliant |
| Animations | ✅ | Smooth transitions |

## 🐛 Common Issues

### "API not working"
- Check `.env` file has `REACT_APP_API_URL`
- Verify backend is running
- Check Network tab in DevTools
- Ensure query parameters match your API

### "Popup not showing"
- Check browser console for errors
- Verify `PropertySearch.jsx` is imported correctly
- Ensure CSS files are in correct folder

### "Styling looks wrong"
- Clear browser cache
- Check all CSS files are in `src/Components/`
- Verify class names match between JSX and CSS

## 📦 Dependencies

No external packages required! Uses only:
- React (built-in)
- Vanilla CSS (no frameworks)
- Fetch API (built-in)

## 🚀 Performance Tips

1. **Memoize callbacks** if component re-renders frequently
   ```javascript
   const handleFilters = useCallback(() => { }, []);
   ```

2. **Lazy load results** for large datasets
   ```javascript
   useEffect(() => {
     // Implement pagination
   }, [filters]);
   ```

3. **Debounce API calls** if adding search as you type
   ```javascript
   const debounce = (fn, delay) => {
     let timeoutId;
     return (...args) => {
       clearTimeout(timeoutId);
       timeoutId = setTimeout(() => fn(...args), delay);
     };
   };
   ```

## 📚 Full Documentation

For complete documentation, configuration options, and advanced features, see:
- `PROPERTY_SEARCH_SYSTEM_DOCUMENTATION.md` - Full docs
- `PROPERTY_SEARCH_IMPLEMENTATION_GUIDE.js` - Code examples

## 🆘 Need Help?

Check these files in order:
1. **Quick integration issue?** → Start here (this file)
2. **How does it work?** → Implementation Guide
3. **How to customize?** → Full Documentation
4. **Still stuck?** → Check component comments

## ✅ Verification Checklist

After integration, verify:

- [ ] All component files are in `src/Components/`
- [ ] All CSS files are in `src/Components/`
- [ ] `propertyApiService.js` is in `src/Services/`
- [ ] `.env` file has `REACT_APP_API_URL`
- [ ] Backend endpoint `/api/properties` works
- [ ] Component renders without console errors
- [ ] Search input appears on page
- [ ] Clicking Search shows first popup
- [ ] All popup buttons work (Close, Skip, Next)
- [ ] Final "Search" button calls API
- [ ] Results display correctly

---

## 🎯 What's Next?

After basic integration:

1. **Add saved searches** → Save to localStorage
2. **Add filter history** → Show recent searches
3. **Add autocomplete** → For area names
4. **Add map view** → Show properties on map
5. **Add favorites** → Save favorite properties
6. **Add notifications** → New property alerts

## 📞 Support

For questions or issues, check:
- Component source code comments
- Documentation files
- Browser console for specific errors
- API response format

---

**Version:** 1.0.0
**Last Updated:** March 2026
**Status:** Ready to Use ✓
