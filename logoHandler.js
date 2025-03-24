class LogoHandler {
    constructor() {
        this.logoContainer = document.createElement('div');
        this.logoContainer.className = 'logo-container';
        this.logoContainer.innerHTML = this.getSVGContent();
        
        // Extract blocks with their colors and positions
        this.blocks = this.extractBlocks();
        this.remainingBlocks = [...this.blocks];
        this.currentFoodRect = null;
        this.revealedBlocks = new Set();
        this.isLogoFullyRevealed = false;
        
        // Create completion message element
        this.completionMessage = document.createElement('div');
        this.completionMessage.style.color = '#fff';
        this.completionMessage.style.textAlign = 'center';
        this.completionMessage.style.marginTop = '10px';
        this.completionMessage.style.fontSize = '14px';
        this.completionMessage.style.display = 'none';
        this.completionMessage.textContent = 'Coming Soon: OneAI!';
        
        // Add to sidebar before the controls div
        const sidebar = document.querySelector('.sidebar');
        const controls = sidebar.querySelector('.controls');
        this.logoContainer.appendChild(this.completionMessage);
        sidebar.insertBefore(this.logoContainer, controls);
        
        // Style the logo container
        this.styleLogoContainer();
        
        // Start pulsating animation
        this.startPulsatingAnimation();
    }
    
    getSVGContent() {
        return `<svg baseProfile="full" height="252" version="1.1" width="252" xmlns="http://www.w3.org/2000/svg" xmlns:ev="http://www.w3.org/2001/xml-events" xmlns:xlink="http://www.w3.org/1999/xlink">
            <defs />
            <rect fill="black" height="252" width="252" x="0" y="0" />
            <rect fill="#0076bf" height="36" width="36" x="0" y="0" />
            <rect fill="#000102" height="36" width="36" x="36" y="0" />
            <rect fill="#2481c3" height="36" width="36" x="72" y="0" />
            <rect fill="#010305" height="36" width="36" x="108" y="0" />
            <rect fill="#9391c5" height="36" width="36" x="144" y="0" />
            <rect fill="#060608" height="36" width="36" x="180" y="0" />
            <rect fill="#efa8c7" height="36" width="36" x="216" y="0" />
            <rect fill="#017a95" height="36" width="36" x="0" y="36" />
            <rect fill="#000102" height="36" width="36" x="36" y="36" />
            <rect fill="#000102" height="36" width="36" x="72" y="36" />
            <rect fill="#7a8ba0" height="36" width="36" x="108" y="36" />
            <rect fill="#a796a4" height="36" width="36" x="144" y="36" />
            <rect fill="#070606" height="36" width="36" x="180" y="36" />
            <rect fill="#f1a69f" height="36" width="36" x="216" y="36" />
            <rect fill="#097a6b" height="36" width="36" x="0" y="72" />
            <rect fill="#000101" height="36" width="36" x="36" y="72" />
            <rect fill="#718365" height="36" width="36" x="72" y="72" />
            <rect fill="#928d68" height="36" width="36" x="108" y="72" />
            <rect fill="#b39566" height="36" width="36" x="144" y="72" />
            <rect fill="#070604" height="36" width="36" x="180" y="72" />
            <rect fill="#060404" height="36" width="36" x="216" y="72" />
            <rect fill="#000302" height="36" width="36" x="0" y="108" />
            <rect fill="#406e40" height="36" width="36" x="36" y="108" />
            <rect fill="#6f783d" height="36" width="36" x="72" y="108" />
            <rect fill="#948039" height="36" width="36" x="108" y="108" />
            <rect fill="#b98834" height="36" width="36" x="144" y="108" />
            <rect fill="#d68c2a" height="36" width="36" x="180" y="108" />
            <rect fill="#0b0702" height="36" width="36" x="216" y="108" />
            <rect fill="#35503f" height="36" width="36" x="0" y="144" />
            <rect fill="#55563e" height="36" width="36" x="36" y="144" />
            <rect fill="#050503" height="36" width="36" x="72" y="144" />
            <rect fill="#040301" height="36" width="36" x="108" y="144" />
            <rect fill="#ae6132" height="36" width="36" x="144" y="144" />
            <rect fill="#d0652c" height="36" width="36" x="180" y="144" />
            <rect fill="#0b0502" height="36" width="36" x="216" y="144" />
            <rect fill="#020302" height="36" width="36" x="0" y="180" />
            <rect fill="#633e3a" height="36" width="36" x="36" y="180" />
            <rect fill="#783e35" height="36" width="36" x="72" y="180" />
            <rect fill="#953f31" height="36" width="36" x="108" y="180" />
            <rect fill="#ba412e" height="36" width="36" x="144" y="180" />
            <rect fill="#100603" height="36" width="36" x="180" y="180" />
            <rect fill="#e23a21" height="36" width="36" x="216" y="180" />
            <rect fill="#552d3a" height="36" width="36" x="0" y="216" />
            <rect fill="#060404" height="36" width="36" x="36" y="216" />
            <rect fill="#842f36" height="36" width="36" x="72" y="216" />
            <rect fill="#9c3035" height="36" width="36" x="108" y="216" />
            <rect fill="#b72b30" height="36" width="36" x="144" y="216" />
            <rect fill="#070101" height="36" width="36" x="180" y="216" />
            <rect fill="#e61c22" height="36" width="36" x="216" y="216" />
        </svg>`;
    }
    
    extractBlocks() {
        const blocks = [];
        const rects = this.logoContainer.querySelectorAll('rect');
        rects.forEach((rect, index) => {
            if (index > 0) { // Skip the background black rectangle
                const x = rect.getAttribute('x');
                const y = rect.getAttribute('y');
                const color = rect.getAttribute('fill');
                blocks.push({
                    id: `${x},${y}`,
                    color: color,
                    element: rect
                });
            }
        });
        return blocks;
    }
    
    styleLogoContainer() {
        // Get the width of the Start Game button for reference
        const startButton = document.getElementById('startButton');
        const buttonWidth = startButton.offsetWidth;
        
        // Style the logo container
        this.logoContainer.style.width = buttonWidth + 'px';
        this.logoContainer.style.margin = '0 auto 20px auto';
        this.logoContainer.style.opacity = '1';
        this.logoContainer.style.transition = 'opacity 0.3s ease';
        this.logoContainer.style.border = '1px solid white';
        this.logoContainer.style.padding = '5px';
        this.logoContainer.style.borderRadius = '4px';
        this.logoContainer.style.position = 'relative';
        
        // Create and style the progress counter
        this.progressCounter = document.createElement('div');
        this.progressCounter.style.position = 'absolute';
        this.progressCounter.style.top = '-25px';
        this.progressCounter.style.left = '0';
        this.progressCounter.style.width = '100%';
        this.progressCounter.style.textAlign = 'center';
        this.progressCounter.style.color = '#fff';
        this.progressCounter.style.fontSize = '14px';
        this.progressCounter.style.fontWeight = 'bold';
        this.progressCounter.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.5)';
        this.progressCounter.textContent = 'Access Progress: 0%';
        this.logoContainer.appendChild(this.progressCounter);
        
        // Style the SVG element itself
        const svg = this.logoContainer.querySelector('svg');
        svg.style.width = '100%';
        svg.style.height = 'auto';
        svg.style.display = 'block';
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.style.backgroundColor = '#000';
        
        // Calculate height to maintain aspect ratio (7:7 grid)
        const height = buttonWidth;
        svg.style.height = height + 'px';
        
        // Style all blocks initially
        this.blocks.forEach(block => {
            block.element.style.opacity = '0';
            block.element.style.transition = 'all 0.3s ease';
            block.element.style.mixBlendMode = 'normal';
            block.element.style.backgroundColor = 'transparent';
        });
    }
    
    startPulsatingAnimation() {
        setInterval(() => {
            if (this.currentFoodRect && !this.isLogoFullyRevealed) {
                const rect = this.currentFoodRect;
                rect.style.opacity = rect.style.opacity === '1' ? '0.5' : '1';
            }
        }, 1000);
    }
    
    checkLogoCompletion() {
        if (this.revealedBlocks.size === 49 && !this.isLogoFullyRevealed) {
            this.isLogoFullyRevealed = true;
            this.completionMessage.style.display = 'block';
            // Ensure all blocks are at full opacity
            this.blocks.forEach(block => {
                block.element.style.opacity = '1';
            });
            // Clear current food rect to stop pulsing
            this.currentFoodRect = null;
        }
    }
    
    getNextFoodColor() {
        if (this.remainingBlocks.length === 0) {
            // If logo is fully revealed, use all colors
            if (this.isLogoFullyRevealed) {
                return this.blocks[Math.floor(Math.random() * this.blocks.length)].color;
            }
            // Otherwise, reset remaining blocks
            this.remainingBlocks = [...this.blocks];
        }
        
        const randomIndex = Math.floor(Math.random() * this.remainingBlocks.length);
        const block = this.remainingBlocks[randomIndex];
        
        // Only update rect appearance if logo is not fully revealed
        if (!this.isLogoFullyRevealed) {
            this.currentFoodRect = block.element;
            block.element.style.opacity = '0.5';
        } else {
            this.currentFoodRect = null;
        }
        
        return block.color;
    }
    
    revealColor(color) {
        if (!this.isLogoFullyRevealed) {
            // Reset the current food rect
            if (this.currentFoodRect) {
                this.currentFoodRect.style.opacity = '0.5';
            }
            
            // Find the next unrevealed block with this color
            const matchingBlock = this.remainingBlocks.find(block => 
                block.color === color && !this.revealedBlocks.has(block.id)
            );
            
            if (matchingBlock) {
                // Show the block with its original color
                matchingBlock.element.style.opacity = '1';
                this.revealedBlocks.add(matchingBlock.id);
                
                // Update progress counter
                const percentage = Math.round((this.revealedBlocks.size / 49) * 100);
                this.progressCounter.textContent = `Access Progress: ${percentage}%`;
                
                // Remove the revealed block from remaining blocks
                const index = this.remainingBlocks.indexOf(matchingBlock);
                if (index > -1) {
                    this.remainingBlocks.splice(index, 1);
                }
                
                this.checkLogoCompletion();
                
                // Set the next food block
                if (!this.isLogoFullyRevealed && this.remainingBlocks.length > 0) {
                    // Get a new random block for the next food
                    const nextIndex = Math.floor(Math.random() * this.remainingBlocks.length);
                    const nextBlock = this.remainingBlocks[nextIndex];
                    this.currentFoodRect = nextBlock.element;
                    this.currentFoodRect.style.opacity = '0.5';
                }
            }
        }
    }
    
    reset() {
        this.remainingBlocks = [...this.blocks];
        this.currentFoodRect = null;
        this.revealedBlocks.clear();
        this.isLogoFullyRevealed = false;
        this.completionMessage.style.display = 'none';
        
        // Reset progress counter
        this.progressCounter.textContent = 'Access Progress: 0%';
        
        this.blocks.forEach(block => {
            // Reset to invisible state
            block.element.style.opacity = '0';
            block.element.style.mixBlendMode = 'normal';
            block.element.style.backgroundColor = 'transparent';
        });
    }
} 