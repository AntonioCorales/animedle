import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { SearchAnime } from "../game/context";
import { usePageContext } from "../context";
import { getRandomByArray } from "../utils/functions";
import { NodesStudio } from "@/types/anime";

export type NumberOperator = "lt" | "lte" | "gt" | "gte" | "eq" | "neq";
export type StringOperator = "contains" | "notContains";
export type SeasonOperator = "eq" | "neq";

type OptionType =
  | "year"
  | "genre"
  | "tag"
  | "format"
  | "chapters"
  | "season"
  | "studio";

const OPTION_TYPES: OptionType[] = [
  "year",
  "season",
  "genre",
  "tag",
  "format",
  "chapters",
];
const NUMBER_OPERATORS: NumberOperator[] = [
  "lt",
  "lte",
  "gt",
  "gte",
  "eq",
  "neq",
];
const STRING_OPERATORS: StringOperator[] = ["contains", "notContains"];

const SEASON_OPERATORS: SeasonOperator[] = ["eq", "neq"];

type AniQuizStatus =
  | "loading"
  | "init"
  | "stale"
  | "playing"
  | "win"
  | "end"
  | "win-round"
  | "error-round";

type AniQuizContext = {
  currentQuiz: number;
  totalQuiz: number;
  quizzes: Quiz[];
  nextQuiz: () => void;
  quiz?: Quiz | null;
  isLoading: boolean;
  status: AniQuizStatus;
  onSelectOption?: (option: SearchAnime, time: number) => void;
  selectedOption?: SearchAnime | null;
  thinkingTime: number;
  answeredTime: number;
  startGame: (total?: number) => void;
  restartGame: () => void;
  time?: number;
  points?: number;
  totalPoints: number;
};

export type Quiz = {
  question: string;
  answer: SearchAnime;
  options: SearchAnime[];
  selectedOption?: SearchAnime | null;
  type: OptionType;
  operator: NumberOperator | StringOperator | SeasonOperator;  
  time?: number;
  points?: number;
} & ({
  type: "genre" | "tag";
  value: string[];
} |{
  type: "studio";
  value: NodesStudio;
} | {
  type: "year" | "chapters";
  value: number;
} | {
  type: "season";
  value: string;
})

const AniQuizContext = createContext<AniQuizContext>({
  currentQuiz: 0,
  totalQuiz: 0,
  quizzes: [],
  nextQuiz: () => {},
  isLoading: true,
  status: "loading",
  thinkingTime: 0,
  answeredTime: 0,
  startGame: () => {},
  restartGame: () => {},
  points: 0,
  time: 0,
  totalPoints: 0,
});

export const AniQuizProvider = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const [currentQuiz, setCurrentQuiz] = useState(1);
  const [totalQuiz, setTotalQuiz] = useState(10);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [numOptions, setNumOptions] = useState(4);
  const [status, setStatus] = useState<AniQuizStatus>("init");
  const [selectedOption, setSelectedOption] = useState<SearchAnime | null>();
  const [time, setTime] = useState(0);
  const [points, setPoints] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);

  const { quiz, isLoading, redo } = useInitQuiz({
    quizNumber: currentQuiz,
    numOptions,
  });

  const nextQuiz = () => {
    if (!quiz) return;
    if (currentQuiz === totalQuiz) {
      setStatus("end");
      return;
    }
    setCurrentQuiz((prev) => prev + 1);
    setQuizzes((prev) => [...prev, { ...quiz, selectedOption, time, points }]);
    setStatus("playing");
    redo();
  };

  const onSelectOption = (option: SearchAnime, time: number) => {
    if (!quiz) return;
    if (status !== "playing") return;
    setSelectedOption(option);
    setTime(time);
    let points = 0;
    if (quiz.answer && quiz.answer.id === option.id) {
      points = time < 5 ? 100 : time < 10 ? 70 : time < 15 ? 50 : 10;
      setStatus("win-round");
    } else {
      setStatus("error-round");
    }
    setPoints(points);
    setTotalPoints((prev) => prev + points);
  };

  const restartGame = () => {
    setStatus("init");
    setQuizzes([]);
    setCurrentQuiz(1);
    setSelectedOption(null);
    setTotalPoints(0);
    setPoints(0);
    redo();
  };

  const startGame = (total: number = 10) => {
    setTotalQuiz(total);
    setStatus("playing");
  };

  return (
    <AniQuizContext.Provider
      value={{
        currentQuiz,
        totalQuiz,
        quizzes,
        nextQuiz,
        quiz,
        isLoading: isLoading || !quiz,
        status,
        onSelectOption,
        selectedOption,
        thinkingTime: 5,
        answeredTime: 15,
        startGame,
        restartGame,
        time,
        points,
        totalPoints,
      }}
    >
      {children}
    </AniQuizContext.Provider>
  );
};

