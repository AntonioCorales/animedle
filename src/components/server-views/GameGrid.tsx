export default function GameGrid(props: GridProps) {
  return (
    <table className="grid grid-cols-2 gap-2">
      contenido
    </table>
  );
}

function GameGridItem() {
  return (
    <div className="flex flex-col gap-1">
      <div className="w-full rounded-md border-2 bg-slate-900 text-white outline-none py-2 px-4">
        contenido
      </div>
    </div>
  );
}

type GridProps = React.PropsWithChildren;