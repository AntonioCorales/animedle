export default function ButtonGameMode(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    isSelected?: boolean;
  }
) {
  const { isSelected, ...rest } = props;
  return (
    <button
      {...rest}
      className={
        ` text-white px-8 py-2 rounded-md transition-all focus:outline-none outline-none border-2 hover:bg-sky-700 ` +
        (isSelected ? "border-sky-500 bg-sky-700 " : " bg-sky-800") +
        props.className
      }
    >
      {props.children}
    </button>
  );
}
