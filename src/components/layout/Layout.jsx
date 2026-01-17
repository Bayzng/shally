import Navbar from '../navbar/Navbar'
import Footer from '../footer/Footer'

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar always on top */}
      <Navbar />

      {/* Page Content */}
      <main className="flex-grow  ">
        {children}
      </main>

      {/* Footer always at bottom */}
      <Footer />
    </div>
  )
}

export default Layout
