import { Movie, MovieDetails, Review, WishlistItem } from "../types";

export const movieApi = {
  getTrending: async (): Promise<{ results: Movie[] }> => {
    const res = await fetch("/api/movies/trending");
    return res.json();
  },
  search: async (query: string): Promise<{ results: Movie[] }> => {
    const res = await fetch(`/api/movies/search?query=${encodeURIComponent(query)}`);
    return res.json();
  },
  getDetails: async (id: number): Promise<MovieDetails> => {
    const res = await fetch(`/api/movies/${id}`);
    return res.json();
  },
  getWishlist: async (userId: number): Promise<WishlistItem[]> => {
    const res = await fetch(`/api/wishlist/${userId}`);
    return res.json();
  },
  addToWishlist: async (userId: number, movie: Movie) => {
    const res = await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        movieId: movie.id,
        title: movie.title,
        posterPath: movie.poster_path,
      }),
    });
    return res.json();
  },
  removeFromWishlist: async (userId: number, movieId: number) => {
    const res = await fetch(`/api/wishlist/${userId}/${movieId}`, {
      method: "DELETE",
    });
    return res.json();
  },
  getReviews: async (movieId: number): Promise<Review[]> => {
    const res = await fetch(`/api/reviews/${movieId}`);
    return res.json();
  },
  addReview: async (userId: number, movieId: number, rating: number, comment: string) => {
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, movieId, rating, comment }),
    });
    return res.json();
  },
};
