/**
 * TRACE AI DESIGN TOKENS
 * Centralized source of truth for the application's aesthetic.
 */

export const tokens = {
  colors: {
    // Deep Space/Obsidian Palette
    background: "#030508",
    backgroundSecondary: "#0A0F17",
    
    // Core Brand Colors
    primary: "#00F0FF", // Cyber Cyan
    primaryGlowing: "rgba(0, 240, 255, 0.4)",
    secondary: "#8A2BE2", // Electric Violet
    accent: "#FF007A", // Neon Pink
    
    // Text
    textPrimary: "#FFFFFF",
    textSecondary: "#8899A6",
    textMuted: "#4B5563",
    
    // Glassmorphism & UI Elements
    cardBackground: "rgba(15, 23, 42, 0.6)",
    cardBorder: "rgba(255, 255, 255, 0.08)",
    cardHoverBorder: "rgba(0, 240, 255, 0.3)",
    
    // Status
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
  },
  
  animations: {
    transitionFast: "0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    transitionNormal: "0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    glowPulse: "glowPulse 3s infinite ease-in-out",
  },
  
  shadows: {
    glow: "0 0 20px rgba(0, 240, 255, 0.2)",
    glass: "0 8px 32px 0 rgba(0, 0, 0, 0.8)",
  },
  
  blur: {
    standard: "12px",
    heavy: "40px",
  }
};
