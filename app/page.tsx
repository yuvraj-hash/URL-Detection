
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Shield, Search, History, BarChart3, Moon, Sun, ExternalLink, Trash2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ScanResult {
  date: string
  url: string
  result: "Safe" | "Suspicious" | "Malicious"
  confidence: number
}

interface Stats {
  total: number
  threats: number
  safe: number
}

export default function NetShieldPro() {
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [url, setUrl] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, threats: 0, safe: 0 })
  const [currentResult, setCurrentResult] = useState<ScanResult | null>(null)

  useEffect(() => {
    // Load saved data from localStorage
    const savedHistory = localStorage.getItem("scanHistory")
    const savedStats = localStorage.getItem("stats")
    const savedTheme = localStorage.getItem("theme") as "light" | "dark"

    if (savedHistory) setScanHistory(JSON.parse(savedHistory))
    if (savedStats) setStats(JSON.parse(savedStats))
    if (savedTheme) setTheme(savedTheme)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  /**
   * Detection logic explanation:
   * This function does NOT use a real machine learning model. Instead, it simulates detection by checking if the URL contains certain suspicious keywords (like 'phishing', 'scam', etc.).
   * The confidence score is randomly generated between 70 and 99. For a real ML-based detection, you would call an API or run a model here.
   */
  const analyzeUrl = async (urlToAnalyze: string) => {
    setIsScanning(true)

    // Simulate API call with realistic delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simple keyword-based mock detection (not ML)
    const suspiciousKeywords = ["phishing", "scam", "fake", "malware", "virus"]
    const isSuspicious = suspiciousKeywords.some((keyword) => urlToAnalyze.toLowerCase().includes(keyword))

    const result: ScanResult = {
      date: new Date().toISOString(),
      url: urlToAnalyze,
      result: isSuspicious ? "Suspicious" : "Safe",
      confidence: Math.floor(Math.random() * 30) + 70,
    }

    // Update history and stats
    const newHistory = [result, ...scanHistory].slice(0, 50)
    const newStats = {
      total: stats.total + 1,
      threats: stats.threats + (result.result !== "Safe" ? 1 : 0),
      safe: stats.safe + (result.result === "Safe" ? 1 : 0),
    }

    setScanHistory(newHistory)
    setStats(newStats)
    setCurrentResult(result)

    localStorage.setItem("scanHistory", JSON.stringify(newHistory))
    localStorage.setItem("stats", JSON.stringify(newStats))

    setIsScanning(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (url.trim()) {
      analyzeUrl(url.trim())
    }
  }

  const deleteFromHistory = (dateToDelete: string) => {
    const newHistory = scanHistory.filter((scan) => scan.date !== dateToDelete)
    setScanHistory(newHistory)
    localStorage.setItem("scanHistory", JSON.stringify(newHistory))
  }

  const rescan = (urlToRescan: string) => {
    setUrl(urlToRescan)
    analyzeUrl(urlToRescan)
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${theme === "dark" ? "dark bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  NetShield Pro
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Advanced Phishing Detection</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 min-h-[80vh] flex items-center">
        {/* Digital Rain Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="digital-rain">
            {Array.from({ length: 50 }).map((_, i) => {
              // Deterministic pseudo-random for hydration safety
              const colSeed = i * 9973;
              const animationDelay = ((colSeed % 5000) / 1000).toFixed(2) + 's';
              const animationDuration = (3 + ((colSeed % 4000) / 1000)).toFixed(2) + 's';
              return (
                <div
                  key={i}
                  className="rain-column"
                  style={{
                    left: `${i * 2}%`,
                    animationDelay,
                    animationDuration,
                  }}
                >
                  {Array.from({ length: 20 }).map((_, j) => {
                    // Deterministic pseudo-random for each char
                    const charSeed = (colSeed + j * 7919) % 10000;
                    const char = charSeed % 2 === 0 ? "1" : "0";
                    return (
                      <span
                        key={j}
                        className="rain-char"
                        style={{
                          animationDelay: `${j * 0.1}s`,
                        }}
                      >
                        {char}
                      </span>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Floating Security Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="floating-element" style={{ top: "15%", left: "10%", animationDelay: "0s" }}>
            <div className="security-node">
              <Shield className="h-6 w-6 text-blue-500" />
            </div>
          </div>
          <div className="floating-element" style={{ top: "25%", right: "15%", animationDelay: "1s" }}>
            <div className="security-node">
              <Search className="h-6 w-6 text-green-500" />
            </div>
          </div>
          <div className="floating-element" style={{ top: "60%", left: "8%", animationDelay: "2s" }}>
            <div className="security-node">
              <BarChart3 className="h-6 w-6 text-purple-500" />
            </div>
          </div>
          <div className="floating-element" style={{ top: "45%", right: "8%", animationDelay: "1.5s" }}>
            <div className="security-node">
              <ExternalLink className="h-6 w-6 text-indigo-500" />
            </div>
          </div>
        </div>

        {/* Network Grid Overlay */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path
                  d="M 10 0 L 0 0 0 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-blue-300"
                />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        {/* Main Content */}
        <div className="relative container mx-auto px-4 py-24 text-center z-10">
          <div className="max-w-5xl mx-auto">
            {/* Animated Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-blue-200 dark:border-blue-700 mb-8 animate-pulse">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-ping"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                AI-Powered Security • Real-time Protection
              </span>
            </div>

            <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="block text-gray-800 dark:text-white mb-2">Advanced</span>
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent cyber-glitch">
                Phishing Detection
              </span>
            </h2>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              Protect yourself from online threats with our{" "}
              <span className="font-semibold text-blue-600 dark:text-blue-400">AI-powered URL analysis system</span>.
              Experience real-time, accurate, and secure URL scanning with advanced threat detection.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                size="lg"
                className="group bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-10 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-0"
                onClick={() => document.getElementById("scanner")?.scrollIntoView({ behavior: "smooth" })}
              >
                <span className="flex items-center">
                  Start Scanning Now
                  <Search className="ml-3 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                </span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="group border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-500 px-10 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
              >
                <span className="flex items-center">
                  View Demo
                  <ExternalLink className="ml-3 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                </span>
              </Button>
            </div>

            {/* Stats Preview */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">99.9%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">1M+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">URLs Scanned</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">&lt;2s</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Scan Time</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 fill-white dark:fill-gray-900">
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".25"
            ></path>
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              opacity=".5"
            ></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Powerful Security Features</h3>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Comprehensive protection with cutting-edge technology
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Search className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">URL Scanner</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-lg text-gray-600 dark:text-gray-400">
                  Analyze suspicious URLs instantly with our advanced AI detection algorithms
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <History className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Scan History</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-lg text-gray-600 dark:text-gray-400">
                  Track and manage your previous scans with detailed analysis results
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-lg text-gray-600 dark:text-gray-400">
                  View detailed threat analytics and security insights
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* URL Scanner */}
      <section id="scanner" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-2xl border-0 bg-white dark:bg-gray-900">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  URL Security Scanner
                </CardTitle>
                <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
                  Enter any URL to check for potential security threats
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex gap-4">
                    <Input
                      type="url"
                      placeholder="https://example.com"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="flex-1 h-14 text-lg border-2 focus:border-blue-500 rounded-xl"
                      required
                    />
                    <Button
                      type="submit"
                      disabled={isScanning}
                      className="h-14 px-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {isScanning ? (
                        <>
                          <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                          Scanning...
                        </>
                      ) : (
                        <>
                          <Search className="mr-2 h-5 w-5" />
                          Analyze
                        </>
                      )}
                    </Button>
                  </div>
                </form>

                {currentResult && (
                  <Card
                    className={`border-2 ${
                      currentResult.result === "Safe"
                        ? "border-green-200 bg-green-50 dark:bg-green-900/20"
                        : "border-red-200 bg-red-50 dark:bg-red-900/20"
                    }`}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              currentResult.result === "Safe" ? "bg-green-500" : "bg-red-500"
                            }`}
                          >
                            <Shield className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                              {currentResult.result === "Safe" ? "URL is Safe" : "Potential Threat Detected"}
                            </h4>
                            <p className="text-gray-600 dark:text-gray-400">Confidence: {currentResult.confidence}%</p>
                          </div>
                        </div>
                        <Badge
                          variant={currentResult.result === "Safe" ? "default" : "destructive"}
                          className="text-lg px-4 py-2"
                        >
                          {currentResult.result}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Statistics Dashboard */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Security Statistics</h3>
            <p className="text-xl text-gray-600 dark:text-gray-400">Your protection overview</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-8 pb-6">
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">{stats.total}</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">Total Scans</div>
              </CardContent>
            </Card>

            <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-8 pb-6">
                <div className="text-4xl font-bold text-red-600 dark:text-red-400 mb-2">{stats.threats}</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">Threats Detected</div>
              </CardContent>
            </Card>

            <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-8 pb-6">
                <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">{stats.safe}</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">Safe URLs</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Scan History */}
      {scanHistory.length > 0 && (
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Scan History</h3>

              <Card className="shadow-xl border-0">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>URL</TableHead>
                        <TableHead>Result</TableHead>
                        <TableHead>Confidence</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {scanHistory.slice(0, 10).map((scan) => (
                        <TableRow key={scan.date}>
                          <TableCell>{scan.date.slice(0, 10)}</TableCell>
                          <TableCell className="max-w-xs truncate">{scan.url}</TableCell>
                          <TableCell>
                            <Badge variant={scan.result === "Safe" ? "default" : "destructive"}>{scan.result}</Badge>
                          </TableCell>
                          <TableCell>{scan.confidence}%</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm" onClick={() => rescan(scan.url)}>
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => deleteFromHistory(scan.date)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h4 className="text-2xl font-bold">NetShield Pro</h4>
          </div>
          <p className="text-gray-400 mb-4">Advanced Phishing Detection & URL Security Analysis</p>
          <p className="text-gray-500">© 2025 NetShield Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
