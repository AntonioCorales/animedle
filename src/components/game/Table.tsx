import Image from "next/image";
import { SearchAnime, useGameContext } from "./context";
import { DetailedHTMLProps, HTMLAttributes, TdHTMLAttributes } from "react";
import {
  useCompareEpisodes,
  useCompareFormat,
  useCompareGenres,
  useCompareSeason,
  useCompareTags,
  useCompareYear,
} from "./functions";
import { ArrowUpward } from "@mui/icons-material";

export default function Table() {
  const { selectedAnimes } = useGameContext();

  return (
    <div className="max-w-screen-sm sm:max-w-screen-lg overflow-auto">
      <table className="table-auto w-full border-separate border-spacing-2 border-spacing-y-4 ">
        <thead>
          <tr className="border-b-2 border-slate-800">
            <th className="text-left min-w-[150px]">Nombre</th>
            <th className="text-left">Géneros</th>
            <th className="text-left">Etiquetas</th>
            <th className="text-left">Capítulos</th>
            <th className="text-left">Año</th>
            <th className="text-left">Temporada</th>
            <th className="text-left">Formato</th>
          </tr>
        </thead>
        <tbody>
          {selectedAnimes.map((anime) => (
            <TableItem key={anime.id} anime={anime} />
          ))}
          {selectedAnimes.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center text-sky-500">
                No hay anime seleccionados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function TableItem(
  props: { anime: SearchAnime } & DetailedHTMLProps<
    HTMLAttributes<HTMLTableRowElement>,
    HTMLTableRowElement
  >
) {
  const { anime, ...rest } = props;

  return (
    <tr {...rest}>
      <td className="text-left w-[100px]">
        <div className="gap-2 font-bold text-center w-fit text-xs flex flex-col">
          <Image
            src={anime.image}
            className="rounded-md m-auto"
            alt={anime.name}
            width={117}
            height={160}
          />
          {anime.name}
        </div>
      </td>

      <GenresStyles genres={anime.genres} />
      <TagsStyles tags={anime.tags} />
      <EpisodesStyles episodes={anime.episodes} />
      <YearStyles year={anime.seasonYear} />
      <SeasonStyles season={anime.season} />
      <FormatStyles format={anime.format} />
    </tr>
  );
}

function GenresStyles(props: { genres: string[] }) {
  const { genres } = props;
  const { response, responseColor } = useCompareGenres(genres);

  const genresIntl = new Intl.ListFormat().format(genres);
  return <CardStyles className={responseColor}>{genresIntl}</CardStyles>;
}

function TagsStyles(props: { tags: string[] }) {
  const { tags } = props;
  const { response, responseColor } = useCompareTags(tags);

  const tagsIntl = new Intl.ListFormat().format(tags);
  return <CardStyles className={responseColor}>{tagsIntl}</CardStyles>;
}

function YearStyles(props: { year: number }) {
  const { year } = props;
  const { response, responseColor, position } = useCompareYear(year);

  return (
    <CardStyles className={responseColor}>
      {year}
      {position === "up" && <ArrowUpward />}
      {position === "down" && <ArrowUpward className="rotate-180" />}
    </CardStyles>
  );
}

function EpisodesStyles(props: { episodes: number }) {
  const { episodes } = props;
  const { response, responseColor, position } = useCompareEpisodes(episodes);

  return (
    <CardStyles className={responseColor}>
      {episodes}
      {position === "up" && <ArrowUpward />}
      {position === "down" && <ArrowUpward className="rotate-180" />}
    </CardStyles>
  );
}

function CardStyles(
  props: DetailedHTMLProps<
    TdHTMLAttributes<HTMLTableDataCellElement>,
    HTMLTableDataCellElement
  >
) {
  return (
    <td
      {...props}
      className={
        "p-2 h-full min-w-[100px] text-center rounded-md " + props.className
      }
    >
      {props.children}
    </td>
  );
}

function FormatStyles(props: { format: string }) {
  const { format } = props;
  const { response, responseColor } = useCompareFormat(format);

  return <CardStyles className={responseColor}>{format}</CardStyles>;
}

function SeasonStyles(props: { season: string }) {
  const { season } = props;
  const { response, responseColor } = useCompareSeason(season);

  return <CardStyles className={responseColor}>{season}</CardStyles>;
}
