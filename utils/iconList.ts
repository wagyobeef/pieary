/**
 * List of 30 most commonly used SF Symbols for tagging crumbs and areas.
 * These icons are also mapped in icon-symbol.tsx for cross-platform compatibility.
 */
export const iconList = [
  "heart.fill", // Love, relationships, favorites
  "star.fill", // Important, featured, rating
  "book.fill", // Reading, learning, education
  "figure.walk", // Exercise, walking, movement
  "fork.knife", // Food, dining, nutrition
  "moon.stars.fill", // Sleep, night, rest
  "brain.head.profile", // Mental health, mindfulness, thinking
  "checkmark.circle.fill", // Completed, success, done
  "exclamationmark.circle.fill", // Important, urgent, alert
  "questionmark.circle.fill", // Questions, uncertainty, help
  "house.fill", // Home, family, domestic
  "briefcase.fill", // Work, career, business
  "music.note", // Music, entertainment, audio
  "gamecontroller.fill", // Gaming, play, entertainment
  "cart.fill", // Shopping, purchases, errands
  "airplane", // Travel, vacation, trips
  "car.fill", // Transportation, commute, driving
  "gift.fill", // Gifts, celebrations, events
  "bell.fill", // Notifications, reminders, alerts
  "calendar", // Events, scheduling, dates
  "clock.fill", // Time, scheduling, duration
  "envelope.fill", // Messages, email, communication
  "phone.fill", // Calls, communication, contact
  "camera.fill", // Photos, memories, media
  "film.fill", // Movies, videos, entertainment
  "paintbrush.fill", // Art, creativity, design
  "leaf.fill", // Nature, environment, plants
  "drop.fill", // Water, hydration, weather
  "sun.max.fill", // Sunny, daytime, energy
  "sparkles", // Special, magic, celebration
] as const;

export type IconName = (typeof iconList)[number];
