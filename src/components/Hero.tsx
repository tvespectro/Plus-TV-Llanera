import React from "react";
import { Play, Info, Plus } from "lucide-react";
import { Movie } from "../types";
import { Link } from "react-router-dom";

interface HeroProps {
  movie: Movie;
}

export const Hero: React.FC<HeroProps> = ({ movie }) => {
  return (
    <div className="relative h-[85vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2 py-0.5 bg-emerald-500 text-black text-[10px] font-bold rounded uppercase tracking-wider">
              Destacado
            </span>
            <span className="text-white/60 text-sm font-medium">
              {new Date(movie.release_date).getFullYear()}
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold font-display mb-6 leading-tight">
            {movie.title}
          </h1>
          
          <p className="text-lg text-white/70 mb-8 line-clamp-3 leading-relaxed">
            {movie.overview}
          </p>
          
          <div className="flex flex-wrap items-center gap-4">
            <Link 
              to={`/movie/${movie.id}`}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105"
            >
              <Play className="w-5 h-5 fill-current" />
              Ver Ahora
            </Link>
            
            <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-3 rounded-full font-bold transition-all">
              <Plus className="w-5 h-5" />
              Mi Lista
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
