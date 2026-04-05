import { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot, 
  serverTimestamp, 
  increment, 
  deleteDoc,
  Timestamp,
  FirebaseUser
} from './lib/firebase';
import { 
  Home, 
  Play, 
  Search, 
  Video as VideoIcon, 
  User, 
  LogOut, 
  Menu, 
  Bell, 
  Plus, 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  MoreVertical, 
  CheckCircle,
  History,
  Clock,
  ThumbsUp as LikeIcon,
  Flame,
  Music2,
  Gamepad2,
  Trophy,
  ShoppingBag,
  Clapperboard,
  Radio,
  Newspaper,
  Lightbulb,
  Shirt,
  Podcast,
  X,
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactPlayer from 'react-player';
const Player = ReactPlayer as any;
import { cn, formatTimeAgo, formatCount } from './lib/utils';
import { UserProfile, Video, Comment, Subscription, Like } from './types';

// --- Contexts ---
const AuthContext = createContext<{
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: () => Promise<void>;
  logOut: () => Promise<void>;
}>({
  user: null,
  profile: null,
  loading: true,
  signIn: async () => {},
  logOut: async () => {},
});

const useAuth = () => useContext(AuthContext);

// --- Components ---

const Navbar = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const { user, profile, signIn, logOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-14 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 z-50">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full">
          <Menu className="w-6 h-6" />
        </button>
        <Link to="/" className="flex items-center gap-1">
          <div className="bg-red-600 p-1 rounded-lg">
            <Play className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="font-bold text-xl tracking-tighter hidden sm:block">VidStream</span>
        </Link>
      </div>

      <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-4 hidden md:flex">
        <div className="flex w-full">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 px-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-l-full focus:outline-none focus:border-blue-500"
          />
          <button type="submit" className="h-10 px-6 bg-zinc-100 dark:bg-zinc-800 border border-l-0 border-zinc-300 dark:border-zinc-700 rounded-r-full hover:bg-zinc-200 dark:hover:bg-zinc-700">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </form>

      <div className="flex items-center gap-2 sm:gap-4">
        {user && user.email === "crazyking35704767@gmail.com" && (
          <button
            onClick={async () => {
              const sampleVideos = [
                {
                  id: 'v1',
                  title: 'Top 10 Places to Visit in 2026',
                  description: 'Explore the most beautiful destinations around the world.',
                  videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
                  thumbnailUrl: 'https://picsum.photos/seed/travel/640/360',
                  authorId: user.uid,
                  authorName: user.displayName,
                  authorPhoto: user.photoURL,
                  type: 'long',
                  likesCount: 1200,
                  viewsCount: 50000,
                  createdAt: serverTimestamp()
                },
                {
                  id: 'v2',
                  title: 'How to Build a YouTube Clone with React',
                  description: 'Step by step tutorial on building a full-stack YouTube clone.',
                  videoUrl: 'https://www.w3schools.com/html/movie.mp4',
                  thumbnailUrl: 'https://picsum.photos/seed/coding/640/360',
                  authorId: user.uid,
                  authorName: user.displayName,
                  authorPhoto: user.photoURL,
                  type: 'long',
                  likesCount: 850,
                  viewsCount: 12000,
                  createdAt: serverTimestamp()
                },
                {
                  id: 's1',
                  title: 'Funny Cat Moments #Shorts',
                  description: 'The funniest cats on the internet!',
                  videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
                  thumbnailUrl: 'https://picsum.photos/seed/cat/360/640',
                  authorId: user.uid,
                  authorName: user.displayName,
                  authorPhoto: user.photoURL,
                  type: 'short',
                  likesCount: 4500,
                  viewsCount: 100000,
                  createdAt: serverTimestamp()
                }
              ];
              for (const v of sampleVideos) {
                await setDoc(doc(db, 'videos', v.id), v);
              }
              alert('Sample data seeded!');
            }}
            className="hidden sm:block text-xs font-bold px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700"
          >
            Seed Data
          </button>
        )}
        {user ? (
          <>
            <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full hidden sm:block">
              <Plus className="w-6 h-6" />
            </button>
            <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full hidden sm:block">
              <Bell className="w-6 h-6" />
            </button>
            <div className="relative group">
              <img
                src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`}
                alt="Profile"
                className="w-8 h-8 rounded-full cursor-pointer"
              />
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg hidden group-hover:block py-1">
                <div className="px-4 py-2 border-b border-zinc-200 dark:border-zinc-800">
                  <p className="font-medium truncate">{user.displayName}</p>
                  <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                </div>
                <button onClick={logOut} className="w-full text-left px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          </>
        ) : (
          <button
            onClick={signIn}
            className="flex items-center gap-2 px-3 py-1.5 text-blue-600 border border-zinc-300 dark:border-zinc-700 rounded-full font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <User className="w-5 h-5" /> Sign In
          </button>
        )}
      </div>
    </nav>
  );
};

const SidebarItem = ({ icon: Icon, label, to, active }: { icon: any, label: string, to: string, active?: boolean }) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-5 px-3 py-2.5 rounded-lg transition-colors",
      active ? "bg-zinc-100 dark:bg-zinc-800 font-medium" : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
    )}
  >
    <Icon className={cn("w-6 h-6", active && "text-red-600")} />
    <span className="text-sm">{label}</span>
  </Link>
);

const Sidebar = ({ isOpen }: { isOpen: boolean }) => {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <aside className={cn(
      "fixed left-0 top-14 bottom-0 bg-white dark:bg-zinc-950 transition-all duration-300 z-40 overflow-y-auto scrollbar-hide",
      isOpen ? "w-60 px-3" : "w-0 sm:w-20 px-1"
    )}>
      <div className="py-3 space-y-1">
        <SidebarItem icon={Home} label="Home" to="/" active={location.pathname === '/'} />
        <SidebarItem icon={Clapperboard} label="Shorts" to="/shorts" active={location.pathname === '/shorts'} />
        <SidebarItem icon={Podcast} label="Subscriptions" to="/subscriptions" active={location.pathname === '/subscriptions'} />
      </div>
      
      {isOpen && (
        <>
          <hr className="my-3 border-zinc-200 dark:border-zinc-800" />
          <div className="py-3 space-y-1">
            <h3 className="px-3 mb-2 font-medium text-sm">You</h3>
            <SidebarItem icon={History} label="History" to="/history" />
            <SidebarItem icon={Clock} label="Watch Later" to="/watch-later" />
            <SidebarItem icon={LikeIcon} label="Liked Videos" to="/liked" />
          </div>
          
          <hr className="my-3 border-zinc-200 dark:border-zinc-800" />
          <div className="py-3 space-y-1">
            <h3 className="px-3 mb-2 font-medium text-sm">Explore</h3>
            <SidebarItem icon={Flame} label="Trending" to="/trending" />
            <SidebarItem icon={ShoppingBag} label="Shopping" to="/shopping" />
            <SidebarItem icon={Music2} label="Music" to="/music" />
            <SidebarItem icon={Clapperboard} label="Movies" to="/movies" />
            <SidebarItem icon={Radio} label="Live" to="/live" />
            <SidebarItem icon={Gamepad2} label="Gaming" to="/gaming" />
            <SidebarItem icon={Newspaper} label="News" to="/news" />
            <SidebarItem icon={Trophy} label="Sports" to="/sports" />
            <SidebarItem icon={Lightbulb} label="Learning" to="/learning" />
            <SidebarItem icon={Shirt} label="Fashion & Beauty" to="/fashion" />
          </div>
        </>
      )}
    </aside>
  );
};

const VideoCard = ({ video }: { video: Video }) => (
  <Link to={`/watch/${video.id}`} className="group flex flex-col gap-3">
    <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-200 dark:bg-zinc-800">
      <img
        src={video.thumbnailUrl || `https://picsum.photos/seed/${video.id}/640/360`}
        alt={video.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        referrerPolicy="no-referrer"
      />
      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">
        10:00
      </div>
    </div>
    <div className="flex gap-3">
      <img
        src={video.authorPhoto || `https://ui-avatars.com/api/?name=${video.authorName}`}
        alt={video.authorName}
        className="w-9 h-9 rounded-full shrink-0"
      />
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold line-clamp-2 text-sm sm:text-base leading-tight">
          {video.title}
        </h3>
        <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
          <div className="flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-100">
            {video.authorName}
            <CheckCircle className="w-3 h-3 fill-zinc-500 text-white" />
          </div>
          <div>
            {formatCount(video.viewsCount)} views • {formatTimeAgo(video.createdAt)}
          </div>
        </div>
      </div>
    </div>
  </Link>
);

const ShortsCard = ({ video }: { video: Video }) => (
  <Link to={`/shorts/${video.id}`} className="flex flex-col gap-2">
    <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-zinc-200 dark:bg-zinc-800">
      <img
        src={video.thumbnailUrl || `https://picsum.photos/seed/${video.id}/360/640`}
        alt={video.title}
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
      />
      <div className="absolute bottom-4 left-4 right-4">
        <h3 className="text-white font-semibold text-sm line-clamp-2 drop-shadow-lg">
          {video.title}
        </h3>
        <p className="text-white/80 text-xs mt-1 drop-shadow-lg">
          {formatCount(video.viewsCount)} views
        </p>
      </div>
    </div>
  </Link>
);

// --- Pages ---

const HomePage = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'videos'), where('type', '==', 'long'), orderBy('createdAt', 'desc'), limit(20));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const videoData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Video));
      setVideos(videoData);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="animate-pulse flex flex-col gap-3">
        <div className="aspect-video bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
            <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
          </div>
        </div>
      </div>
    ))}
  </div>;

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
        {videos.map(video => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
      
      {videos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <VideoIcon className="w-16 h-16 text-zinc-300 mb-4" />
          <h2 className="text-xl font-bold">No videos yet</h2>
          <p className="text-zinc-500">Be the first to upload a video!</p>
        </div>
      )}
    </div>
  );
};