function useInitQuiz(props: { quizNumber: number; numOptions: number }) {
  const { numOptions } = props;
  const { animes, isLoading } = usePageContext();
  const [quiz, setQuiz] = useState<Quiz>();

  const redo = useCallback(() => {
    if (isLoading || !animes) return;
    const options = ["season", "year", "chapters", "genre", "tag", "studio"]

    const option = getRandomByArray(options);

    if (option === "year") {
      const quiz = getQuizByYear(animes, numOptions);
      if (!quiz) return;
      setQuiz(quiz);
    } else if (option === "genre") {
      const quiz = getQuizByGenre(animes, numOptions);
      if (!quiz) return;
      setQuiz(quiz);
    } else if (option === "tag") {
      const quiz = getQuizByTag(animes, numOptions);
      if (!quiz) return;
      setQuiz(quiz);
    } else if (option === "studio") {
      const quiz = getQuizByStudio(animes, numOptions);
      if (!quiz) return;
      setQuiz(quiz);
    } else if (option === "chapters") {
      const quiz = getQuizByChapters(animes, numOptions);
      if (!quiz) return;
      setQuiz(quiz);
    } else if (option === "season") {
      const quiz = getQuizBySeason(animes, numOptions);
      if (!quiz) return;
      setQuiz(quiz);
    }
  }, [animes, isLoading, numOptions]);

  useEffect(() => {
    redo();
  }, [redo]);

  return {
    quiz,
    isLoading,
    redo,
  };
}

function getQuizByYear(
  animes: SearchAnime[],
  numOptions: number
): Quiz | undefined {
  let yearOperator = getRandomByArray(NUMBER_OPERATORS) ?? "eq";
  while (true) {
    const base = getRandomByArray(animes);

    if (!base) continue;
    const year = base.seasonYear;

    const animesCorrectYear: SearchAnime[] = [];
    const animesWrongYear: SearchAnime[] = [];

    animes.forEach((anime) => {
      if (yearOperator === "eq") {
        if (anime.seasonYear === year) {
          animesCorrectYear.push(anime);
        } else {
          animesWrongYear.push(anime);
        }
      } else if (yearOperator === "lt") {
        if (anime.seasonYear < year) {
          animesCorrectYear.push(anime);
        } else {
          animesWrongYear.push(anime);
        }
      } else if (yearOperator === "lte") {
        if (anime.seasonYear <= year) {
          animesCorrectYear.push(anime);
        } else {
          animesWrongYear.push(anime);
        }
      } else if (yearOperator === "gt") {
        if (anime.seasonYear > year) {
          animesCorrectYear.push(anime);
        } else {
          animesWrongYear.push(anime);
        }
      } else if (yearOperator === "gte") {
        if (anime.seasonYear >= year) {
          animesCorrectYear.push(anime);
        } else {
          animesWrongYear.push(anime);
        }
      }
    });

    if (animesWrongYear.length < numOptions - 1) {
      yearOperator = "eq";
      continue;
    }

    const bait = getRandomByArrayNumber(animesWrongYear, numOptions - 1);

    const answer = getRandomByArray(animesCorrectYear);

    if (!bait || !answer) continue;
    bait.push(answer);
    const options: SearchAnime[] = shuffleArray(bait);

    return {
      question: yearQuizString(year, yearOperator),
      answer,
      options,
      operator: yearOperator,
      type: "year",
      value: year,
    };
  }
}

function yearQuizString(year: number, operator: NumberOperator) {
  if (operator === "eq") {
    return `¿Cuál de estos animes se estrenó en el año ${year}?`;
  } else if (operator === "lt") {
    return `¿Cuál de estos animes se estrenó antes del año ${year}?`;
  } else if (operator === "lte") {
    return `¿Cuál de estos animes se estrenó antes o en el año ${year}?`;
  } else if (operator === "gt") {
    return `¿Cuál de estos animes se estrenó después del año ${year}?`;
  } else if (operator === "gte") {
    return `¿Cuál de estos animes se estrenó después o en el año ${year}?`;
  }
  return "";
}

function shuffleArray<T>(array: T[]) {
  if (array.length <= 0) return array;
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Intercambia los elementos
  }
  return array;
}

