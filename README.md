# Snake Game with Logo Reveal Mechanic

A modern implementation of the classic Snake game with a unique logo reveal mechanic. The game features a grayscale logo that gradually reveals its colors as you collect food, creating an engaging gameplay experience that combines the traditional snake game with a discovery element.

## Game Features

### Core Gameplay
- Classic snake movement mechanics
- Food collection for growth and points
- Wall wrapping (snake can move through walls)
- Score tracking
- AI mode available
- Mobile-friendly controls
- Responsive design

### Logo Reveal System
- 7x7 grid logo (49 unique blocks)
- Initial grayscale display
- Progressive color revelation
- Permanent color unlocking
- Completion tracking and celebration

## Game Mechanics

### Snake Movement
- Use arrow keys for desktop
- Touch controls for mobile devices
- Snake wraps around screen edges
- Collision with self ends the game

### Scoring System
- Each food item: 10 points
- Total possible logo reveal score: 490 points (49 blocks × 10 points)
- Game continues after logo completion with same scoring

### Logo Mechanics
1. **Initial State**
   - Logo starts in grayscale
   - Each block is individually tracked
   - 49 unique positions regardless of color duplicates

2. **Food Generation**
   - Food colors match unrevealed logo blocks
   - Each block must be revealed exactly once
   - After full reveal, colors are randomly selected from all blocks

3. **Color Revelation**
   - Eating food reveals corresponding logo block
   - Revealed colors are permanent
   - Current food block pulses until collected

4. **Completion System**
   - Message displays upon revealing all 49 blocks
   - Game continues with random colors from palette
   - Logo stays fully colored for remainder of game

## Technical Implementation

### Core Classes

#### LogoHandler Class
Manages the logo display, color revelation, and food color selection.

**Key Methods:**
```javascript
constructor()
- Initializes logo container and SVG
- Sets up block tracking system
- Creates completion message element

extractBlocks()
- Processes SVG rectangles into tracked blocks
- Creates unique IDs based on coordinates
- Returns array of block objects with:
  * id: coordinate-based identifier
  * color: original color value
  * element: DOM reference

styleLogoContainer()
- Sets up responsive sizing
- Applies initial grayscale filter
- Configures transitions and animations

startPulsatingAnimation()
- Manages opacity pulsing for current food block
- Runs on 1-second interval
- Only active before full revelation

getNextFoodColor()
- Selects random unrevealed block for food
- Returns color for food generation
- Handles post-completion color selection

revealColor(color)
- Reveals specific block matching food color
- Updates tracking systems
- Manages block removal from remaining pool
- Sets up next food block

checkLogoCompletion()
- Monitors revealed block count
- Triggers completion at 49 blocks
- Shows completion message
- Ensures full opacity on all blocks

reset()
- Restores initial grayscale state
- Clears tracking systems
- Resets completion status
```

### Block Tracking System

```javascript
Block Object Structure:
{
    id: "x,y",          // Unique position identifier
    color: "#XXXXXX",   // Original color value
    element: DOMElement // Reference to SVG rect
}

Tracking Collections:
- this.blocks: All 49 blocks
- this.remainingBlocks: Unrevealed blocks
- this.revealedBlocks: Set of revealed block IDs
```

### State Management

```javascript
Game States:
- Initial: All blocks grayscale
- In Progress: Mixed grayscale and color
- Complete: All blocks colored

Block States:
- Unrevealed: Grayscale
- Current Food: Pulsing opacity
- Revealed: Full color, full opacity
```

## CSS Styling

### Logo Container
- Responsive sizing based on game container
- Maintains aspect ratio
- Smooth transitions for all effects

### Block Styling
```css
Initial State:
- filter: grayscale(100%) brightness(1)
- opacity: 1
- transition: all 0.3s ease

Revealed State:
- filter: none
- opacity: 1
- mixBlendMode: normal
- backgroundColor: transparent
```

## Mobile Responsiveness

- Adapts to screen size
- Touch-friendly controls
- Maintains gameplay experience across devices
- Responsive layout adjustments

## Game Integration

### Setup
1. Include required files:
   - index.html
   - styles.css
   - game.js
   - logoHandler.js

2. Initialize game:
```javascript
window.addEventListener('load', () => {
    new SnakeGame();
});
```

### Customization
- Replace SVG content in `getSVGContent()`
- Adjust styling in CSS
- Modify completion message
- Customize animation timings

## Performance Considerations

- Efficient block tracking system
- Optimized DOM updates
- Smooth transitions and animations
- Mobile-friendly resource usage

## Browser Compatibility

- Modern browser support
- Touch event handling
- CSS3 transitions and filters
- SVG rendering support required 