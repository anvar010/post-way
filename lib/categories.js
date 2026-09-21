export const CATEGORIES = [
  {
    id: "general",
    label: "General",
    color: "#8E1F2B",
    soft: "#F5DFE1",
    path: "M12 2c-3.9 0-7 3.1-7 7 0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z",
  },
  {
    id: "home",
    label: "Home",
    color: "#3B6E8F",
    soft: "#DDEAF1",
    path: "M12 3 3 10.5V21h6v-6h6v6h6V10.5L12 3z",
  },
  {
    id: "work",
    label: "Work",
    color: "#6B4E8E",
    soft: "#E8E0EF",
    path: "M9 4h6a1 1 0 0 1 1 1v2h4a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h4V5a1 1 0 0 1 1-1zm1 3h4V6h-4v1zM4 13h16v-4H4v4z",
  },
  {
    id: "parking",
    label: "Parking",
    color: "#4A5A6B",
    soft: "#E2E6EA",
    path: "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.6 13.4H8.5V7.2h3.9c2 0 3.3 1.2 3.3 3s-1.3 3-3.3 3h-1.9v2.2zm0-4.1h1.7c.9 0 1.5-.5 1.5-1.3s-.6-1.3-1.5-1.3h-1.7v2.6z",
  },
  {
    id: "food",
    label: "Food & Drink",
    color: "#6E7F3D",
    soft: "#E9EEDA",
    path: "M7 2v8a2 2 0 0 0 2 2v10h2V12a2 2 0 0 0 2-2V2h-2v7h-1V2H8v7H7V2H5v8a2 2 0 0 0 2 2m10-2v9c-1.1 0-2-.9-2-2V2c0-.6.4-1 1-1s1 .4 1 1v7a1 1 0 0 0 1-1V2c0-.6.4-1 1-1s1 .4 1 1v20h-2v-8",
  },
  {
    id: "favorite",
    label: "Favorite",
    color: "#C48A22",
    soft: "#FBEFD5",
    path: "M12 3.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.8l6.1-.7L12 3.5z",
  },
];

export function getCategory(id) {
  return CATEGORIES.find((c) => c.id === id) || CATEGORIES[0];
}
