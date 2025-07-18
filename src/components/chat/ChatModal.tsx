import React, { useState, useEffect, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { ScrollArea } from '../ui/scroll-area'
import { Send, X } from 'lucide-react'
import { useAuth } from '../../hooks/use-auth'
import { blink } from '../../blink/client'

interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar?: string
  text: string
  timestamp: Date
  isRead: boolean
}

interface ChatModalProps {
  isOpen: boolean
  onClose: () => void
  vendor: {
    id: number
    name: string
    image: string
    cuisine: string
    vendorType: string
  }
}

export function ChatModal({ isOpen, onClose, vendor }: ChatModalProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatChannelRef = useRef<any>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!isOpen || !user) return

    // Initialize chat with realtime functionality
    const initializeChat = async () => {
      try {
        setIsLoading(true)
        
        // Create a unique channel for this chat
        const channelName = `chat-${user.id}-${vendor.id}`
        chatChannelRef.current = blink.realtime.channel(channelName)
        
        // Subscribe to the channel
        await chatChannelRef.current.subscribe({
          userId: user.id,
          metadata: {
            displayName: user.displayName,
            userType: 'landlord' // Since landlords initiate contact
          }
        })

        // Listen for new messages
        chatChannelRef.current.onMessage((message: any) => {
          if (message.type === 'chat') {
            const newMsg: Message = {
              id: message.id,
              senderId: message.userId,
              senderName: message.metadata?.displayName || 'Unknown',
              senderAvatar: message.metadata?.avatar,
              text: message.data.text,
              timestamp: new Date(message.timestamp),
              isRead: message.userId === user.id
            }
            setMessages(prev => [...prev, newMsg])
          }
        })

        // Load existing messages from localStorage (temporary solution)
        const chatKey = `chat-${user.id}-${vendor.id}`
        const existingMessages = localStorage.getItem(chatKey)
        if (existingMessages) {
          setMessages(JSON.parse(existingMessages))
        } else {
          // Send initial welcome message from vendor
          const welcomeMessage: Message = {
            id: `welcome-${Date.now()}`,
            senderId: vendor.id.toString(),
            senderName: vendor.name,
            senderAvatar: vendor.image,
            text: `Hi! Thanks for your interest in ${vendor.name}. I'd love to hear about your space and discuss how we might work together. What type of property are you looking to partner with a ${vendor.cuisine.toLowerCase()} ${vendor.vendorType.toLowerCase()} for?`,
            timestamp: new Date(),
            isRead: false
          }
          setMessages([welcomeMessage])
          localStorage.setItem(chatKey, JSON.stringify([welcomeMessage]))
        }
      } catch (error) {
        console.error('Error initializing chat:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeChat()

    // Cleanup on close
    return () => {
      if (chatChannelRef.current) {
        chatChannelRef.current.unsubscribe()
      }
    }
  }, [isOpen, user, vendor])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user) return

    const messageText = newMessage.trim()
    setNewMessage('')

    try {
      // Create message object
      const message: Message = {
        id: `msg-${Date.now()}`,
        senderId: user.id,
        senderName: user.displayName,
        text: messageText,
        timestamp: new Date(),
        isRead: true
      }

      // Add to local state immediately (optimistic update)
      setMessages(prev => [...prev, message])

      // Save to localStorage (temporary solution)
      const chatKey = `chat-${user.id}-${vendor.id}`
      const updatedMessages = [...messages, message]
      localStorage.setItem(chatKey, JSON.stringify(updatedMessages))

      // Send via realtime channel
      if (chatChannelRef.current) {
        await chatChannelRef.current.publish('chat', {
          text: messageText,
          timestamp: Date.now()
        }, {
          userId: user.id,
          metadata: {
            displayName: user.displayName,
            userType: 'landlord'
          }
        })
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const handleClose = () => {
    if (chatChannelRef.current) {
      chatChannelRef.current.unsubscribe()
    }
    onClose()
  }

  if (!user) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={vendor.image} alt={vendor.name} />
              <AvatarFallback>{vendor.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{vendor.name}</h3>
              <p className="text-sm text-muted-foreground">{vendor.cuisine} • {vendor.vendorType}</p>
            </div>
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-4 top-4"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <ScrollArea className="flex-1 p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-muted-foreground">Loading chat...</div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.senderId === user.id ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={message.senderAvatar} alt={message.senderName} />
                    <AvatarFallback>{message.senderName.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.senderId === user.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.senderId === user.id
                          ? 'text-primary-foreground/70'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        <div className="p-6 pt-4 border-t">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button type="submit" disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-2">
            Tell {vendor.name} about your space, location, and what you're looking for in a food partner.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}