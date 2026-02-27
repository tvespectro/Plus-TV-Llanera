import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Tv, Film, Heart, User, Menu } from "lucide-react";

export const Navbar = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Tv className="text-black w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tighter font-display">
                LLANERA <span className="text-emerald-500">TV+</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-white/70">
              <Link to="/" className="hover:text-white transition-colors">Inicio</Link>
              <Link to="/movies" className="hover:text-white transition-colors">Películas</Link>
              <Link to="/series" className="hover:text-white transition-colors">Series</Link>
              <Link to="/live" className="hover:text-white transition-colors flex items-center gap-1">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                En Vivo
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <form onSubmit={handleSearch} className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Buscar películas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/10 border border-white/10 rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 w-64 transition-all"
              />
            </form>
            
            <Link to="/wishlist" className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <Heart className="w-5 h-5 text-white/70" />
            </Link>
            
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors md:hidden">
              <Menu className="w-5 h-5" />
            </button>
            
            <button className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <User className="w-4 h-4 text-emerald-500" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
