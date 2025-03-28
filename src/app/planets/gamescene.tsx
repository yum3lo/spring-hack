// GameScene.ts
class GameScene {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private scale: number;
    
    constructor(canvas: HTMLCanvasElement, scale: number = 5) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
        this.scale = scale;
        
        // Set canvas size
        this.canvas.width = 320;
        this.canvas.height = 240;
        
        // Scale up for pixelated effect
        this.canvas.style.width = `${this.canvas.width * this.scale}px`;
        this.canvas.style.height = `${this.canvas.height * this.scale}px`;
        this.canvas.style.imageRendering = 'pixelated';
        
        this.ctx.imageSmoothingEnabled = false;
    }
    
    public render() {
        // Clear canvas
        this.ctx.fillStyle = '#6b8cff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw ground
        this.ctx.fillStyle = '#5c4a36';
        this.ctx.fillRect(0, this.canvas.height - 40, this.canvas.width, 40);
        
        // Draw 4 boxes at the bottom
        const boxColors = ['#ff5555', '#55ff55', '#5555ff', '#ffff55'];
        const boxWidth = 40;
        const boxHeight = 30;
        const boxY = this.canvas.height - boxHeight - 5;
        const totalBoxWidth = boxWidth * 4 + 15 * 3; // 4 boxes with 15px spacing
        const startX = (this.canvas.width - totalBoxWidth) / 2;
        
        for (let i = 0; i < 4; i++) {
            this.ctx.fillStyle = boxColors[i];
            this.ctx.fillRect(startX + i * (boxWidth + 15), boxY, boxWidth, boxHeight);
            
            // Box details
            this.ctx.fillStyle = '#000000';
            this.ctx.fillRect(startX + i * (boxWidth + 15) + 10, boxY + 5, 5, 5);
            this.ctx.fillRect(startX + i * (boxWidth + 15) + 25, boxY + 5, 5, 5);
        }
        
        // Draw left character (simple pixel art)
        this.drawCharacter(40, this.canvas.height - 80, '#ff9999', true);
        
        // Draw right character
        this.drawCharacter(this.canvas.width - 60, this.canvas.height - 80, '#9999ff', false);
        
        // Draw speech bubbles
        this.drawSpeechBubble(40, this.canvas.height - 120, "Hi there!", true);
        this.drawSpeechBubble(this.canvas.width - 60, this.canvas.height - 120, "Hello!", false);
    }
    
    private drawCharacter(x: number, y: number, color: string, isLeft: boolean) {
        // Head
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, 20, 20);
        
        // Eyes
        this.ctx.fillStyle = '#000000';
        const eyeOffset = isLeft ? 4 : 10;
        this.ctx.fillRect(x + eyeOffset, y + 5, 3, 3);
        this.ctx.fillRect(x + eyeOffset + 5, y + 5, 3, 3);
        
        // Body
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x - 5, y + 20, 30, 30);
        
        // Arms
        this.ctx.fillRect(x - 15, y + 25, 10, 5);
        this.ctx.fillRect(x + 30, y + 25, 10, 5);
        
        // Legs
        this.ctx.fillRect(x, y + 50, 8, 20);
        this.ctx.fillRect(x + 12, y + 50, 8, 20);
    }
    
    private drawSpeechBubble(x: number, y: number, text: string, isLeft: boolean) {
        const width = 80;
        const height = 40;
        const pointerHeight = 10;
        
        // Adjust position based on which side
        const bubbleX = isLeft ? x : x - width;
        
        // Bubble body
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.roundRect(bubbleX, y, width, height, 5);
        this.ctx.fill();
        this.ctx.strokeStyle = '#000000';
        this.ctx.stroke();
        
        // Bubble pointer
        this.ctx.beginPath();
        if (isLeft) {
            this.ctx.moveTo(bubbleX + 20, y + height);
            this.ctx.lineTo(bubbleX + 30, y + height);
            this.ctx.lineTo(bubbleX + 25, y + height + pointerHeight);
        } else {
            this.ctx.moveTo(bubbleX + width - 20, y + height);
            this.ctx.lineTo(bubbleX + width - 30, y + height);
            this.ctx.lineTo(bubbleX + width - 25, y + height + pointerHeight);
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        // Text
        this.ctx.fillStyle = '#000000';
        this.ctx.font = '8px "Press Start 2P", cursive';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(text, bubbleX + width / 2, y + 20);
    }
}

// Initialize the scene when the page loads
window.onload = () => {
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    const gameScene = new GameScene(canvas);
    gameScene.render();
};