export function useAniQuizContext() {
  return useContext(AniQuizContext);
}

function getRandomByArrayNumber(animes: SearchAnime[], length: number = 1) {
  const addedAnimes: SearchAnime[] = [];
  if (length >= animes.length) return animes;

  while (addedAnimes.length < length) {
    const randomIndex = Math.floor(Math.random() * animes.length);
    const randomAnime = animes[randomIndex];
    if (!addedAnimes.map((anime) => anime.id).includes(randomAnime.id)) {
      addedAnimes.push(randomAnime);
    }
  }
  return addedAnimes;
}

function getQuizByGenre(
  animes: SearchAnime[],
  numOptions: number
): Quiz | undefined {
  let operator = getRandomByArray(STRING_OPERATORS) ?? "contains";
  while (true) {
    const base = getRandomByArray(animes);

    if (!base || !operator) continue;
    let num = Math.floor(Math.random() * 2) + 1;
    if (!num) continue;
    const genres = getRandomValueWithQuantity(base.genres, num);
    if (!genres) continue;
    num = genres.length;
    const correctAnimes: SearchAnime[] = [];
    const wrongAnimes: SearchAnime[] = [];

    animes.forEach((anime) => {
      if (operator === "contains") {
        if (genres.every((genre) => anime.genres.includes(genre))) {
          correctAnimes.push(anime);
        } else {
          wrongAnimes.push(anime);
        }
      } else if (operator === "notContains") {
        if (!genres.every((genre) => anime.genres.includes(genre))) {
          correctAnimes.push(anime);
        } else {
          wrongAnimes.push(anime);
        }
      }
    });

    if (wrongAnimes.length < numOptions - 1) {
      operator = "contains";
      continue;
    }

    const bait = getRandomByArrayNumber(wrongAnimes, numOptions - 1);
    const answer = getRandomByArray(correctAnimes);
    if (!bait || !answer) continue;
    bait.push(answer);
    const options: SearchAnime[] = shuffleArray(bait);

    return {
      question: genreQuizString(genres, operator, num),
      answer,
      options,
      operator,
      type: "genre",
      value: genres,
    };
  }
}

function genreQuizString(
  genres: string[],
  operator: StringOperator,
  num: number = 1
) {
  const genresIntl = new Intl.ListFormat().format(genres);
  if (num === 1) {
    if (operator === "contains") {
      return `¿Cuál de estos animes tiene el género "${genresIntl}"?`;
    } else if (operator === "notContains") {
      return `¿Cuál de estos animes no tiene el género "${genresIntl}"?`;
    }
    return "";
  } else {
    if (operator === "contains") {
      return `¿Cuál de estos animes tiene los géneros "${genresIntl}"?`;
    } else if (operator === "notContains") {
      return `¿Cuál de estos animes no tiene los géneros "${genresIntl}"?`;
    }
  }
  return "aad";
}

function getRandomValueWithQuantity<T>(values: T[], length: number = 1) {
  const addedValues: T[] = [];
  if (length >= values.length) return values;
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * values.length);
    const randomValue = values[randomIndex];
    if (!addedValues.map((value) => value).includes(randomValue)) {
      addedValues.push(randomValue);
    }
  }
  return addedValues;
}

function getQuizByTag(
  animes: SearchAnime[],
  numOptions: number
): Quiz | undefined {
  let operator = getRandomByArray(STRING_OPERATORS) ?? "contains";
  // let operator: StringOperator = "notContains";
  while (true) {
    const base = getRandomByArray(animes);

    if (!base) continue;
    // random 1 o 2
    let num = Math.floor(Math.random() * 2) + 1;

    if (!num) continue;
    const tags = getRandomValueWithQuantity(base.tags, num);
    if (!tags) continue;
    num = tags.length;
    const correctAnimes: SearchAnime[] = [];
    const wrongAnimes: SearchAnime[] = [];

    animes.forEach((anime) => {
      if (operator === "contains") {
        if (tags.every((tag) => anime.tags.includes(tag))) {
          correctAnimes.push(anime);
        } else {
          wrongAnimes.push(anime);
        }
      } else if (operator === "notContains") {
        if (!tags.every((tag) => anime.tags.includes(tag))) {
          correctAnimes.push(anime);
        } else {
          wrongAnimes.push(anime);
        }
      }
    });

    if (wrongAnimes.length < numOptions - 1) {
      operator = "contains";
      continue;
    }
    const bait = getRandomByArrayNumber(wrongAnimes, numOptions - 1);

    const answer = getRandomByArray(correctAnimes);
    if (!bait || !answer) continue;

    if (bait.length < numOptions - 1) {
      operator = "contains";
      continue;
    }

    bait.push(answer);
    const options: SearchAnime[] = shuffleArray(bait);

    if (options.length < numOptions) continue;

    return {
      question: tagQuizString(tags, operator, num),
      answer,
      options,
      operator,
      type: "tag",
      value: tags,
    };
  }
}

