import { useAniCoverContext } from "@/components/ani-cover/context";
import { SubtitleStyles, TitleStyles } from "../common";
import SearchAnimeSelect from "../game/Search";
import { CardAnimationPulseStyles } from "../chara-anime/game";
import { SearchAnime } from "../game/context";
import { RefreshOutlined } from "@mui/icons-material";
import ConfettiExplosion from "react-confetti";

export default function AniCoverGame() {
  return (
    <div className="flex flex-col gap-4 flex-1">
      <div>
        <TitleStyles>AniCover</TitleStyles>
        <SubtitleStyles>Adivina el anime a partir de su portada</SubtitleStyles>
      </div>
      <GameBar />
      <Game />
    </div>
  );
}

function GameBar() {
  const { restartGame, selectedAnimes, status } = useAniCoverContext();

  return (
    <div className="flex gap-4 justify-between items-center">
      <span className="text-green-300">Intentos: {selectedAnimes.length}</span>
      <button
        className="bg-sky-800 p-2 text-white rounded-md hover:scale-105 transition-transform focus:outline-none"
        onClick={() => {
          restartGame();
        }}
      >
        <RefreshOutlined />
      </button>
      {
        status === "win" && <ConfettiExplosion
        style={{
          zIndex: 1000,
          width: "90vw",
          height: "100vh",
          marginInline: "auto",
        }}
      />
      }
    </div>
  );
}

function Game() {
  const { answer, selectedAnimes, status, addAnime } = useAniCoverContext();

  const blur = status === "win" ? 0 : 10 - selectedAnimes.length;
  const grayscale = status === "win" ? 0 : (10 - selectedAnimes.length) * 10;
  return (
    <div className="flex gap-6 flex-col-reverse md:flex-row">
       <div className="flex-col gap-2 flex md:hidden">
        {selectedAnimes.map((selectedAnime) => (
          <SelectedAnime key={selectedAnime.id} anime={selectedAnime} />
        ))}
      </div>
      <div className="flex justify-center">
        <div
          className={`w-fit h-fit overflow-hidden rounded-md outline outline-2 outline-sky-600 ${
            status === "win" ? "outline-green-600" : "outline-red-600"
          }`}
        >
          <img
            src={answer?.image_large}
            alt={"image"}
            height={500}
            width={400}
            className="select-none touch-none pointer-events-none"
            style={{
              filter: `blur(${blur}px) grayscale(${grayscale}%)`,

            }}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 flex-1">
        <SearchAnimeSelect
          onSelect={(anime) => {
            addAnime(anime);
          }}
          disabled={status !== "playing"}
          hideImage
          excludeAnimes={selectedAnimes.map((anime) => anime.id)}
        />
        <div className="flex-col gap-2 hidden md:flex">
          {selectedAnimes.map((selectedAnime) => (
            <SelectedAnime key={selectedAnime.id} anime={selectedAnime} />
          ))}
        </div>
      </div>
     
    </div>
  );
}

function SelectedAnime(props: { anime: SearchAnime }) {
  const { answer, relatedAnimes } = useAniCoverContext();
  const { anime } = props;
  const isCorrect = answer?.id === anime.id;
  const isRelated = relatedAnimes.some(
    (relatedAnime) => relatedAnime.id === anime.id
  );

  return (
    <CardAnimationPulseStyles>
      <div
        className={`flex gap-2 p-2 rounded-md ${
          isCorrect
            ? "bg-green-700"
            : isRelated
            ? "bg-yellow-700"
            : "bg-red-600"
        }`}
      >
        <div>
          <img src={anime.image} alt={anime.name} height={60} width={40} />
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <span> {anime.name}</span>
          <div className="text-sm leading-4 flex flex-col gap-1">
            {anime.englishName}
          </div>
        </div>
      </div>
    </CardAnimationPulseStyles>
  );
}
