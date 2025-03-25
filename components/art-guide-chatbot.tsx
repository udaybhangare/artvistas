"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { X, Send, MessageSquare, Sparkles, ChevronUp, ChevronDown } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Types
type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

type ChatbotPersonality = "curator" | "artist" | "historian"

// Predefined prompts for different personalities
const personalityPrompts: Record<ChatbotPersonality, string> = {
  curator:
    "You are ArtGuide, a knowledgeable and formal museum curator assistant for ArtVistas virtual museum. Provide detailed, educational responses about art, artists, and exhibits. Use sophisticated language and art terminology.",
  artist:
    "You are Canvas, a creative and passionate artist assistant for ArtVistas virtual museum. Be expressive and inspirational when discussing art. Share personal perspectives on artistic techniques and movements with enthusiasm.",
  historian:
    "You are Chrono, a scholarly art historian assistant for ArtVistas virtual museum. Focus on historical context, timelines, and the evolution of art movements. Provide dates and historical references in your responses.",
}

export default function ArtGuideChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [personality, setPersonality] = useState<ChatbotPersonality>("curator")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Welcome to ArtVistas! I'm your personal art guide. How can I assist you with your virtual museum experience today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Initialize Gemini API
  const genAI = useRef<GoogleGenerativeAI | null>(null)
  const model = useRef<any>(null)

  useEffect(() => {
    // Initialize the Gemini API with the API key from environment variables
    if (typeof window !== "undefined" && !genAI.current) {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY

      if (apiKey) {
        genAI.current = new GoogleGenerativeAI(apiKey)
        model.current = genAI.current.getGenerativeModel({ model: "gemini-1.5-flash" })
      } else {
        console.error("Gemini API key is not defined in environment variables")
        setError(
          new Error("API key not configured. Please add NEXT_PUBLIC_GEMINI_API_KEY to your environment variables."),
        )
      }
    }
  }, [])

  // Scroll to bottom of chat when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Handle sending messages to Gemini API
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || isLoading) return

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setError(null)

    try {
      if (!model.current) {
        throw new Error("Gemini API not initialized")
      }

      // Prepare conversation history for context
      const chatHistory = messages
        .map((msg) => (msg.role === "user" ? `User: ${msg.content}` : `Assistant: ${msg.content}`))
        .join("\n")

      // Create the prompt with personality and chat history
      const prompt = `
        ${personalityPrompts[personality]}
        
        You are helping a visitor at the ArtVistas virtual museum and art gallery.
        
        Previous conversation:
        ${chatHistory}
        
        User: ${input}
        
        Assistant:
      `

      // Send request to Gemini API
      const result = await model.current.generateContent(prompt)
      const response = result.response.text()

      // Add assistant response to chat
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      console.error("Error sending message to Gemini API:", err)
      setError(err instanceof Error ? err : new Error("Failed to get response from AI"))
    } finally {
      setIsLoading(false)
    }
  }

  // Toggle chatbot open/closed
  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  // Toggle expanded view
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  // Change chatbot personality
  const changePersonality = (newPersonality: ChatbotPersonality) => {
    setPersonality(newPersonality)
  }

  return (
    <div className="fixed z-50 flex flex-col items-end bottom-6 right-6">
      {/* Main Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={cn(
              "mb-4 rounded-2xl shadow-lg overflow-hidden flex flex-col",
              "bg-background border border-border",
              isExpanded ? "w-[450px] h-[600px]" : "w-[350px] h-[450px]",
            )}
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b bg-primary/5">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8 bg-primary">
                  <Sparkles className="w-4 h-4 text-primary-foreground" />
                </Avatar>
                <div>
                  <h3 className="text-sm font-semibold">
                    {personality === "curator" ? "ArtGuide" : personality === "artist" ? "Canvas" : "Chrono"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {personality === "curator"
                      ? "Museum Curator"
                      : personality === "artist"
                        ? "Creative Artist"
                        : "Art Historian"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="rounded-full h-7 w-7" onClick={toggleExpanded}>
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full h-7 w-7" onClick={toggleChat}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Personality Selector */}
            <div className="flex items-center justify-between px-4 py-2 border-b bg-background">
              <div className="text-xs text-muted-foreground">Choose your guide:</div>
              <div className="flex gap-1">
                <Button
                  variant={personality === "curator" ? "default" : "outline"}
                  size="sm"
                  className="px-3 text-xs rounded-full h-7"
                  onClick={() => changePersonality("curator")}
                >
                  Curator
                </Button>
                <Button
                  variant={personality === "artist" ? "default" : "outline"}
                  size="sm"
                  className="px-3 text-xs rounded-full h-7"
                  onClick={() => changePersonality("artist")}
                >
                  Artist
                </Button>
                <Button
                  variant={personality === "historian" ? "default" : "outline"}
                  size="sm"
                  className="px-3 text-xs rounded-full h-7"
                  onClick={() => changePersonality("historian")}
                >
                  Historian
                </Button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-muted rounded-tl-none",
                    )}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="px-4 py-2 rounded-tl-none bg-muted rounded-2xl">
                    <div className="flex space-x-1">
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, delay: 0 }}
                        className="w-2 h-2 rounded-full bg-primary/60"
                      />
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, delay: 0.2 }}
                        className="w-2 h-2 rounded-full bg-primary/60"
                      />
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, delay: 0.4 }}
                        className="w-2 h-2 rounded-full bg-primary/60"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about artworks, artists, or exhibits..."
                  className="flex-1 border-none rounded-full bg-muted focus-visible:ring-primary"
                />
                <Button type="submit" size="icon" className="rounded-full" disabled={isLoading || !input.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              {error && (
                <p className="mt-2 text-xs text-destructive">
                  Error: {error.message || "Something went wrong. Please try again."}
                </p>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleChat}
        className={cn(
          "flex items-center justify-center rounded-full shadow-lg p-4",
          "bg-primary text-primary-foreground",
          "transition-all duration-300 ease-in-out",
          isOpen ? "rotate-90" : "rotate-0",
        )}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </motion.button>
    </div>
  )
}

