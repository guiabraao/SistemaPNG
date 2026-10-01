import { useLayoutEffect, useRef } from 'react'
import { useLocation, NavLink } from 'react-router-dom'
import gsap from 'gsap'
import AppRouter from './Routes/Routes'
import Icon from './Components/Icon'
import './App.css'
const navigation = [['/', 'Início', 'home'], ['/artilhariaGeral', 'Artilharia', 'ranking'], ['/eventos', 'Eventos', 'calendar'], ['/menu', 'Explorar', 'grid']]
function App() {
  const { pathname } = useLocation()
  const page = useRef(null)
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    const media = gsap.matchMedia()
    media.add({ mobile: '(max-width: 767px)', desktop: '(min-width: 768px)', reduce: '(prefers-reduced-motion: reduce)' }, ({ conditions }) => {
      if (conditions.reduce) return
      const targets = [...page.current.querySelectorAll('header, h1, h2, [data-animate], [class*="menuBox"]')].slice(0, 12)
      if (targets.length) gsap.from(targets, { autoAlpha: 0, y: conditions.mobile ? 14 : 22, duration: .38, stagger: .035, ease: 'power2.out', clearProps: 'all' })
    }, page)
    return () => media.revert()
  }, [pathname])
  const isAdmin = pathname.startsWith('/admin')
  return <>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <main ref={page} id="conteudo" className={isAdmin ? 'app-content app-content-admin' : 'app-content'}><AppRouter /></main>
    {!isAdmin && <nav className="app-nav" aria-label="Navegação principal">{navigation.map(([to, label, icon]) => <NavLink key={to} to={to} end><Icon name={icon} /><span>{label}</span></NavLink>)}</nav>}
  </>
}
export default App
