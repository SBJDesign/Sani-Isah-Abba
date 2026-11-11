import { BrowserRouter, HashRouter, Link, Route, Routes } from 'react-router-dom'
import AdminLayout from './admin/AdminLayout'
import MessagesAdmin from './admin/MessagesAdmin'
import Overview from './admin/Overview'
import PostsAdmin from './admin/PostsAdmin'
import ProfileAdmin from './admin/ProfileAdmin'
import ProjectsAdmin from './admin/ProjectsAdmin'
import PublicationsAdmin from './admin/PublicationsAdmin'
import SiteLayout from './components/SiteLayout'
import About from './pages/About'
import Contact from './pages/Contact'
import Gallery from './pages/Gallery'
import GalleryAdmin from './admin/GalleryAdmin'
import Home from './pages/Home'
import News, { NewsPost } from './pages/News'
import Publications from './pages/Publications'
import Research from './pages/Research'

// Hash routing is only for static previews; production on Vercel uses clean URLs.
const Router = import.meta.env.VITE_HASH_ROUTER ? HashRouter : BrowserRouter

function NotFound() {
  return (
    <div className="page py-24">
      <title>Page not found</title>
      <h1 className="text-4xl font-medium">This page doesn't exist</h1>
      <p className="mt-3 text-sediment">The link may be out of date.</p>
      <Link to="/" className="link mt-4 inline-block">Go to the home page</Link>
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="research" element={<Research />} />
          <Route path="publications" element={<Publications />} />
          <Route path="news" element={<News />} />
          <Route path="news/:id" element={<NewsPost />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<Overview />} />
          <Route path="publications" element={<PublicationsAdmin />} />
          <Route path="research" element={<ProjectsAdmin />} />
          <Route path="news" element={<PostsAdmin />} />
          <Route path="gallery" element={<GalleryAdmin />} />
          <Route path="messages" element={<MessagesAdmin />} />
          <Route path="profile" element={<ProfileAdmin />} />
        </Route>
      </Routes>
    </Router>
  )
}
