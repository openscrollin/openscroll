// components/ui/Button.jsx
export const Button = ({ children, variant = 'neon', ...props }) => {
  const base = 'px-6 py-3 font-semibold rounded-full transition-transform';
  const neon = 'bg-neon-green text-black shadow hover:scale-105';
  const secondary = 'bg-white text-black border';

  return (
    <button
      {...props}
      className={`${base} ${variant === 'neon' ? neon : secondary}`}
    >
      {children}
    </button>
  );
};
