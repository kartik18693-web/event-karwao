import { useState, useMemo } from 'react';
import {
  Search, SlidersHorizontal, Sparkles, TrendingUp, CalendarDays, MapPin,
  Calendar, Ticket, LayoutGrid, Plus, Menu, X, Users, CalendarClock,
  Video, Monitor, Twitter, Instagram, Linkedin,
} from 'lucide-react';

// ---- Mock data (stands in for the Supabase `events` table) ----
const MOCK_EVENTS = [
  {
    id: '1', title: 'Sunset Music Festival', description: 'An open-air celebration of indie and electronic artists as the sun goes down over the city skyline.',
    category: 'Music', date: '2026-10-18T18:00:00', location: 'Riverside Park, Austin', venue_type: 'venue',
    price: 45, capacity: 500, image_url: 'https://picsum.photos/seed/eventkarwao-music/800/600', organizer: 'Wave Collective',
  },
  {
    id: '2', title: 'Future of AI Summit', description: 'Industry leaders discuss the next wave of applied AI, from agents to robotics, in a full day of talks and demos.',
    category: 'Tech', date: '2026-09-25T09:00:00', location: 'Online', venue_type: 'online',
    price: 0, capacity: 2000, image_url: 'https://picsum.photos/seed/eventkarwao-tech/800/600', organizer: 'TechForward',
  },
  {
    id: '3', title: 'Street Food Night Market', description: 'Forty local vendors, live music, and craft beer under the string lights downtown.',
    category: 'Food', date: '2026-09-12T17:00:00', location: 'Downtown Market Square', venue_type: 'venue',
    price: 10, capacity: 800, image_url: 'https://picsum.photos/seed/eventkarwao-food/800/600', organizer: 'City Eats Co.',
  },
  {
    id: '4', title: 'City Marathon 2026', description: 'A scenic 26.2-mile route through the historic downtown and waterfront districts.',
    category: 'Sports', date: '2026-11-02T07:00:00', location: 'City Center Start Line', venue_type: 'venue',
    price: 60, capacity: 5000, image_url: 'https://picsum.photos/seed/eventkarwao-sports/800/600', organizer: 'RunClub HQ',
  },
  {
    id: '5', title: 'Modern Art Open Studio', description: 'Meet the artists, watch live painting demos, and browse an eclectic mix of contemporary work.',
    category: 'Art', date: '2026-09-20T11:00:00', location: 'Gallery District', venue_type: 'venue',
    price: 0, capacity: 150, image_url: 'https://picsum.photos/seed/eventkarwao-art/800/600', organizer: 'Studio Collective',
  },
  {
    id: '6', title: 'Startup Pitch Night', description: 'Ten early-stage founders pitch to a panel of investors, followed by a networking mixer.',
    category: 'Business', date: '2026-09-30T18:30:00', location: 'Innovation Hub, Floor 12', venue_type: 'hybrid',
    price: 15, capacity: 300, image_url: 'https://picsum.photos/seed/eventkarwao-business/800/600', organizer: 'Founders Network',
  },
];

// ---- lib/utils.ts ported ----
function formatDate(dateStr) {
  const d = new Date(dateStr);
  const day = d.toLocaleDateString('en-US', { day: '2-digit' });
  const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return { day, month, time };
}
function formatPrice(price) {
  return price === 0 ? 'Free' : `$${price.toFixed(0)}`;
}
function categoryColor(category) {
  const map = {
    Music: 'bg-rose-500/10 text-rose-300 ring-rose-500/30',
    Tech: 'bg-blue-500/10 text-blue-300 ring-blue-500/30',
    Food: 'bg-amber-500/10 text-amber-300 ring-amber-500/30',
    Sports: 'bg-emerald-500/10 text-emerald-300 ring-emerald-500/30',
    Art: 'bg-fuchsia-500/10 text-fuchsia-300 ring-fuchsia-500/30',
    Business: 'bg-cyan-500/10 text-cyan-300 ring-cyan-500/30',
    default: 'bg-gray-500/10 text-gray-300 ring-gray-500/30',
  };
  return map[category] ?? map.default;
}

const CATEGORIES = ['All', 'Music', 'Tech', 'Food', 'Sports', 'Art', 'Business'];