function tagQuizString(
  tags: string[],
  operator: StringOperator,
  num: number = 1
) {
  const tagsIntl = new Intl.ListFormat().format(tags);
  if (num === 1) {
    if (operator === "contains") {
      return `¿Cuál de estos animes tiene el tag "${tagsIntl}"?`;
    } else if (operator === "notContains") {
      return `¿Cuál de estos animes no tiene el tag "${tagsIntl}"?`;
    }
    return "";
  } else {
    if (operator === "contains") {
      return `¿Cuál de estos animes tiene los tags "${tagsIntl}"?`;
    } else if (operator === "notContains") {
      return `¿Cuál de estos animes no tiene los tags "${tagsIntl}"?`;
    }
  }
  return "";
}

function getQuizByStudio(
  animes: SearchAnime[],
  numOptions: number
): Quiz | undefined {
  let operator = getRandomByArray(STRING_OPERATORS) ?? "contains";
  // let operator: StringOperator = "notContains";
  while (true) {
    const base = getRandomByArray(animes);

    if (!base || !operator) continue;
    const studio = getRandomByArray(base.studios);
    if (!studio) continue;

    const correctAnimes: SearchAnime[] = [];
    const wrongAnimes: SearchAnime[] = [];

    animes.forEach((anime) => {
      if (operator === "contains") {
        if (anime.studios.some((st) => st.id === studio.id)) {
          correctAnimes.push(anime);
        } else {
          wrongAnimes.push(anime);
        }
      } else if (operator === "notContains") {
        if (anime.studios.length === 0) return;
        if (!anime.studios.every((st) => st.id === studio.id)) {
          correctAnimes.push(anime);
        } else {
          wrongAnimes.push(anime);
        }
      }
    });

    if (wrongAnimes.length < numOptions - 1) {
      operator = "contains";
      continue;
    }

    const bait = getRandomByArrayNumber(wrongAnimes, numOptions - 1);
    const answer = getRandomByArray(correctAnimes);

    if (!bait || !answer) continue;
    bait.push(answer);
    const options: SearchAnime[] = shuffleArray(bait);

    return {
      question: studioQuizString(studio, operator),
      answer,
      options,
      operator,
      type: "studio",
      value: studio,
    };
  }
}

function studioQuizString(studio: NodesStudio, operator: StringOperator) {
  if (operator === "contains") {
    return `¿Cuál de estos animes fue hecho por el studio "${studio.name}"?`;
  } else if (operator === "notContains") {
    return `¿Cuál de estos animes no fue hecho por el studio "${studio.name}"?`;
  }
  return " ";
}

function getQuizByChapters(
  animes: SearchAnime[],
  numOptions: number
): Quiz | undefined {
  let operator = getRandomByArray(NUMBER_OPERATORS) ?? "eq";
  while (true) {
    const base = getRandomByArray(animes);

    if (!base) continue;
    const chapters = base.episodes;

    const correctAnimes: SearchAnime[] = [];
    const wrongAnimes: SearchAnime[] = [];

    animes.forEach((anime) => {
      if (operator === "eq") {
        if (anime.episodes === chapters) {
          correctAnimes.push(anime);
        } else {
          wrongAnimes.push(anime);
        }
      } else if (operator === "lt") {
        if (anime.episodes < chapters) {
          correctAnimes.push(anime);
        } else {
          wrongAnimes.push(anime);
        }
      } else if (operator === "lte") {
        if (anime.episodes <= chapters) {
          correctAnimes.push(anime);
        } else {
          wrongAnimes.push(anime);
        }
      } else if (operator === "gt") {
        if (anime.episodes > chapters) {
          correctAnimes.push(anime);
        } else {
          wrongAnimes.push(anime);
        }
      } else if (operator === "gte") {
        if (anime.episodes >= chapters) {
          correctAnimes.push(anime);
        } else {
          wrongAnimes.push(anime);
        }
      } else if (operator === "neq") {
        if (anime.episodes !== chapters) {
          correctAnimes.push(anime);
        } else {
          wrongAnimes.push(anime);
        }
      }
    });

    if (wrongAnimes.length < numOptions - 1) {
      operator = "eq";
      continue;
    }

    const bait = getRandomByArrayNumber(wrongAnimes, numOptions - 1);
    const answer = getRandomByArray(correctAnimes);

    if (!answer) continue;

    bait.push(answer);
    const options: SearchAnime[] = shuffleArray(bait);

    if (options.length < numOptions) continue;

    return {
      question: chaptersQuizString(chapters, operator),
      answer,
      options,
      operator,
      type: "chapters",
      value: chapters,
    };
  }
}

