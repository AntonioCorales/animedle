
export default function InputSearch(props: InputSearchProps) {
  
  return (
    <label className="flex flex-col gap-1 flex-1">
      <span className="">Ingrese el nombre del anime</span>

      <input
        type="text"
        {...props}
        className="w-full rounded-md border-2 bg-slate-900 text-white outline-none py-2 px-4"
      />
    </label>
  );
}

export type InputSearchProps = React.InputHTMLAttributes<HTMLInputElement>;