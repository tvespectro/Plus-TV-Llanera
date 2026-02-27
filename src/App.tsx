import React, { useEffect, useState } from "react";
import { movieApi } from "./services/movieService";
import { Movie } from "./types";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { MovieCard } from "./components/MovieCard";
import { BrowserRouter as Router, Routes, Route, useParams, useSearchParams } from "react-router-dom";
import { Star, Clock, Calendar, Play, Plus, Heart, MessageSquare, Tv, User } from "lucide-react";
import { motion } from "motion/react";
import videojs from "video.js";
import { VideoPlayer } from "./components/VideoPlayer";

import { recommendationService } from "./services/recommendationService";

const HomePage = () => {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [aiRecs, setAiRecs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const trendingData = await movieApi.getTrending();
      setTrending(trendingData.results);
      
      try {
        const recs = await recommendationService.getRecommendations(["Acción", "Ciencia Ficción"], ["Inception", "The Dark Knight"]);
        setAiRecs(recs);
      } catch (e) {
        console.error(e);
      }
      
      setLoading(false);
      // Hide welcome after some time if it's a splash, or just keep it as a header
      setTimeout(() => setShowWelcome(false), 4000);
    };
    fetchData();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#001529]">Cargando...</div>;

  return (
    <div className="pb-20">
      <motion.div 
        initial={{ opacity: 1 }}
        animate={{ opacity: showWelcome ? 1 : 0, height: showWelcome ? "100vh" : 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className={`fixed inset-0 z-[100] blue-gradient flex flex-col items-center justify-center overflow-hidden ${!showWelcome && 'pointer-events-none'}`}
      >
        <div className="text-center">
          <motion.h1 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-6xl md:text-8xl font-bold font-display tracking-tighter mb-4"
          >
            LLANERA <span className="text-emerald-400">TV+</span>
          </motion.h1>
          
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            className="flex flex-col items-center"
          >
            <div className="w-24 h-24 bg-emerald-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/40 rotate-12 hover:rotate-0 transition-transform duration-500">
              <Tv className="text-black w-12 h-12" />
            </div>
            <p className="mt-4 text-emerald-400 font-mono tracking-widest text-sm uppercase">Premium Streaming</p>
          </motion.div>
        </div>
      </motion.div>

      {trending[0] && <Hero movie={trending[0]} />}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        {aiRecs.length > 0 && (
          <section className="mb-12 glass-panel p-8 rounded-3xl border-emerald-500/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-500 rounded-lg">
                <Star className="w-5 h-5 text-black fill-current" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-display">Recomendaciones de IA</h2>
                <p className="text-xs text-white/50">Basado en tus gustos personales</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {aiRecs.map((rec, i) => (
                <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-emerald-500/30 transition-colors">
                  <h3 className="font-bold text-emerald-400 mb-1">{rec.title}</h3>
                  <p className="text-sm text-white/60 italic">"{rec.reason}"</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-display tracking-tight">Tendencias Semanales</h2>
            <button className="text-emerald-500 text-sm font-bold hover:underline">Ver Todo</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {trending.slice(1, 13).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

const MovieDetailsPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (id) {
      const mid = parseInt(id);
      Promise.all([
        movieApi.getDetails(mid),
        movieApi.getReviews(mid)
      ]).then(([details, reviewsData]) => {
        setMovie(details);
        setReviews(reviewsData);
        setLoading(false);
      });
    }
  }, [id]);

  const toggleWishlist = async () => {
    if (isWishlisted) {
      await movieApi.removeFromWishlist(1, movie.id);
    } else {
      await movieApi.addToWishlist(1, movie);
    }
    setIsWishlisted(!isWishlisted);
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Cargando...</div>;

  return (
    <div className="pt-16">
      <div className="relative h-[60vh] w-full">
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-64 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-64 flex-shrink-0 hidden md:block">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full rounded-2xl shadow-2xl border border-white/10"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1 text-emerald-400 font-bold">
                <Star className="w-5 h-5 fill-current" />
                <span>{movie.vote_average.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-1 text-white/60">
                <Clock className="w-4 h-4" />
                <span>{movie.runtime} min</span>
              </div>
              <div className="flex items-center gap-1 text-white/60">
                <Calendar className="w-4 h-4" />
                <span>{new Date(movie.release_date).getFullYear()}</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold font-display mb-4">{movie.title}</h1>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres.map((g: any) => (
                <span key={g.id} className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium">
                  {g.name}
                </span>
              ))}
            </div>

            <p className="text-lg text-white/70 mb-8 leading-relaxed max-w-3xl">
              {movie.overview}
            </p>

            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105">
                <Play className="w-5 h-5 fill-current" />
                Reproducir
              </button>
              <button 
                onClick={toggleWishlist}
                className={`p-3 rounded-full transition-all ${isWishlisted ? 'bg-emerald-500 text-black' : 'bg-white/10 hover:bg-white/20 text-white'}`}
              >
                {isWishlisted ? <Heart className="w-6 h-6 fill-current" /> : <Plus className="w-6 h-6" />}
              </button>
              <button className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all">
                <MessageSquare className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-20">
          <div className="lg:col-span-2">
            <section>
              <h2 className="text-2xl font-bold font-display mb-8">Reparto Principal</h2>
              <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                {movie.credits.cast.slice(0, 10).map((person: any) => (
                  <div key={person.id} className="flex-shrink-0 w-32 text-center">
                    <div className="aspect-square rounded-full overflow-hidden mb-3 border-2 border-white/5">
                      <img
                        src={person.profile_path ? `https://image.tmdb.org/t/p/w185${person.profile_path}` : 'https://via.placeholder.com/185x185?text=No+Photo'}
                        alt={person.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <p className="font-bold text-sm line-clamp-1">{person.name}</p>
                    <p className="text-xs text-white/50 line-clamp-1">{person.character}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-20">
              <h2 className="text-2xl font-bold font-display mb-8">Películas Similares</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {movie.recommendations.results.slice(0, 8).map((m: any) => (
                  <MovieCard key={m.id} movie={m} />
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <section className="glass-panel p-6 rounded-3xl">
              <h2 className="text-xl font-bold font-display mb-6">Reseñas de Usuarios</h2>
              <div className="space-y-6">
                {reviews.length > 0 ? reviews.map((review) => (
                  <div key={review.id} className="border-b border-white/5 pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px] font-bold text-emerald-500">
                          U{review.user_id}
                        </div>
                        <span className="text-xs font-bold">Usuario {review.user_id}</span>
                      </div>
                      <div className="flex items-center gap-1 text-emerald-400 text-[10px]">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{review.rating}/10</span>
                      </div>
                    </div>
                    <p className="text-sm text-white/60 italic">"{review.comment}"</p>
                  </div>
                )) : (
                  <div className="text-center py-8 text-white/30 text-sm">
                    Aún no hay reseñas. ¡Sé el primero en comentar!
                  </div>
                )}
                
                <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold transition-colors">
                  Escribir una reseña
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      setLoading(true);
      movieApi.search(query).then((data) => {
        setResults(data.results);
        setLoading(false);
      });
    }
  }, [query]);

  return (
    <div className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
      <h1 className="text-3xl font-bold font-display mb-8">
        Resultados para: <span className="text-emerald-500">"{query}"</span>
      </h1>
      
      {loading ? (
        <div>Buscando...</div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {results.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-white/50">No se encontraron resultados.</div>
      )}
    </div>
  );
};

const LiveTVPage = () => {
  const videoJsOptions = {
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
    liveui: true,
    sources: [{
      src: 'https://tvspectro.moxapps.shop/live/22OeaFNKyCOwDoFdVOOAwrPDJkx1/index.m3u8',
      type: 'application/x-mpegURL'
    }]
  };

  const handlePlayerReady = (player: any) => {
    player.on('waiting', () => {
      videojs.log('player is waiting');
    });

    player.on('dispose', () => {
      videojs.log('player will dispose');
    });
  };

  return (
    <div className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        <h1 className="text-3xl font-bold font-display">Canales En Vivo</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Main Channel with Player */}
        <div className="lg:col-span-2 glass-panel rounded-2xl overflow-hidden group">
          <div className="aspect-video bg-black relative">
            <VideoPlayer options={videoJsOptions} onReady={handlePlayerReady} />
            <div className="absolute top-4 left-4 px-2 py-1 bg-red-600 text-[10px] font-bold rounded uppercase pointer-events-none z-10">
              En Vivo
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-1">Llanera TV+</h3>
                <p className="text-sm text-white/50">Transmisión Oficial - Señal Principal</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-xs text-emerald-400 font-bold">
                  <User className="w-3 h-3" />
                  1.2k viendo
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Other Channels */}
        <div className="space-y-6">
          {[2, 3, 4].map((i) => (
            <div key={i} className="glass-panel rounded-2xl overflow-hidden group cursor-pointer flex gap-4 p-3">
              <div className="w-32 aspect-video bg-white/5 relative rounded-lg overflow-hidden flex-shrink-0">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="w-6 h-6 text-white/20 group-hover:text-emerald-500 transition-colors" />
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="font-bold text-sm">Llanera Sports {i}</h3>
                <p className="text-xs text-white/50">Próximamente</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white font-sans">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movie/:id" element={<MovieDetailsPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/live" element={<LiveTVPage />} />
            <Route path="/wishlist" element={<div className="pt-24 text-center">Próximamente: Tu Lista de Deseos</div>} />
          </Routes>
        </main>
        
        <footer className="border-t border-white/5 py-12 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-6 h-6 bg-emerald-500 rounded flex items-center justify-center">
                <Tv className="text-black w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tighter font-display uppercase">
                LLANERA <span className="text-emerald-500">TV+</span>
              </span>
            </div>
            <p className="text-white/40 text-sm mb-8">
              © 2026 Llanera TV+. Todos los derechos reservados.
            </p>
            <div className="flex justify-center gap-8 text-xs font-medium text-white/60">
              <a href="#" className="hover:text-white">Privacidad</a>
              <a href="#" className="hover:text-white">Términos</a>
              <a href="#" className="hover:text-white">Ayuda</a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
