import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { itemsAPI } from '../services/api'
import { 
  PlusCircle, 
  MapPin, 
  Calendar, 
  Clock, 
  Upload, 
  Tag, 
  AlertCircle, 
  CheckCircle2, 
  ArrowLeft, 
  Sparkles,
  Info
} from 'lucide-react'

const CATEGORIES = [
  'Electronics',
  'Personal Items',
  'Study Materials',
  'Clothing',
  'Documents',
  'Other',
]

const LOCATIONS = [
  'Library',
  'Computer Lab',
  'Classroom',
  'Laboratory',
  'Auditorium',
  'Canteen',
  'Corridor',
  'Parking',
  'Playground',
  'Sports Room',
]

export default function ReportLost() {
  const navigate = useNavigate()
  const [itemName, setItemName] = useState('')
  const [category, setCategory] = useState('Electronics')
  const [location, setLocation] = useState('Library')
  const [dateReported, setDateReported] = useState(new Date().toISOString().split('T')[0])
  const [timeReported, setTimeReported] = useState('')
  const [description, setDescription] = useState('')
  const [additionalDetails, setAdditionalDetails] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file size must be less than 5MB.')
        return
      }
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!itemName.trim()) {
      setError('Item name is required.')
      return
    }

    setLoading(true)
    setError('')

    const formData = new FormData()
    formData.append('item_name', itemName)
    formData.append('category', category)
    formData.append('location', location)
    formData.append('date_reported', dateReported)
    if (timeReported) formData.append('time_reported', timeReported)
    if (description) formData.append('description', description)
    if (additionalDetails) formData.append('additional_details', additionalDetails)
    if (imageFile) formData.append('image', imageFile)

    try {
      await itemsAPI.reportLost(formData)
      setSuccess(true)
      setTimeout(() => {
        navigate('/matches')
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit report. Please check all fields.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-6 animate-fade-in pb-16">
      <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="card bg-navy-800 border-slate-700 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4 pb-4 border-b border-slate-700">
          <div className="w-12 h-12 rounded-2xl bg-rose-600/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Report Lost Item</h1>
            <p className="text-xs text-slate-400 mt-1">
              Provide details about your missing property so our AI matching radar can search for candidate items across campus.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-center gap-2.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <div>
              <div className="font-bold">Report Created Successfully!</div>
              <div>Running smart matching engine and redirecting to match leads...</div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Item Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Item Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="e.g., Space Gray MacBook Pro 14, Blue HydroFlask Bottle, TI-84 Calculator"
              className="w-full px-3.5 py-2.5 bg-slate-850 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Category & Location Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Category <span className="text-rose-400">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-850 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Campus Location <span className="text-rose-400">*</span>
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-850 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Time Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Date Lost <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                required
                value={dateReported}
                onChange={(e) => setDateReported(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-850 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Approximate Time (Optional)
              </label>
              <input
                type="text"
                value={timeReported}
                onChange={(e) => setTimeReported(e.target.value)}
                placeholder="e.g., 14:30 or 2:30 PM"
                className="w-full px-3.5 py-2.5 bg-slate-850 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Description & Distinctive Features
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe brand, color, stickers, scratches, case, or distinguishing characteristics (used by AI text matching)..."
              className="w-full px-3.5 py-2.5 bg-slate-850 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Attach Reference Photo (Optional)
            </label>
            <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500/50 rounded-2xl p-4 text-center transition-colors">
              {imagePreview ? (
                <div className="space-y-2">
                  <img src={imagePreview} alt="Preview" className="h-32 mx-auto object-cover rounded-xl" />
                  <button
                    type="button"
                    onClick={() => { setImageFile(null); setImagePreview(null); }}
                    className="text-xs text-rose-400 hover:underline"
                  >
                    Remove photo
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block space-y-1">
                  <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                  <span className="text-xs font-semibold text-indigo-400">Click to upload photo</span>
                  <span className="text-[11px] text-slate-500 block">PNG, JPG up to 5MB</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700 flex items-center justify-end gap-3">
            <Link
              to="/dashboard"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || success}
              className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-600/25 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Submit & Scan for Matches</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
