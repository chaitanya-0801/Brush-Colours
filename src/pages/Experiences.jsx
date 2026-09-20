import { useMemo, useState } from 'react'
import { ChevronDown, Search, SlidersHorizontal } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ExperienceCard from '../components/ExperienceCard'
import { activities } from '../data'

const tabs = [
  { value: 'all', label: 'All experiences' },
  { value: 'birthday', label: 'Birthday' },
  { value: 'wedding', label: 'Wedding' },
  { value: 'workshop', label: 'Workshop' },
]

export default function Experiences() {
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') || 'all'
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('popular')

  const filtered = useMemo(() => {
    const matching = activities.filter((activity) => {
      const categoryMatches = category === 'all' || activity.category === category
      const searchMatches = `${activity.title} ${activity.short}`.toLowerCase().includes(search.toLowerCase())
      return categoryMatches && searchMatches
    })
    return [...matching].sort((a, b) => {
      if (sort === 'low') return a.price - b.price
      if (sort === 'high') return b.price - a.price
      return b.rating - a.rating || b.reviews - a.reviews
    })
  }, [category, search, sort])

  const updateCategory = (value) => {
    if (value === 'all') setSearchParams({})
    else setSearchParams({ category: value })
  }

  return (
    <div className="catalogue-page">
      <Header />
      <main>
        <section className="catalogue-hero">
          <div className="shell catalogue-hero__grid">
            <div>
              <span className="kicker">Made for your kind of gathering</span>
              <h1>Find the perfect<br /><em>experience.</em></h1>
            </div>
            <p>Meaningful moments, creative people and clear pricing—without the back-and-forth.</p>
          </div>
        </section>

        <section className="catalogue-content">
          <div className="shell">
            <div className="catalogue-tabs" role="tablist" aria-label="Experience category">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  className={category === tab.value ? 'is-active' : ''}
                  onClick={() => updateCategory(tab.value)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="filter-bar">
              <label className="search-field">
                <Search />
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search activities" />
              </label>
              <div className="filter-chips">
                <button>Delhi NCR <ChevronDown /></button>
                <button>Date <ChevronDown /></button>
                <button>Guests <ChevronDown /></button>
                <button className="filter-chip--mobile"><SlidersHorizontal /> Filters</button>
              </div>
              <label className="sort-field">
                <span>Sort by</span>
                <select value={sort} onChange={(event) => setSort(event.target.value)}>
                  <option value="popular">Popular</option>
                  <option value="low">Price: low to high</option>
                  <option value="high">Price: high to low</option>
                </select>
              </label>
            </div>

            <div className="catalogue-count"><strong>{filtered.length}</strong> experiences</div>

            {filtered.length ? (
              <div className="experience-grid experience-grid--three catalogue-grid">
                {filtered.map((activity) => <ExperienceCard activity={activity} key={activity.id} />)}
              </div>
            ) : (
              <div className="empty-state">
                <Search />
                <h2>No experiences found</h2>
                <p>Try a different activity name or category.</p>
                <button className="button button--dark" onClick={() => { setSearch(''); setSearchParams({}) }}>Clear filters</button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
