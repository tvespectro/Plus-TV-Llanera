import React from "react";
import { Link } from "react-router-dom";
import { Star, Play } from "lucide-react";
import { Movie } from "../types";

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <Link 
      to={`/movie/${movie.id}`}
      className="group relative aspect-[2/3] rounded-xl overflow-hidden bg-white/5 movie-card-hover"
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
        referrerPolicy="no-referrer"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-bold text-sm line-clamp-2 mb-1">{movie.title}</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-emerald-400">
              <Star className="w-3 h-3 fill-current" />
              <span>{movie.vote_average.toFixed(1)}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/40">
              <Play className="w-4 h-4 text-black fill-current" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
