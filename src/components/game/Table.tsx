import { SearchAnime, useGameContext } from "./context";
import {
  DetailedHTMLProps,
  HTMLAttributes,
  TdHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  useCompareEpisodes,
  useCompareFormat,
  useCompareGenres,
  useCompareStudio,
  useCompareTags,
  useCompareYearAndSeason,
} from "./functions";
import { ArrowUpward } from "@mui/icons-material";
import ReactCardFlip from "react-card-flip";
import { NodesStudio } from "@/types/anime";

export default function Table() {
  const { selectedAnimes } = useGameContext();

  return (
    <div className="max-w-screen-sm sm:max-w-screen-lg overflow-auto pb-4">
      <table className="table-auto w-full border-separate border-spacing-2 border-spacing-y-4 ">
        <thead>
          <tr className="border-b-2 border-slate-800">
            <th className="text-center min-w-[150px]">Nombre</th>
            <th className="text-center">Géneros</th>
            <th className="text-center">Etiquetas</th>
            <th className="text-center">Capítulos</th>
            <th className="text-center">Año y Temporada</th>
            <th className="text-center">Estudio</th>
            <th className="text-center">Formato</th>
          </tr>
        </thead>
        <tbody>
          {selectedAnimes.map((anime) => (
            <TableItem key={anime.id} anime={anime} />
          ))}
        </tbody>
      </table>
      {selectedAnimes.length === 0 && (
        <div className="text-center text-sky-500 w-full">
          No hay anime seleccionados
        </div>
      )}
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

  const delayStep = 300;

  return (
    <tr {...rest}>
      <td className="text-left w-[140px] flex justify-center ">
        <div className="gap-2 font-bold text-center w-fit text-xs flex flex-col">
          <img
            src={anime.image}
            className="rounded-md m-auto"
            alt={anime.name}
            width={117}
            height={160}
          />
          {anime.name}
        </div>
      </td>

      <GenresStyles genres={anime.genres} delay={delayStep * 0} />
      <TagsStyles tags={anime.tags} delay={delayStep * 1} />
      <EpisodesStyles episodes={anime.episodes} delay={delayStep * 2} />
      <YearStyles
        year={anime.seasonYear}
        season={anime.season}
        delay={delayStep * 3}
      />
      <StudioStyles studios={anime.studios} delay={delayStep * 4} />
      <FormatStyles format={anime.format} delay={delayStep * 5} />
    </tr>
  );
}

function GenresStyles(props: { genres: string[] } & { delay?: number }) {
  const { genres, delay } = props;
  const { response, responseColor } = useCompareGenres(genres);

  const genresIntl = new Intl.ListFormat().format(genres);
  return (
    <CardStyles className={responseColor} delay={delay}>
      {genresIntl}
    </CardStyles>
  );
}

function TagsStyles(props: { tags: string[] } & { delay?: number }) {
  const { tags, delay } = props;
  const { response, responseColor } = useCompareTags(tags);

  const tagsIntl = new Intl.ListFormat().format(tags);
  return (
    <CardStyles className={responseColor} delay={delay}>
      {tagsIntl}
    </CardStyles>
  );
}

function YearStyles(
  props: { year: number; season: string } & { delay?: number }
) {
  const { year, delay, season } = props;
  const { response, responseColor, position } = useCompareYearAndSeason(
    year,
    season
  );

  return (
    <CardStyles className={responseColor + " flex flex-col"} delay={delay}>
      <div className="flex gap-1">
        {year}
        {position === "up" && <ArrowUpward />}
        {position === "down" && <ArrowUpward className="rotate-180" />}
      </div>
      <div className="uppercase">{season}</div>
    </CardStyles>
  );
}

function EpisodesStyles(props: { episodes: number } & { delay?: number }) {
  const { episodes, delay } = props;
  const { response, responseColor, position } = useCompareEpisodes(episodes);

  return (
    <CardStyles className={responseColor} delay={delay}>
      {episodes}
      {position === "up" && <ArrowUpward />}
      {position === "down" && <ArrowUpward className="rotate-180" />}
    </CardStyles>
  );
}

function CardStyles(
  props: DetailedHTMLProps<
    TdHTMLAttributes<HTMLTableCellElement>,
    HTMLTableCellElement
  > & { delay?: number }
) {
  const ref = useRef<HTMLTableCellElement>(null);
  const [flipped, setFlipped] = useState(false);
  const [height, setHeight] = useState(0);
  useEffect(() => {
    setTimeout(() => {
      setFlipped(true);
    }, props.delay ?? 0);
  }, [props.delay]);

  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.clientHeight);
    }
  }, [ref]);

  return (
    <td {...props} className={" h-full min-w-[100px] rounded-md"} ref={ref}>
      <ReactCardFlip
        flipDirection="vertical"
        isFlipped={flipped}
        containerStyle={{
          display: "flex",
          width: "100%",
          height: height + "px",
        }}
      >
        <div
          className={"w-full h-full flex items-center justify-center p-2"}
        ></div>
        <div
          className={
            "w-full h-full flex items-center justify-center p-2 text-center rounded-md " +
            props.className
          }
        >
          {props.children}
        </div>
      </ReactCardFlip>
    </td>
  );
}

function FormatStyles(props: { format: string } & { delay?: number }) {
  const { format, delay } = props;
  const { response, responseColor } = useCompareFormat(format);

  return (
    <CardStyles className={responseColor} delay={delay}>
      {format}
    </CardStyles>
  );
}

function StudioStyles(props: { studios: NodesStudio[] } & { delay?: number }) {
  const { studios, delay } = props;
  const { response, responseColor } = useCompareStudio(studios.map((studio) => studio.id));

  return (
    <CardStyles className={responseColor} delay={delay}>
      {new Intl.ListFormat().format(studios.map((studio) => studio.name))}
    </CardStyles>
  );
}
