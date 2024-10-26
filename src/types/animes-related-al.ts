export type AnimeRelatedResponseAL = {
    data: Data;
}

export type Data = {
    Media: Media;
}

export type Media = {
    title:     Title;
    id:        number;
    idMal:     number;
    relations?: Relations;
}

export type Relations = {
    nodes: Media[];
}

export type Title = {
    romaji:  string;
    english: null | string;
}
