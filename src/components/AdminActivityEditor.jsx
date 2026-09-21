import { ImagePlus, Plus, RotateCcw, Trash2, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { api } from '../api'
import { activityImageStyle, serviceCities } from '../data'

const emptyActivity = {
  title: '', category: 'birthday', short: '', description: '', price: '', priceUnit: 'per event',
  duration: '2 hrs', guests: '1-20 guests', badge: 'New', minLeadDays: 2, image: '', imagePublicId: '',
  imagePositionX: 50, imagePositionY: 50, imageZoom: 1,
  locations: [...serviceCities], includes: ['All activity materials', 'Professional facilitator'],
  timeSlots: [{ id: 'morning', label: '11:00 AM - 1:00 PM', start: '11:00', end: '13:00', active: true }],
  guestPricing: { enabled: false, includedGuests: 10, percentPerExtraGuest: 5, maxGuests: 100 },
  active: true,
}

const makeForm = (activity, defaultCategory = 'birthday') => activity ? {
  ...activity,
  price: activity.price ?? '',
  imagePositionX: activity.imagePositionX ?? 50,
  imagePositionY: activity.imagePositionY ?? 50,
  imageZoom: activity.imageZoom ?? 1,
  locations: [...(activity.locations || [])],
  includes: [...(activity.includes || [])],
  timeSlots: (activity.timeSlots || []).map((slot) => ({ ...slot })),
  guestPricing: { ...emptyActivity.guestPricing, ...(activity.guestPricing || {}) },
} : { ...structuredClone(emptyActivity), category: defaultCategory }

export default function AdminActivityEditor({ activity, defaultCategory, onClose, onSaved }) {
  const [form, setForm] = useState(() => makeForm(activity, defaultCategory))
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const editing = Boolean(activity)
  const title = editing ? 'Edit experience' : 'Add a new experience'
  const selectedCityCount = form.locations.length
  const canSave = useMemo(() => form.title.trim() && form.short.trim() && form.description.trim() && form.image && form.timeSlots.length && selectedCityCount, [form, selectedCityCount])

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const updateGuestPricing = (key, value) => setForm((current) => ({ ...current, guestPricing: { ...current.guestPricing, [key]: value } }))
  const updateSlot = (index, key, value) => setForm((current) => ({ ...current, timeSlots: current.timeSlots.map((slot, position) => position === index ? { ...slot, [key]: value } : slot) }))

  const toggleCity = (city) => {
    update('locations', form.locations.includes(city) ? form.locations.filter((item) => item !== city) : [...form.locations, city])
  }

  const uploadImage = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const result = await api.uploadActivityImage(file)
      setForm((current) => ({
        ...current,
        image: result.image.url,
        imagePublicId: result.image.publicId,
        imagePositionX: 50,
        imagePositionY: 50,
        imageZoom: 1,
      }))
    } catch (uploadError) {
      setError(uploadError.message)
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  const submit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    const payload = {
      title: form.title,
      category: form.category,
      short: form.short,
      description: form.description,
      price: form.price === '' ? null : Number(form.price),
      priceUnit: form.priceUnit,
      duration: form.duration,
      guestsLabel: form.guests,
      badge: form.badge,
      minLeadDays: Number(form.minLeadDays),
      imageUrl: form.image,
      imagePublicId: form.imagePublicId,
      imagePositionX: Number(form.imagePositionX),
      imagePositionY: Number(form.imagePositionY),
      imageZoom: Number(form.imageZoom),
      locations: form.locations,
      includes: form.includes.map((item) => item.trim()).filter(Boolean),
      timeSlots: form.timeSlots.map((slot, index) => ({ ...slot, id: slot.id || `slot-${index + 1}`, active: true })),
      guestPricing: {
        enabled: Boolean(form.guestPricing.enabled),
        includedGuests: Number(form.guestPricing.includedGuests),
        percentPerExtraGuest: Number(form.guestPricing.percentPerExtraGuest),
        maxGuests: Number(form.guestPricing.maxGuests),
      },
      active: Boolean(form.active),
    }
    try {
      if (editing) await api.updateActivity(activity.id, payload)
      else await api.createActivity(payload)
      await onSaved()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-backdrop admin-editor-backdrop" onMouseDown={onClose}>
      <form className="admin-activity-editor" onSubmit={submit} onMouseDown={(event) => event.stopPropagation()}>
        <header><div><span className="kicker">Catalogue manager</span><h2>{title}</h2><p>Everything saved here immediately powers the customer website.</p></div><button type="button" className="modal-close" onClick={onClose} aria-label="Close"><X /></button></header>
        {error && <div className="form-error">{error}</div>}
        <div className="admin-editor-grid">
          <section>
            <h3>Event details</h3>
            <div className="form-grid">
              <label>Event name<input required value={form.title} onChange={(event) => update('title', event.target.value)} placeholder="e.g. Watercolour Garden Party" /></label>
              <label>Category<select value={form.category} onChange={(event) => update('category', event.target.value)}><option value="birthday">Birthday</option><option value="wedding">Wedding</option><option value="workshop">Workshop</option></select></label>
              <label className="span-two">Short card description<textarea required rows="2" value={form.short} onChange={(event) => update('short', event.target.value)} /></label>
              <label className="span-two">Full description<textarea required rows="5" value={form.description} onChange={(event) => update('description', event.target.value)} /></label>
              <label>Base price (₹)<input type="number" min="0" value={form.price} onChange={(event) => update('price', event.target.value)} placeholder="Blank for quote" /></label>
              <label>Price label<input value={form.priceUnit} onChange={(event) => update('priceUnit', event.target.value)} placeholder="per event" /></label>
              <label>Duration<input value={form.duration} onChange={(event) => update('duration', event.target.value)} /></label>
              <label>Group label<input value={form.guests} onChange={(event) => update('guests', event.target.value)} /></label>
              <label>Badge<input value={form.badge} onChange={(event) => update('badge', event.target.value)} /></label>
              <label>Minimum lead days<input type="number" min="1" max="365" value={form.minLeadDays} onChange={(event) => update('minLeadDays', event.target.value)} /></label>
            </div>
          </section>

          <section>
            <h3>Cover photo</h3>
            <div className="admin-image-field">
              <div className="admin-image-preview">
                {form.image ? <img src={form.image} alt="Event preview" style={activityImageStyle(form)} /> : <div className="admin-image-empty"><ImagePlus /><span>No photo yet</span></div>}
              </div>
              <label className="button button--outline"><ImagePlus /> {uploading ? 'Uploading…' : 'Upload photo'}<input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} onChange={uploadImage} /></label>
            </div>
            <label className="admin-url-field">Or use an image URL<input required type="url" value={form.image} onChange={(event) => setForm((current) => ({ ...current, image: event.target.value, imagePublicId: '', imagePositionX: 50, imagePositionY: 50, imageZoom: 1 }))} placeholder="https://..." /></label>
            {form.image && <div className="admin-image-adjustments">
              <div className="admin-image-adjustments__heading"><div><h3>Adjust photo</h3><p>Move the focal point and zoom until the card crop looks right.</p></div><button type="button" onClick={() => setForm((current) => ({ ...current, imagePositionX: 50, imagePositionY: 50, imageZoom: 1 }))}><RotateCcw /> Reset</button></div>
              <label><span>Left ↔ right <b>{Math.round(form.imagePositionX)}%</b></span><input type="range" min="0" max="100" value={form.imagePositionX} onChange={(event) => update('imagePositionX', Number(event.target.value))} /></label>
              <label><span>Top ↕ bottom <b>{Math.round(form.imagePositionY)}%</b></span><input type="range" min="0" max="100" value={form.imagePositionY} onChange={(event) => update('imagePositionY', Number(event.target.value))} /></label>
              <label><span>Zoom <b>{Math.round(form.imageZoom * 100)}%</b></span><input type="range" min="1" max="2" step="0.05" value={form.imageZoom} onChange={(event) => update('imageZoom', Number(event.target.value))} /></label>
            </div>}
            <h3>Available cities</h3>
            <div className="admin-check-grid">{serviceCities.map((city) => <label key={city}><input type="checkbox" checked={form.locations.includes(city)} onChange={() => toggleCity(city)} /> {city}</label>)}</div>
            <h3>Package includes</h3>
            <textarea rows="5" value={form.includes.join('\n')} onChange={(event) => update('includes', event.target.value.split('\n'))} placeholder="One item per line" />
          </section>

          <section className="span-two">
            <div className="admin-editor-section-heading"><div><h3>Bookable time slots</h3><p>Customers see only these database-managed slots.</p></div><button type="button" className="button button--outline" onClick={() => update('timeSlots', [...form.timeSlots, { id: '', label: '', start: '10:00', end: '12:00', active: true }])}><Plus /> Add slot</button></div>
            <div className="admin-slot-list">
              {form.timeSlots.map((slot, index) => <div className="admin-slot-row" key={`${slot.id}-${index}`}><label>Label<input required value={slot.label} onChange={(event) => updateSlot(index, 'label', event.target.value)} placeholder="11:00 AM - 1:00 PM" /></label><label>Starts<input required type="time" value={slot.start} onChange={(event) => updateSlot(index, 'start', event.target.value)} /></label><label>Ends<input required type="time" value={slot.end} onChange={(event) => updateSlot(index, 'end', event.target.value)} /></label><button type="button" onClick={() => update('timeSlots', form.timeSlots.filter((_, position) => position !== index))} aria-label="Remove time slot"><Trash2 /></button></div>)}
              {!form.timeSlots.length && <div className="admin-empty">Add at least one time slot before saving.</div>}
            </div>
          </section>

          <section className="span-two">
            <h3>Guest-based pricing</h3>
            <label className="admin-toggle"><input type="checkbox" checked={form.guestPricing.enabled} onChange={(event) => updateGuestPricing('enabled', event.target.checked)} /><span /> Increase the total when guests exceed the included count</label>
            <div className="form-grid form-grid--three">
              <label>Guests included<input type="number" min="1" value={form.guestPricing.includedGuests} onChange={(event) => updateGuestPricing('includedGuests', event.target.value)} /></label>
              <label>% per extra guest<input type="number" min="0" max="100" step="0.5" value={form.guestPricing.percentPerExtraGuest} onChange={(event) => updateGuestPricing('percentPerExtraGuest', event.target.value)} /></label>
              <label>Maximum guests<input type="number" min="1" value={form.guestPricing.maxGuests} onChange={(event) => updateGuestPricing('maxGuests', event.target.value)} /></label>
            </div>
            <label className="admin-toggle"><input type="checkbox" checked={form.active} onChange={(event) => update('active', event.target.checked)} /><span /> Show this event to customers</label>
          </section>
        </div>
        <footer><button type="button" className="button button--outline" onClick={onClose}>Cancel</button><button className="button button--coral" disabled={!canSave || saving || uploading}>{saving ? 'Saving…' : editing ? 'Save event' : 'Add event'}</button></footer>
      </form>
    </div>
  )
}
