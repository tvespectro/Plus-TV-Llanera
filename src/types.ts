export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

export interface MovieDetails extends Movie {
  runtime: number;
  genres: { id: number; name: string }[];
  videos: {
    results: {
      key: string;
      site: string;
      type: string;
    }[];
  };
  credits: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string;
    }[];
  };
  recommendations: {
    results: Movie[];
  };
}

export interface Review {
  id: number;
  user_id: number;
  movie_id: number;
  rating: number;
  comment: string;
  created_at: string;
}

export interface WishlistItem {
  id: number;
  user_id: number;
  movie_id: number;
  title: string;
  poster_path: string;
}