function Navbar({ view, onNavigate }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = [
    { id: 'discover', label: 'Discover', icon: LayoutGrid },
    { id: 'dashboard', label: 'My Events', icon: Ticket },
    { id: 'create', label: 'Create Event', icon: Plus },
  ];
  const handleNav = (v) => { onNavigate(v); setMobileOpen(false); };

  return (
    <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-white/10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => handleNav('discover')} className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">Event Karwao</span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = view === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    active ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handleNav('create')}
            className="hidden md:flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-orange-500 hover:shadow-lg hover:shadow-rose-500/30 transition-all hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            Host an Event
          </button>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg text-gray-400 hover:bg-white/5">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = view === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    active ? 'bg-white text-gray-900' : 'text-gray-400 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        )}
      </nav>
    </header>
  );
}

function EventCard({ event, onClick }) {
  const date = formatDate(event.date);
  const rsvpCount = 0;
  const VenueIcon = event.venue_type === 'online' ? Video : event.venue_type === 'hybrid' ? Monitor : MapPin;

  return (
    <article
      onClick={onClick}
      className="group cursor-pointer bg-gray-900 rounded-2xl overflow-hidden border border-white/10 shadow-sm hover:shadow-xl hover:shadow-black/40 hover:-translate-y-1 hover:border-white/20 transition-all duration-300"
    >
      <div className="relative h-52 overflow-hidden">
        {event.image_url ? (
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
          />
        ) : null}
        <div
          className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-700 items-center justify-center text-gray-500 text-sm"
          style={{ display: event.image_url ? 'none' : 'flex', position: event.image_url ? 'absolute' : 'static', inset: 0 }}
        >
          No image
        </div>
        <div className="absolute top-3 left-3 flex flex-col items-center bg-gray-950/90 backdrop-blur rounded-xl shadow-md px-3 py-2 min-w-[3.5rem] ring-1 ring-white/10">
          <span className="text-[10px] font-bold tracking-wider text-rose-400">{date.month}</span>
          <span className="text-xl font-bold text-white leading-none">{date.day}</span>
        </div>
        <div className="absolute top-3 right-3">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ring-1 backdrop-blur ${categoryColor(event.category)}`}>
            {event.category}
          </span>
        </div>
      </div>

      <div className="p-5 space-y-3">
        <h3 className="font-bold text-white text-lg leading-snug line-clamp-2 group-hover:text-rose-400 transition-colors">
          {event.title}
        </h3>
        <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">{event.description}</p>

        <div className="flex items-center gap-2 text-sm text-gray-300">
          <VenueIcon className="w-4 h-4 text-gray-500 shrink-0" />
          <span className="truncate">{event.location}</span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div className="flex items-center gap-2">
            <CalendarClock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-400">{date.time}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-sm text-gray-400">
              <Users className="w-4 h-4 text-gray-500" />
              <span>{rsvpCount}/{event.capacity}</span>
            </div>
            <span className="text-sm font-bold text-white">{formatPrice(event.price)}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

function Discover({ onSelectEvent }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('date');

  const filtered = useMemo(() => {
    let result = MOCK_EVENTS;
    if (category !== 'All') result = result.filter((e) => e.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) || e.organizer.toLowerCase().includes(q)
      );
    }
    result = sortBy === 'price'
      ? [...result].sort((a, b) => a.price - b.price)
      : [...result].sort((a, b) => new Date(a.date) - new Date(b.date));
    return result;
  }, [search, category, sortBy]);

  const featured = MOCK_EVENTS.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-950">
      <section className="relative overflow-hidden bg-gradient-to-br from-black via-gray-950 to-rose-950/40">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm ring-1 ring-white/20 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-xs font-medium text-white/90">Discover unforgettable experiences</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-tight leading-[1.1]">
              Find your next
              <br />
              <span className="bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent">
                great experience
              </span>
            </h1>
            <p className="mt-5 text-lg text-gray-400 max-w-lg leading-relaxed">
              Browse events happening near you. From music festivals to tech summits, there's something for everyone.
            </p>

            <div className="mt-8 flex items-center gap-2 bg-gray-900 rounded-2xl p-2 shadow-2xl shadow-black/40 ring-1 ring-white/10">
              <div className="flex items-center gap-2 flex-1 px-3">
                <Search className="w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search events, venues, organizers..."
                  className="flex-1 py-3 text-sm text-white placeholder:text-gray-500 bg-transparent outline-none"
                />
              </div>
              <button className="px-5 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 text-white text-sm font-semibold hover:shadow-lg hover:shadow-rose-500/30 transition-all">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {featured.length > 0 && !search && category === 'All' && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="w-5 h-5 text-rose-400" />
              <h2 className="text-xl font-bold text-white">Featured Events</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {featured.map((event) => (
                <EventCard key={event.id} event={event} onClick={() => onSelectEvent(event)} />
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  category === cat ? 'bg-white text-gray-900 shadow-sm' : 'bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800 ring-1 ring-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm font-medium text-gray-300 bg-gray-900 border border-white/10 rounded-lg px-3 py-2 outline-none cursor-pointer hover:bg-gray-800"
            >
              <option value="date">Sort by Date</option>
              <option value="price">Sort by Price</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto rounded-full bg-gray-900 flex items-center justify-center mb-4 ring-1 ring-white/10">
              <CalendarDays className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-white">No events found</h3>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
              <MapPin className="w-4 h-4" />
              <span>{filtered.length} event{filtered.length !== 1 ? 's' : ''} found</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((event) => (
                <EventCard key={event.id} event={event} onClick={() => onSelectEvent(event)} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function EventDetail({ event, onBack }) {
  const date = formatDate(event.date);
  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button onClick={onBack} className="text-sm font-medium text-gray-400 hover:text-white mb-6">← Back to Discover</button>
        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-sm bg-gray-900">
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-80 object-cover bg-gradient-to-br from-gray-800 to-gray-700"
            onError={(e) => { e.currentTarget.src = 'https://picsum.photos/seed/fallback/800/600'; }}
          />
          <div className="p-8 space-y-4">
            <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ring-1 ${categoryColor(event.category)}`}>{event.category}</span>
            <h1 className="text-3xl font-bold text-white">{event.title}</h1>
            <p className="text-gray-400 leading-relaxed">{event.description}</p>
            <div className="flex flex-wrap gap-6 pt-4 border-t border-white/10 text-sm text-gray-400">
              <div className="flex items-center gap-2"><CalendarClock className="w-4 h-4 text-gray-500" />{date.month} {date.day}, {date.time}</div>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-500" />{event.location}</div>
              <div className="flex items-center gap-2"><Users className="w-4 h-4 text-gray-500" />Capacity {event.capacity}</div>
            </div>
            <div className="flex items-center justify-between pt-4">
              <span className="text-2xl font-bold text-white">{formatPrice(event.price)}</span>
              <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 text-white font-semibold hover:shadow-lg hover:shadow-rose-500/30 transition-all">RSVP Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-black text-gray-500 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-bold text-white">Event Karwao</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Discover, create, and manage unforgettable events all in one place.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer transition-colors">Discover Events</li>
              <li className="hover:text-white cursor-pointer transition-colors">Create Event</li>
              <li className="hover:text-white cursor-pointer transition-colors">My Dashboard</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer transition-colors">Music</li>
              <li className="hover:text-white cursor-pointer transition-colors">Tech</li>
              <li className="hover:text-white cursor-pointer transition-colors">Food & Drink</li>
              <li className="hover:text-white cursor-pointer transition-colors">Sports</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Connect</h4>
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center cursor-pointer transition-colors ring-1 ring-white/10"><Twitter className="w-4 h-4" /></div>
              <div className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center cursor-pointer transition-colors ring-1 ring-white/10"><Instagram className="w-4 h-4" /></div>
              <div className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center cursor-pointer transition-colors ring-1 ring-white/10"><Linkedin className="w-4 h-4" /></div>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs">© 2026 Event Karwao. All rights reserved.</p>
          <div className="flex gap-6 text-xs">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function EventKarwaoPreview() {
  const [view, setView] = useState('discover');
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setView('detail');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-950">
      <Navbar view={view} onNavigate={setView} />
      <main className="flex-1">
        {view === 'discover' && <Discover onSelectEvent={handleSelectEvent} />}
        {view === 'dashboard' && (
          <div className="max-w-3xl mx-auto px-6 py-20 text-center text-gray-500">
            <p>Dashboard view — connects to your RSVPs and hosted events (not wired up in this static preview).</p>
          </div>
        )}
        {view === 'create' && (
          <div className="max-w-3xl mx-auto px-6 py-20 text-center text-gray-500">
            <p>Create Event view — the real form posts to Supabase (not wired up in this static preview).</p>
          </div>
        )}
        {view === 'detail' && selectedEvent && <EventDetail event={selectedEvent} onBack={() => setView('discover')} />}
      </main>
      <Footer />
    </div>
  );
}