const ShortsPage = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'videos'), where('type', '==', 'short'), orderBy('createdAt', 'desc'), limit(20));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const videoData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Video));
      setVideos(videoData);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
    {[...Array(12)].map((_, i) => (
      <div key={i} className="animate-pulse aspect-[9/16] bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
    ))}
  </div>;

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {videos.map(video => (
          <ShortsCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
};

const WatchPage = () => {
  const { id } = useParams();
  const [video, setVideo] = useState<Video | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (!id) return;
    const unsubscribe = onSnapshot(doc(db, 'videos', id), (doc) => {
      if (doc.exists()) {
        setVideo({ id: doc.id, ...doc.data() } as Video);
      }
    });
    return unsubscribe;
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const q = query(collection(db, 'videos', id, 'comments'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment)));
    });
    return unsubscribe;
  }, [id]);

  useEffect(() => {
    if (!id || !user) return;
    const likeId = `${user.uid}_${id}`;
    const unsubscribe = onSnapshot(doc(db, 'likes', likeId), (doc) => {
      setIsLiked(doc.exists());
    });
    return unsubscribe;
  }, [id, user]);

  useEffect(() => {
    if (!video || !user) return;
    const subId = `${user.uid}_${video.authorId}`;
    const unsubscribe = onSnapshot(doc(db, 'subscriptions', subId), (doc) => {
      setIsSubscribed(doc.exists());
    });
    return unsubscribe;
  }, [video, user]);

  const handleLike = async () => {
    if (!user || !id || !video) return;
    const likeId = `${user.uid}_${id}`;
    if (isLiked) {
      await deleteDoc(doc(db, 'likes', likeId));
      await setDoc(doc(db, 'videos', id), { likesCount: increment(-1) }, { merge: true });
    } else {
      await setDoc(doc(db, 'likes', likeId), {
        userId: user.uid,
        videoId: id,
        createdAt: serverTimestamp()
      });
      await setDoc(doc(db, 'videos', id), { likesCount: increment(1) }, { merge: true });
    }
  };

  const handleSubscribe = async () => {
    if (!user || !video) return;
    const subId = `${user.uid}_${video.authorId}`;
    if (isSubscribed) {
      await deleteDoc(doc(db, 'subscriptions', subId));
      await setDoc(doc(db, 'users', video.authorId), { subscriberCount: increment(-1) }, { merge: true });
    } else {
      await setDoc(doc(db, 'subscriptions', subId), {
        subscriberId: user.uid,
        channelId: video.authorId,
        createdAt: serverTimestamp()
      });
      await setDoc(doc(db, 'users', video.authorId), { subscriberCount: increment(1) }, { merge: true });
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id || !newComment.trim()) return;
    await setDoc(doc(collection(db, 'videos', id, 'comments')), {
      videoId: id,
      authorId: user.uid,
      authorName: user.displayName,
      authorPhoto: user.photoURL,
      text: newComment,
      createdAt: serverTimestamp()
    });
    setNewComment('');
  };

  if (!video) return <div className="p-4 animate-pulse">
    <div className="aspect-video bg-zinc-200 dark:bg-zinc-800 rounded-xl mb-4" />
    <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4 mb-2" />
    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
  </div>;

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 max-w-[1600px] mx-auto">
      <div className="flex-1">
        <div className="aspect-video rounded-xl overflow-hidden bg-black shadow-lg">
          <Player
            url={video.videoUrl}
            controls
            width="100%"
            height="100%"
            playing
          />
        </div>
        
        <div className="mt-4">
          <h1 className="text-xl font-bold line-clamp-2">{video.title}</h1>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-3">
            <div className="flex items-center gap-3">
              <img
                src={video.authorPhoto || `https://ui-avatars.com/api/?name=${video.authorName}`}
                alt={video.authorName}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-1 font-bold">
                  {video.authorName}
                  <CheckCircle className="w-3 h-3 fill-zinc-500 text-white" />
                </div>
                <span className="text-xs text-zinc-500">1.2M subscribers</span>
              </div>
              <button
                onClick={handleSubscribe}
                className={cn(
                  "ml-4 px-4 py-2 rounded-full font-medium transition-colors",
                  isSubscribed 
                    ? "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700" 
                    : "bg-black dark:bg-white text-white dark:text-black hover:opacity-90"
                )}
              >
                {isSubscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <button
                  onClick={handleLike}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 border-r border-zinc-300 dark:border-zinc-700"
                >
                  <ThumbsUp className={cn("w-5 h-5", isLiked && "fill-black dark:fill-white")} />
                  <span className="font-medium">{formatCount(video.likesCount)}</span>
                </button>
                <button className="px-4 py-2 hover:bg-zinc-200 dark:hover:bg-zinc-700">
                  <ThumbsUp className="w-5 h-5 rotate-180" />
                </button>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 font-medium">
                <Share2 className="w-5 h-5" /> Share
              </button>
              <button className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-sm">
            <div className="font-bold mb-1">
              {formatCount(video.viewsCount)} views • {formatTimeAgo(video.createdAt)}
            </div>
            <p className="whitespace-pre-wrap">{video.description}</p>
          </div>
          
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-4">{comments.length} Comments</h3>
            {user && (
              <form onSubmit={handleAddComment} className="flex gap-4 mb-8">
                <img
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`}
                  alt="My Profile"
                  className="w-10 h-10 rounded-full shrink-0"
                />
                <div className="flex-1 flex flex-col gap-2">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full bg-transparent border-b border-zinc-300 dark:border-zinc-700 focus:border-black dark:focus:border-white focus:outline-none py-1"
                  />
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setNewComment('')} className="px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full font-medium">Cancel</button>
                    <button type="submit" disabled={!newComment.trim()} className="px-4 py-2 bg-blue-600 text-white rounded-full font-medium disabled:opacity-50">Comment</button>
                  </div>
                </div>
              </form>
            )}
            
            <div className="space-y-6">
              {comments.map(comment => (
                <div key={comment.id} className="flex gap-4">
                  <img
                    src={comment.authorPhoto || `https://ui-avatars.com/api/?name=${comment.authorName}`}
                    alt={comment.authorName}
                    className="w-10 h-10 rounded-full shrink-0"
                  />
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-bold">@{comment.authorName.toLowerCase().replace(/\s/g, '')}</span>
                      <span className="text-zinc-500">{formatTimeAgo(comment.createdAt)}</span>
                    </div>
                    <p className="text-sm">{comment.text}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <button className="flex items-center gap-1 text-zinc-500 hover:text-black dark:hover:text-white">
                        <ThumbsUp className="w-4 h-4" /> <span className="text-xs">0</span>
                      </button>
                      <button className="text-xs font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 px-2 py-1 rounded-full">Reply</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="lg:w-[400px] flex flex-col gap-4">
        <h3 className="font-bold">Related Videos</h3>
        {/* Placeholder for related videos */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex gap-2">
            <div className="w-40 h-24 bg-zinc-200 dark:bg-zinc-800 rounded-lg shrink-0" />
            <div className="flex flex-col gap-1">
              <h4 className="text-sm font-bold line-clamp-2">Amazing Video Title That is Quite Long for Testing</h4>
              <p className="text-xs text-zinc-500">Channel Name</p>
              <p className="text-xs text-zinc-500">1.2M views • 1 year ago</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const UploadModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [type, setType] = useState<'long' | 'short'>('long');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const videoId = doc(collection(db, 'videos')).id;
      await setDoc(doc(db, 'videos', videoId), {
        id: videoId,
        title,
        description,
        videoUrl,
        authorId: user.uid,
        authorName: user.displayName,
        authorPhoto: user.photoURL,
        type,
        likesCount: 0,
        viewsCount: 0,
        createdAt: serverTimestamp()
      });
      onClose();
      setTitle('');
      setDescription('');
      setVideoUrl('');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-xl font-bold">Upload Video</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter video title"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 h-32"
              placeholder="Tell viewers about your video"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Video URL (Direct link or YouTube/Vimeo)</label>
            <input
              type="url"
              required
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="https://example.com/video.mp4"
            />
          </div>
          
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="type"
                checked={type === 'long'}
                onChange={() => setType('long')}
                className="w-4 h-4 text-red-600"
              />
              <span>Long Video</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="type"
                checked={type === 'short'}
                onChange={() => setType('short')}
                className="w-4 h-4 text-red-600"
              />
              <span>Short</span>
            </label>
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'Uploading...' : 'Publish'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
          const newProfile = {
            uid: user.uid,
            displayName: user.displayName || 'Anonymous',
            email: user.email || '',
            photoURL: user.photoURL || '',
            subscriberCount: 0,
            createdAt: serverTimestamp()
          };
          await setDoc(doc(db, 'users', user.uid), newProfile);
          setProfile(newProfile as any);
        } else {
          setProfile(userDoc.data() as UserProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error(error);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
      <Play className="w-12 h-12 text-red-600 animate-pulse" />
    </div>
  );

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, logOut }}>
      <Router>
        <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
          <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
          
          <div className="flex pt-14">
            <Sidebar isOpen={isSidebarOpen} />
            
            <main className={cn(
              "flex-1 transition-all duration-300",
              isSidebarOpen ? "sm:ml-60" : "sm:ml-20"
            )}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/shorts" element={<ShortsPage />} />
                <Route path="/watch/:id" element={<WatchPage />} />
                <Route path="/search" element={<div className="p-4">Search Results (Coming Soon)</div>} />
                <Route path="/subscriptions" element={<div className="p-4">Your Subscriptions (Coming Soon)</div>} />
                <Route path="*" element={<HomePage />} />
              </Routes>
            </main>
          </div>
          
          {user && (
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="fixed bottom-6 right-6 w-14 h-14 bg-red-600 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-red-700 transition-transform hover:scale-110 z-50"
            >
              <Plus className="w-8 h-8" />
            </button>
          )}
          
          <AnimatePresence>
            {isUploadModalOpen && (
              <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />
            )}
          </AnimatePresence>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}
