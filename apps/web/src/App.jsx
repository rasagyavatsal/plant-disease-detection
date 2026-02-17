import { useState } from 'react'
import { Upload, Loader2, AlertCircle, CheckCircle2, Leaf } from 'lucide-react'
import { predict } from '@cropintel/shared'

function App() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
      setImagePreview(URL.createObjectURL(file))
      setResult(null)
      setError(null)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file)
      setImagePreview(URL.createObjectURL(file))
      setResult(null)
      setError(null)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleAnalyze = async () => {
    if (!selectedImage) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const data = await predict(selectedImage)

      if (data.success) {
        setResult(data)
      } else {
        setError('Analysis failed')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to connect to server. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSelectedImage(null)
    setImagePreview(null)
    setResult(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-gray-900">Plant Disease Detection</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Upload Plant Image</h2>
            
            {!imagePreview ? (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-3 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-green-500 transition-colors cursor-pointer"
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg text-gray-600 mb-2">
                    Drop your image here or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports: JPG, PNG, WEBP
                  </p>
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-auto max-h-96 object-contain bg-gray-100"
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      'Analyze Disease'
                    )}
                  </button>
                  
                  <button
                    onClick={handleReset}
                    disabled={loading}
                    className="bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Analysis Results</h2>
            
            {!result && !error && !loading && (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <Leaf className="w-16 h-16 mb-4" />
                <p className="text-lg">Upload an image to get started</p>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="w-16 h-16 text-green-600 animate-spin mb-4" />
                <p className="text-lg text-gray-600">Analyzing your plant...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-900 mb-1">Error</h3>
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {result && result.success && (
              <div className="space-y-6">
                {/* Top Prediction */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-green-900 mb-2">Detection Complete</h3>
                      <div className="bg-white rounded-lg p-4 border border-green-200">
                        <p className="text-sm text-gray-600 mb-1">Identified Disease:</p>
                        <p className="text-xl font-bold text-gray-900 mb-2">
                          {result.top_prediction.label}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full transition-all"
                              style={{ width: `${(result.top_prediction.score * 100).toFixed(1)}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-gray-700">
                            {(result.top_prediction.score * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* All Predictions */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">All Predictions</h3>
                  <div className="space-y-3">
                    {result.predictions.slice(0, 5).map((pred, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium text-gray-900 flex-1">{pred.label}</p>
                          <span className="text-sm font-semibold text-gray-700 ml-2">
                            {(pred.score * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-green-500 h-1.5 rounded-full transition-all"
                            style={{ width: `${(pred.score * 100).toFixed(1)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 rounded-full p-4 mb-3">
                <Upload className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">1. Upload Image</h3>
              <p className="text-gray-600 text-sm">
                Upload a clear photo of the affected plant leaf or area
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 rounded-full p-4 mb-3">
                <Loader2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">2. AI Analysis</h3>
              <p className="text-gray-600 text-sm">
                Our AI model analyzes the image using advanced deep learning
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 rounded-full p-4 mb-3">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">3. Get Results</h3>
              <p className="text-gray-600 text-sm">
                Receive instant disease identification with confidence scores
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600">
            Powered by MobileNetV2 Plant Disease Identification Model
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