function chaptersQuizString(chapters: number, operator: NumberOperator) {
  if (operator === "eq") {
    return `¿Cuál de estos animes tiene ${chapters} capítulos?`;
  } else if (operator === "lt") {
    return `¿Cuál de estos animes tiene menos de ${chapters} capítulos?`;
  } else if (operator === "lte") {
    return `¿Cuál de estos animes tiene igual o menos de ${chapters} capítulos?`;
  } else if (operator === "gt") {
    return `¿Cuál de estos animes tiene más de ${chapters} capítulos?`;
  } else if (operator === "gte") {
    return `¿Cuál de estos animes tiene igual o más de ${chapters} capítulos?`;
  } else if (operator === "neq") {
    return `¿Cuál de estos animes no tiene ${chapters} capítulos?`;
  }
  return "";
}

function getQuizBySeason(
  animes: SearchAnime[],
  numOptions: number
): Quiz | undefined {
  let triesAnimes: number[] = [];
  // let operator: SeasonOperator = getRandomByArray(SEASON_OPERATORS) ?? "eq";
  let operator: SeasonOperator = "neq";
  let tries = 0;
  while (tries < 10) {
    tries++;
    if (triesAnimes.length >= 20) {
      operator = "eq";
      triesAnimes = [];
      continue;
    }

    const base = getRandomByArray(animes);
    if (!base || triesAnimes.includes(base.id)) continue;
    triesAnimes.push(base.id);

    const correctAnimes: SearchAnime[] = [];
    const wrongAnimes: SearchAnime[] = [];

    animes.forEach((anime) => {
      if (anime.id === base.id) return;
      
      if (
        anime.season === base.season &&
        anime.seasonYear === base.seasonYear
      ) {
        if (operator === "eq") {
          correctAnimes.push(anime);
        } else {
          wrongAnimes.push(anime);
        }
      } else {
        if (operator === "eq") {
          wrongAnimes.push(anime);
        } else {
          correctAnimes.push(anime);
        }
      }
    });

    if (correctAnimes.length === 0 || wrongAnimes.length < numOptions - 1)
      continue;

    let answer: SearchAnime | null | undefined;

    let a = 0;
    while (!answer) {
      const customCorrectAnimes = correctAnimes.filter(
        (anime) => (anime.seasonYear + a === base.seasonYear ||
          anime.seasonYear - a === base.seasonYear ) &&
          anime.id !== base.id
      )

      if(customCorrectAnimes.length === 0 ) continue;

      answer = getRandomByArray(customCorrectAnimes);
      a++;
    }

    if (!answer) continue;

    const bait: SearchAnime[] = [];

    let i = 0;
    while (bait.length < numOptions - 1) {
      const customYearAnimes: SearchAnime[] = wrongAnimes.filter(
        (anime) =>
          (anime.seasonYear + i === base.seasonYear ||
          anime.seasonYear - i === base.seasonYear ) &&
          anime.id !== base.id && answer.id !== base.id
      );

      if (customYearAnimes.length === 0) continue;

      const shuffleCustomYearAnimes = shuffleArray(customYearAnimes);      

      bait.push(
        ...shuffleCustomYearAnimes.slice(0, numOptions - 1 - bait.length)
      );
      i++;
    }
    bait.push(answer)
    const options = shuffleArray(bait)

    return {
      answer,
      operator: "eq",
      options,
      type: "season",
      question: seasonQuizString(base.name, base.season + "-" + base.seasonYear, operator),
      value: base.season + "-" + base.seasonYear,
    };
  }
}

function seasonQuizString(animeName: string, seasonString: string, operator: SeasonOperator): string {
  if (operator === "eq") {
    return `¿Cuál de estos animes salio en la misma temporada que "${animeName}" (${seasonString})?`;
  } else {
    return `¿Cuál de estos animes salió en una temporada diferente a "${animeName}" (${seasonString})?`;
  }
}
