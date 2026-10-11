import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { itemsAPI } from '../services/api'
import { 
  PlusCircle, 
  MapPin, 
  Calendar, 
  Clock, 
  Upload, 
  AlertCircle, 
  CheckCircle2, 
  ArrowLeft, 
  Sparkles,
  X,
  FileText,
  Tag
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
      setError('')
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return
    if (!itemName.trim()) {
      setError('Item name is required.')
      return
    }
    if (!location.trim()) {
      setError('Location is required.')
      return
    }
    if (!dateReported) {
      setError('Date lost is required.')
      return
    }

    setLoading(true)
    setError('')

    const formData = new FormData()
    formData.append('item_name', itemName.trim())
    formData.append('category', category)
    formData.append('location', location.trim())
    formData.append('date_reported', dateReported)
    if (timeReported && timeReported.trim()) {
      formData.append('time_reported', timeReported.trim())
    }
    if (description && description.trim()) {
      formData.append('description', description.trim())
    }
    if (additionalDetails && additionalDetails.trim()) {
      formData.append('additional_details', additionalDetails.trim())
    }
    if (imageFile) {
      formData.append('image', imageFile)
    }

    try {
      await itemsAPI.reportLost(formData)
      setSuccess(true)
      setTimeout(() => {
        navigate('/matches')
      }, 1500)
    } catch (err) {
      const detail = err.response?.data?.detail
      let errorMsg = 'Failed to submit report. Please check all fields.'
      if (typeof detail === 'string') {
        errorMsg = detail
      } else if (Array.isArray(detail)) {
        errorMsg = detail.map((d) => d.msg || `${d.loc?.slice(-1)[0]}: ${d.msg}`).join(', ')
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message
      } else if (err.message) {
        errorMsg = err.message
      }
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
<<<<<<< HEAD
    <div className="max-w-2xl mx-auto py-6 animate-fade-in pb-16">
      <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 transition-transform duration-200 hover:-translate-x-0.5" /> Back to Dashboard
      </Link>

      <div className="card reveal bg-navy-800 border-slate-700 shadow-2xl p-6 sm:p-8 space-y-6">
=======
    <div className="max-w-2xl mx-auto py-4 sm:py-6 animate-fade-in pb-16">
      <Link 
        to="/dashboard" 
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="card bg-white border-slate-200/90 shadow-md p-6 sm:p-9 space-y-6">
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
        {/* Header */}
        <div className="flex items-start gap-4 pb-5 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center shrink-0 shadow-xs">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Report Lost Item</h1>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Provide details about your missing property so our AI matching radar can search for candidate items across campus.
            </p>
          </div>
        </div>

        {error && (
<<<<<<< HEAD
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-center gap-2.5 text-xs text-rose-300 animate-slide-down">
            <AlertCircle className="w-4 h-4 shrink-0" />
=======
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-xs text-rose-700 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
            <span>{error}</span>
          </div>
        )}

        {success && (
<<<<<<< HEAD
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300 animate-slide-down">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <div>
              <div className="font-bold">Report Created Successfully!</div>
              <div>Running smart matching engine and redirecting to match leads...</div>
            </div>
=======
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-800 font-semibold animate-slide-up">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
            <span>Report submitted successfully! Opening Smart Match Radar...</span>
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Item Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Item Name / Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
<<<<<<< HEAD
              placeholder="e.g., Space Gray MacBook Pro 14, Blue HydroFlask Bottle, TI-84 Calculator"
              className="w-full px-3.5 py-2.5 bg-slate-850 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
=======
              placeholder="e.g. Boat Wireless Earphones, Blue Backpack, Dell Laptop"
              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 transition-all shadow-xs"
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
            />
          </div>

          {/* Category & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
<<<<<<< HEAD
                className="w-full px-3.5 py-2.5 bg-slate-850 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 cursor-pointer"
=======
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 transition-all shadow-xs cursor-pointer"
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Campus Location Zone <span className="text-rose-500">*</span>
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
<<<<<<< HEAD
                className="w-full px-3.5 py-2.5 bg-slate-850 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 cursor-pointer"
=======
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 transition-all shadow-xs cursor-pointer"
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Approximate Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Date Lost <span className="text-rose-500">*</span>
              </label>
<<<<<<< HEAD
              <input
                type="date"
                required
                value={dateReported}
                onChange={(e) => setDateReported(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-850 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
              />
=======
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  required
                  value={dateReported}
                  onChange={(e) => setDateReported(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 transition-all shadow-xs"
                />
              </div>
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Approximate Time (Optional)
              </label>
<<<<<<< HEAD
              <input
                type="text"
                value={timeReported}
                onChange={(e) => setTimeReported(e.target.value)}
                placeholder="e.g., 14:30 or 2:30 PM"
                className="w-full px-3.5 py-2.5 bg-slate-850 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
              />
=======
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={timeReported}
                  onChange={(e) => setTimeReported(e.target.value)}
                  placeholder="e.g. 11:30 AM, Afternoon"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 transition-all shadow-xs"
                />
              </div>
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Item Description & Physical Appearance
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
<<<<<<< HEAD
              placeholder="Describe brand, color, stickers, scratches, case, or distinguishing characteristics (used by AI text matching)..."
              className="w-full px-3.5 py-2.5 bg-slate-850 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
=======
              placeholder="Describe color, brand, condition, unique scratches, logos, or accessories..."
              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 transition-all shadow-xs"
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Tip: Accurate keywords and model names improve AI semantic similarity scoring.
            </p>
          </div>

          {/* Additional Confidential Details */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Private Ownership Identifiers (Optional)
            </label>
            <textarea
              rows={2}
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              placeholder="Private serial numbers, engraved initials, sticker placements, keychain details..."
              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 transition-all shadow-xs"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Used strictly for verification review during handover approval.
            </p>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Upload Item Reference Image (Optional, max 5MB)
            </label>
<<<<<<< HEAD
            <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500/50 hover:bg-indigo-500/[0.03] rounded-2xl p-4 text-center transition-all duration-300">
              {imagePreview ? (
                <div className="space-y-2">
                  <img src={imagePreview} alt="Preview" className="h-32 mx-auto object-cover rounded-xl animate-scale-up shadow-lg shadow-indigo-500/10" />
                  <button
                    type="button"
                    onClick={() => { setImageFile(null); setImagePreview(null); }}
                    className="text-xs text-rose-400 hover:underline cursor-pointer"
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
=======
            {imagePreview ? (
              <div className="relative inline-block border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-48 h-36 object-cover" 
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-slate-900/80 text-white rounded-full hover:bg-rose-600 transition-colors cursor-pointer"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-indigo-50/20">
                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-xs font-bold text-slate-700">Click to upload photo</span>
                <span className="text-[11px] text-slate-400 mt-0.5">PNG, JPG up to 5MB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
          </div>

          {/* Submit Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              to="/dashboard"
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || success}
<<<<<<< HEAD
              className="btn-sheen px-6 py-2.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-600/25 hover:shadow-rose-600/40 transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 disabled:hover:scale-100"
=======
              className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-sm shadow-rose-600/25 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
>>>>>>> 13ba826 (feat: complete premium SaaS frontend redesign)
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Submit Lost Report</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
