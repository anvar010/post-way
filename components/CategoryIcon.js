export default function CategoryIcon({ category, size = 18 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size}>
      <path d={category.path} fill="currentColor" />
    </svg>
  );
}
