export default function InputSearch(props: InputSearchProps) {
  return (
    <label className="flex flex-col gap-1 flex-1">
      <span className="">Ingrese el nombre del anime</span>

      <input
        type="text"
        {...props}
        className={
          "w-full rounded-md outline outline-1 bg-slate-900 text-white py-2 px-4 focus:outline-2 focus:outline-white" +
          (props.className ? ` ${props.className}` : "")
        }
      />
    </label>
  );
}

export type InputSearchProps = React.InputHTMLAttributes<HTMLInputElement>;
