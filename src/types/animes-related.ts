export type AnimeRelationResponse = {
    data: AnimeRelations[];
  }

export type AnimeRelations = {
    relation: string;
    entry:    AnimeRelationData[];
  }
  
  export type AnimeRelationData = {
    mal_id: number;
    type:  string;
    name:  string;
    url:   string;
  }
  