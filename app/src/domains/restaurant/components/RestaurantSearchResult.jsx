export default function RestaurantSearchResult({ restaurant, onSelect }) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(restaurant)}
        className="w-full text-left px-4 py-3 hover:bg-[var(--bg)] transition-colors"
      >
        <p className="text-sm font-medium">{restaurant.name}</p>
        <p className="text-xs" style={{ color: 'var(--sub)' }}>
          {restaurant.category} · {restaurant.address}
        </p>
      </button>
    </li>
  )
}
